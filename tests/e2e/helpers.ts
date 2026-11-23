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
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}
