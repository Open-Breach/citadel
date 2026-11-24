import { expect, type Locator, type Page } from "@playwright/test";

/** The two widths every page is checked at, with a usual height for each. */
export const phone = { width: 390, height: 844 };
export const desktop = { width: 1440, height: 900 };
export const sizes = [
  { name: "390 wide", viewport: phone },
  { name: "1440 wide", viewport: desktop },
];

type Rgb = [number, number, number];

/** Reads "rgb(…)", "rgba(…)" and "color(srgb …)" as the browser computes them. */
export function parseColor(value: string): { rgb: Rgb; alpha: number } {
  const srgb = /^color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.e-]+))?\)$/.exec(value);
  if (srgb) {
    return {
      rgb: [1, 2, 3].map((i) => Number(srgb[i]) * 255) as Rgb,
      alpha: srgb[4] === undefined ? 1 : Number(srgb[4]),
    };
  }
  const rgb = /^rgba?\(([\d.]+),? ([\d.]+),? ([\d.]+)(?:,? ?\/? ?([\d.]+))?\)$/.exec(value);
  if (rgb) {
    return {
      rgb: [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])],
      alpha: rgb[4] === undefined ? 1 : Number(rgb[4]),
    };
  }
  throw new Error(`Cannot read the colour "${value}"`);
}

function luminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** The WCAG contrast of two colours. */
export function contrast(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

export async function styleOf(locator: Locator, property: string): Promise<string> {
  return locator.evaluate(
    (element, name) => getComputedStyle(element).getPropertyValue(name),
    property,
  );
}

/** The page does not scroll sideways. */
export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, "the page is no wider than the screen").toBeLessThanOrEqual(clientWidth);
}

/**
 * No overlapping content and no text cut off: the sections of the page
 * follow each other, nothing reaches out of the screen, no two blocks of
 * text share the same space, and no text is clipped by its box.
 */
export async function expectNoOverlapOrCutOff(page: Page) {
  const problems = await page.evaluate(() => {
    const found: string[] = [];
    const name = (element: Element) =>
      `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""} "${(element.textContent ?? "").trim().slice(0, 40)}"`;

    // Sections follow each other.
    const sections = [...document.querySelectorAll("main > section")];
    sections.forEach((section, index) => {
      const next = sections[index + 1];
      if (!next) return;
      if (section.getBoundingClientRect().bottom > next.getBoundingClientRect().top + 1) {
        found.push(`${name(section)} overlaps ${name(next)}`);
      }
    });

    // Leaves of text: elements that hold text themselves.
    const leaves = [...document.querySelectorAll("main *, footer *")].filter((element) => {
      if (element.closest("dialog, .sr-only, [hidden], svg")) return false;
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return false;
      return [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
      );
    });

    const width = document.documentElement.clientWidth;
    // A box that scrolls inside shows only what fits: text in it counts as far as the box reaches.
    const visibleRect = (element: Element) => {
      const rect = element.getBoundingClientRect();
      const scroller = element.closest("pre");
      if (!scroller) return rect;
      const frame = scroller.getBoundingClientRect();
      const left = Math.max(rect.left, frame.left);
      const right = Math.min(rect.right, frame.right);
      return new DOMRect(left, rect.top, Math.max(0, right - left), rect.height);
    };
    const boxes = leaves.map((element) => ({ element, rect: visibleRect(element) }));

    for (const { element, rect } of boxes) {
      if (rect.width === 0 || rect.height === 0) continue;
      const scrolls = element.closest("pre");
      if (!scrolls && (rect.left < -1 || rect.right > width + 1)) {
        found.push(`${name(element)} reaches out of the screen`);
      }
      const style = getComputedStyle(element);
      const clips = style.overflowX !== "visible" && style.overflowX !== "auto";
      if (clips && element.scrollWidth > element.clientWidth + 1) {
        found.push(`${name(element)} is cut off`);
      }
    }

    // No two leaves of text share space, unless one holds the other.
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i];
        const b = boxes[j];
        if (a.element.contains(b.element) || b.element.contains(a.element)) continue;
        if (a.rect.width === 0 || b.rect.width === 0) continue;
        const overlapX = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
        const overlapY = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
        if (overlapX > 2 && overlapY > 2) found.push(`${name(a.element)} overlaps ${name(b.element)}`);
      }
    }
    return found;
  });
  expect(problems, "overlapping or cut-off content").toEqual([]);
}

/** Whether the element lies inside the screen as it is scrolled now. */
export async function isInViewport(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  });
}

/**
 * Records every request the page makes to a host other than the site's
 * own. Those requests are stopped, so the tests never reach the network.
 */
export async function recordForeignRequests(page: Page, baseURL: string): Promise<string[]> {
  const own = new URL(baseURL).host;
  const foreign: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.protocol === "data:" || url.protocol === "blob:" || url.host === own) {
      return route.fallback();
    }
    foreign.push(route.request().url());
    return route.abort();
  });
  return foreign;
}

/** Scrolls through the whole page, so that images further down are loaded. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => window.scrollY === 0);
}

/**
 * Opens a page and waits until its scripts have run, so that the controls
 * that need them (the menu, the larger view, Copy) answer.
 */
export async function gotoReady(page: Page, path: string) {
  const response = await page.goto(path);
  await page.waitForLoadState("networkidle");
  return response;
}

/** The four widths at which text over photographs is measured (design D5 of add-photographs). */
export const photographWidths = [390, 768, 1440, 1920];

export type MeasuredLine = {
  text: string;
  /** The photograph the line lies over. */
  photograph: string;
  required: number;
  /** The share of the pixels under the line that fall below the requirement. */
  below: number;
  /** The contrast that 19 of 20 pixels under the line reach. */
  contrast: number;
};

/**
 * Measures the contrast of every line of text that lies over a photograph,
 * on the rendered page.
 *
 * It notes each line with its place, its colour and its size, hides all
 * text, takes a picture of the whole page, and reads the pixels under each
 * line. The requirement is 4.5 to 1, or 3 to 1 for large text. A line passes
 * when at most one pixel in twenty is below it.
 */
export async function measureTextOverPhotographs(page: Page): Promise<MeasuredLine[]> {
  await scrollThrough(page);
  await page.waitForFunction(() =>
    [...document.querySelectorAll<HTMLImageElement>("[data-photograph] img")].every(
      (img) => img.complete && img.naturalWidth > 0,
    ),
  );

  const lines = await page.evaluate(() => {
    const photographs = [...document.querySelectorAll<HTMLElement>("[data-photograph]")].map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        id: element.dataset.photograph ?? "",
        left: Math.max(0, rect.left),
        right: Math.min(document.documentElement.clientWidth, rect.right),
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
      };
    });
    const found: { text: string; photograph: string; colour: string; large: boolean; x: number; y: number; w: number; h: number }[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = (node.textContent ?? "").trim();
      const parent = node.parentElement;
      if (!text || !parent || parent.closest("dialog, [hidden], .sr-only, script, style, noscript")) continue;
      const style = getComputedStyle(parent);
      if (style.visibility === "hidden" || style.display === "none") continue;
      const size = parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width < 2 || rect.height < 2) continue;
        const line = { x: rect.left, y: rect.top + window.scrollY, w: rect.width, h: rect.height };
        const over = photographs.find(
          (p) => line.x < p.right && line.x + line.w > p.left && line.y < p.bottom && line.y + line.h > p.top,
        );
        if (over) found.push({ text: text.slice(0, 48), photograph: over.id, colour: style.color, large, ...line });
      }
    }
    return found;
  });

  // Hide all text, so that the picture of the page shows what lies behind it.
  const picture = await pictureWithoutText(page);

  return page.evaluate(
    async ({ picture, lines }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${picture}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true })!;
      context.drawImage(image, 0, 0);
      // The picture may have more pixels than the page has CSS pixels.
      const scale = image.naturalWidth / document.documentElement.clientWidth;

      const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      const luminance = (r: number, g: number, b: number) =>
        0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      const read = (value: string) => {
        const probe = document.createElement("canvas").getContext("2d")!;
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        return luminance(r, g, b);
      };

      return lines.map((line) => {
        const text = read(line.colour);
        const required = line.large ? 3 : 4.5;
        const x = Math.max(0, Math.floor(line.x * scale));
        const y = Math.max(0, Math.floor(line.y * scale));
        const w = Math.max(1, Math.min(canvas.width - x, Math.ceil(line.w * scale)));
        const h = Math.max(1, Math.min(canvas.height - y, Math.ceil(line.h * scale)));
        const { data } = context.getImageData(x, y, w, h);
        const ratios: number[] = [];
        for (let i = 0; i < data.length; i += 4) {
          const behind = luminance(data[i], data[i + 1], data[i + 2]);
          ratios.push((Math.max(text, behind) + 0.05) / (Math.min(text, behind) + 0.05));
        }
        ratios.sort((a, b) => a - b);
        return {
          text: line.text,
          photograph: line.photograph,
          required,
          below: ratios.filter((ratio) => ratio < required).length / ratios.length,
          contrast: Number(ratios[Math.floor(ratios.length * 0.05)].toFixed(2)),
        };
      });
    },
    { picture, lines },
  );
}

/** The lines that fail: more than one pixel in twenty under them is below the requirement. */
export function failing(lines: MeasuredLine[]): string[] {
  return lines
    .filter((line) => line.below > 0.05)
    .map((line) => `"${line.text}" over ${line.photograph}: ${line.contrast} to 1, needs ${line.required}`);
}

/** The same page with its text hidden, as one picture, for reading what lies behind the text. */
export async function pictureWithoutText(page: Page): Promise<string> {
  const hidden = await page.addStyleTag({
    // Transitions are off, so that no text is caught half-hidden.
    content:
      "*, *::before, *::after { color: transparent !important; text-shadow: none !important; transition: none !important; }",
  });
  const picture = (await page.screenshot({ fullPage: true, type: "png" })).toString("base64");
  await hidden.evaluate((element) => (element as Element).remove());
  return picture;
}

/**
 * Where a place of a photograph lands inside its frame, as shares of the
 * frame's width and height. The place is given as shares of the picture.
 */
export async function placeInFrame(frame: Locator, at: { x: number; y: number }) {
  return frame.evaluate((element, at) => {
    const img = element.querySelector("img")!;
    const visible = element.getBoundingClientRect();
    const box = img.getBoundingClientRect();
    const [px, py] = getComputedStyle(img).objectPosition.split(" ").map((value) => parseFloat(value) / 100);
    const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const shown = { w: img.naturalWidth * scale, h: img.naturalHeight * scale };
    const left = box.left + (box.width - shown.w) * px + at.x * shown.w;
    const top = box.top + (box.height - shown.h) * py + at.y * shown.h;
    return { x: (left - visible.left) / visible.width, y: (top - visible.top) / visible.height };
  }, at);
}
