import { expect, test } from "@playwright/test";
import { images, photographs } from "../../src/content/images.ts";
import {
  expectNoHorizontalScroll,
  expectNoOverlapOrCutOff,
  failing,
  measureTextOverPhotographs,
  parseColor,
  pictureWithoutText,
  placeInFrame,
  photographWidths,
  scrollThrough,
  styleOf,
} from "./helpers.ts";

const heights: Record<number, number> = { 390: 844, 768: 1024, 1440: 900, 1920: 1080 };

test.describe("the chosen photographs", () => {
  test("the landscape images of the site are the four chosen photographs and nothing else", async ({ page }) => {
    const shown = new Set<string>();
    for (const path of ["/", "/projects/rick", "/community", "/no-such-page"]) {
      await page.goto(path);
      for (const id of await page.locator("[data-photograph]").evaluateAll((all) => all.map((e) => (e as HTMLElement).dataset.photograph ?? ""))) {
        shown.add(id);
      }
    }
    expect([...shown].sort()).toEqual(["basaltColumns", "rocksInFog", "seaStack", "stacksAmberSky"]);
    expect(photographs().map((record) => record.file).sort()).toEqual([
      "photographs/basalt-columns.jpg",
      "photographs/rocks-in-fog.jpg",
      "photographs/sea-stack.jpg",
      "photographs/stacks-amber-sky.jpg",
    ]);
  });

  test("every photograph covers its frame", async ({ page }) => {
    for (const [width, height] of [[1440, 900], [390, 844]]) {
      await page.setViewportSize({ width, height });
      for (const path of ["/", "/projects/rick"]) {
        await page.goto(path);
        await scrollThrough(page);
        const gaps = await page.locator("[data-photograph]").evaluateAll((frames) =>
          frames
            .filter((frame) => {
              const visible = frame.getBoundingClientRect();
              const picture = frame.querySelector("img")!.getBoundingClientRect();
              return (
                picture.left > visible.left + 1 ||
                picture.top > visible.top + 1 ||
                picture.right < visible.right - 1 ||
                picture.bottom < visible.bottom - 1
              );
            })
            .map((frame) => (frame as HTMLElement).dataset.photograph),
        );
        expect(gaps, `${path} at ${width}`).toEqual([]);
      }
    }
  });

  test("no drawn landscape is shown on any page", async ({ page }) => {
    for (const path of ["/", "/projects/rick", "/community", "/no-such-page"]) {
      await page.goto(path);
      await scrollThrough(page);
      const sources = await page.locator("img").evaluateAll((all) => all.map((img) => (img as HTMLImageElement).currentSrc));
      expect(sources.join("\n")).not.toMatch(/stand-in\.svg/);
      expect(sources.filter((src) => /\.svg/.test(src) && !/screenshot-frame/.test(src))).toEqual([]);
    }
  });

  test("the moss on the sea stack does not read as green", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projects/rick");
    await scrollThrough(page);
    const band = page.locator('[data-photograph="seaStack"]');
    await band.scrollIntoViewIfNeeded();
    const shot = (await band.screenshot({ type: "png" })).toString("base64");
    const green = await page.evaluate(async (shot) => {
      const image = new Image();
      image.src = `data:image/png;base64,${shot}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      let count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
        // Green: the green channel clearly leads both others.
        if (g > r + 12 && g > b + 12) count++;
      }
      return count / (data.length / 4);
    }, shot);
    expect(green).toBeLessThan(0.0005);
  });
});

test.describe("photographs are shown sharp", () => {
  test("at 1440 wide and two device pixels per pixel the first screen's photograph arrives at least 2880 wide", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto("/");
    const img = page.locator('[data-photograph="basaltColumns"] img');
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0), { timeout: 60_000 }).toBe(true);
    const src = await img.evaluate((e: HTMLImageElement) => e.currentSrc);
    // The file that was chosen, and what arrived: at least 2880 pixels wide.
    expect(Number(new URL(src).searchParams.get("w"))).toBeGreaterThanOrEqual(2880);
    const arrived = await page.evaluate(async (src) => (await createImageBitmap(await (await fetch(src)).blob())).width, src);
    expect(arrived).toBeGreaterThanOrEqual(2880);
    expect(src).toMatch(/\/_next\/image\?url=%2Fimages%2Fphotographs%2Fbasalt-columns\.jpg/);
    // A current format, chosen by what the browser accepts.
    const response = await page.request.get(src, { headers: { accept: "image/avif,image/webp,*/*" } });
    expect(response.headers()["content-type"]).toBe("image/avif");
    const fallback = await page.request.get(src, { headers: { accept: "image/webp,*/*" } });
    expect(fallback.headers()["content-type"]).toBe("image/webp");
    const plain = await page.request.get(src, { headers: { accept: "image/jpeg" } });
    expect(plain.headers()["content-type"]).toBe("image/jpeg");
    await context.close();
  });

  test("at 390 wide a smaller file arrives than at 1440", async ({ browser }) => {
    const widthAt = async (width: number, height: number) => {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
      const page = await context.newPage();
      await page.goto("/");
      const img = page.locator('[data-photograph="basaltColumns"] img');
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0), { timeout: 60_000 }).toBe(true);
      const src = await img.evaluate((e: HTMLImageElement) => e.currentSrc);
      const bytes = (await (await page.request.get(src, { headers: { accept: "image/avif" } })).body()).length;
      const natural = Number(new URL(src).searchParams.get("w"));
      await context.close();
      return { natural, bytes };
    };
    const phone = await widthAt(390, 844);
    const desktop = await widthAt(1440, 900);
    expect(phone.natural).toBeLessThan(desktop.natural);
    expect(phone.bytes).toBeLessThan(desktop.bytes);
  });

  test("no blurred preview is shown, nothing softens a photograph, and nothing moves when it arrives", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    // Hold the photographs back, and note where everything is without them.
    let release = () => {};
    const held = new Promise<void>((resolve) => (release = resolve));
    await page.route("**/_next/image?url=%2Fimages%2Fphotographs**", async (route) => {
      await held;
      await route.fallback();
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const places = () =>
      page.locator("main h1, main h2, main article, footer").evaluateAll((all) => all.map((e) => Math.round(e.getBoundingClientRect().top + window.scrollY)));
    const before = await places();
    for (const img of await page.locator("[data-photograph] img").all()) {
      // No blurred preview: the image has no background of its own while it loads.
      expect(await styleOf(img, "background-image")).toBe("none");
      expect(await styleOf(img, "filter")).toBe("none");
    }
    // Its place has a flat tone taken from the picture.
    const tone = parseColor(await styleOf(page.locator('[data-photograph="basaltColumns"]'), "background-color"));
    expect(tone.rgb.map(Math.round)).toEqual([30, 33, 36]);
    release();
    await scrollThrough(page);
    expect(await places()).toEqual(before);
    for (const wrapper of await page.locator("[data-photograph]").all()) {
      expect(await styleOf(wrapper, "filter")).toBe("none");
      expect(await styleOf(wrapper, "opacity")).toBe("1");
    }
  });

  test("the first screen's photograph is requested with priority, the others only as they come near", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const requested: string[] = [];
    page.on("request", (request) => {
      const match = /photographs%2F([a-z-]+)\.jpg/.exec(request.url());
      if (match) requested.push(match[1]);
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // First the photograph of the first screen. The band above the footer, far below, not yet.
    expect(requested[0]).toBe("basalt-columns");
    expect(requested).not.toContain("stacks-amber-sky");
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute("imagesrcset", /basalt-columns/);
    expect(await page.locator('[data-photograph="rocksInFog"] img').getAttribute("loading")).toBe("lazy");
    await scrollThrough(page);
    expect(new Set(requested)).toEqual(new Set(["basalt-columns", "rocks-in-fog", "stacks-amber-sky"]));
  });
});

test.describe("the first screen over the basalt columns", () => {
  test("at 1440 by 900 the photograph fills the screen behind the navigation, the text and the card", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const first = page.locator("main section").first();
    const section = (await first.boundingBox())!;
    const photograph = (await first.locator("[data-photograph]").boundingBox())!;
    expect(Math.round(section.height)).toBe(900);
    // From edge to edge, covering the whole screen. The picture itself is about
    // 1600 wide and anchored to the left edge.
    expect(Math.round(photograph.x)).toBe(0);
    expect(Math.round(photograph.width)).toBe(1440);
    expect(Math.round(photograph.height)).toBe(900);
    expect(Math.round((await first.locator("[data-photograph] img").boundingBox())!.width)).toBeLessThanOrEqual(1605);
    expect(await styleOf(first.locator("[data-photograph] img"), "object-position")).toBe("0% 50%");
    expect(Math.round((await first.locator("[data-photograph] img").boundingBox())!.width)).toBeGreaterThanOrEqual(1595);
    // The navigation and the card lie over it.
    const nav = (await page.getByRole("navigation", { name: "Main" }).boundingBox())!;
    expect(nav.y + nav.height).toBeLessThan(section.height);
    const card = (await first.locator("article").boundingBox())!;
    expect(card.x).toBeGreaterThan(1000);
    expect(card.y + card.height).toBeLessThan(900);
  });

  test("the headline and the lines under it are light, and the label has their colour with an amber mark", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("main section").first();
    const headline = await styleOf(first.getByRole("heading", { level: 1 }), "color");
    expect(parseColor(headline).rgb.map(Math.round)).toEqual([245, 247, 248]);
    const label = first.locator("p").first();
    await expect(label).toHaveText("Open-Breach · Open source tools");
    expect(await styleOf(label, "color")).toBe(headline);
    const mark = label.locator("[data-label-mark]");
    expect(parseColor(await styleOf(mark, "background-color")).rgb.map(Math.round)).toEqual([255, 138, 31]);
    expect((await mark.boundingBox())!.width).toBe(8);
    // The label of the Rick card has the same form, in the colour of the card's text.
    const card = first.locator("article");
    const cardLabel = card.locator("p").first();
    expect(await styleOf(cardLabel, "color")).toBe(await styleOf(card.getByRole("heading"), "color"));
    await expect(cardLabel.locator("[data-label-mark]")).toHaveCount(1);
    // The Explore links keep the darker amber.
    expect(parseColor(await styleOf(card.getByText("Explore"), "color")).rgb.map(Math.round)).toEqual([160, 74, 0]);
  });

  test("no veil lies over the photograph", async ({ page }) => {
    await page.goto("/");
    const layers = await page.locator("main section").first().evaluate((section) => {
      const photograph = section.querySelector("[data-photograph]")!;
      const area = photograph.getBoundingClientRect();
      // Anything with a fill of its own that covers a fifth of the photograph or more.
      return [...section.querySelectorAll("*")].filter((element) => {
        if (element === photograph || photograph.contains(element)) return false;
        const style = getComputedStyle(element);
        if (style.backgroundColor === "rgba(0, 0, 0, 0)" && style.backgroundImage === "none") return false;
        const rect = element.getBoundingClientRect();
        return rect.width * rect.height >= 0.2 * area.width * area.height;
      }).length;
    });
    expect(layers).toBe(0);
  });

  for (const width of photographWidths) {
    test(`at ${width} wide every line of text over a photograph has its contrast, and nothing overlaps`, async ({ page }) => {
      await page.setViewportSize({ width, height: heights[width] });
      await page.goto("/");
      const lines = await measureTextOverPhotographs(page);
      // The first screen's text, the navigation, the card and the mission statement are measured.
      const texts = lines.map((line) => line.text).join(" | ");
      expect(texts).toContain("Open tools,");
      expect(texts).toContain("builds the next generation of tools");
      expect(texts).toContain("Join the discussion");
      expect(texts).toContain("A file manager written in Rust.");
      expect(lines.filter((line) => line.photograph === "rocksInFog").length).toBeGreaterThan(5);
      expect(failing(lines)).toEqual([]);
      await expectNoHorizontalScroll(page);
      await expectNoOverlapOrCutOff(page);
    });
  }

  test("the measurement fails when the headline is set to Basalt for a trial", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.addStyleTag({ content: "#hero-heading { color: #1e2124 !important; }" });
    const failed = failing(await measureTextOverPhotographs(page));
    expect(failed.length).toBeGreaterThanOrEqual(2);
    expect(failed.join("\n")).toContain("Open tools,");
    expect(failed.join("\n")).toContain("built in the open.");
  });
});

test.describe("the rocks in fog behind the mission statement", () => {
  for (const width of photographWidths) {
    test(`at ${width} wide the fog passes into the pale ground without an edge, and the rocks close the section`, async ({ page }) => {
      await page.setViewportSize({ width, height: heights[width] });
      await page.goto("/");
      const mission = page.locator("#mission");
      await mission.scrollIntoViewIfNeeded();
      const photograph = mission.locator('[data-photograph="rocksInFog"]');
      await expect.poll(() => photograph.locator("img").evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      const section = (await mission.boundingBox())!;
      const box = (await photograph.boundingBox())!;
      // From edge to edge, and down to the straight lower edge of the section.
      expect(Math.round(box.x)).toBe(0);
      expect(Math.round(box.width)).toBe(width);
      expect(Math.round(box.y + box.height)).toBe(Math.round(section.y + section.height));
      // Its top is fully transparent and becomes whole further down: no edge.
      const mask = await styleOf(photograph, "mask-image");
      expect(mask).toMatch(/^linear-gradient\(rgba\(0, 0, 0, 0\) /);
      expect(mask).toMatch(/rgb\(0, 0, 0\) calc\([^)]*\)\)$|rgb\(0, 0, 0\) [\d.]+%\)$/);
      // Read from the page: at the top of its frame the photograph is not there yet, and it comes in without a step.
      // Back to the top, so that the navigation, which stays in place, is not in the picture here.
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      // Where the frame starts in the page, noted before the picture is taken.
      const top = await photograph.evaluate((e) => Math.round(e.getBoundingClientRect().top + window.scrollY));
      const shot = await pictureWithoutText(page);
      const step = await page.evaluate(
        async ({ shot, y }) => {
          const image = new Image();
          image.src = `data:image/png;base64,${shot}`;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext("2d")!;
          context.drawImage(image, 0, 0);
          const row = (at: number) => context.getImageData(0, at, canvas.width, 1).data;
          // Two rows inside the top of the photograph's frame: where an edge would be.
          const above = row(y + 1);
          const below = row(y + 9);
          let most = 0;
          for (let i = 0; i < above.length; i++) most = Math.max(most, Math.abs(above[i] - below[i]));
          return most;
        },
        { shot, y: top },
      );
      // With the text hidden, the ground changes by no more than a shade across the line.
      expect(step).toBeLessThanOrEqual(3);
    });
  }

  test("the text lies in the upper part, in the dark text colours", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const mission = page.locator("#mission");
    const statement = mission.getByText("Open-Breach exists so that");
    expect(parseColor(await styleOf(statement, "color")).rgb.map(Math.round)).toEqual([30, 33, 36]);
    const photograph = (await mission.locator("[data-photograph]").boundingBox())!;
    const last = (await mission.locator("p").last().boundingBox())!;
    // The text ends in the upper half of the picture, above the rocks.
    expect(last.y + last.height).toBeLessThan(photograph.y + photograph.height * 0.5);
  });
});

test.describe("the band above the footer", () => {
  for (const path of ["/", "/projects/rick", "/no-such-page", "/community"]) {
    test(`${path} ends with the stacks under the amber sky, from edge to edge, with no text over it`, async ({ page }) => {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: heights[width] });
        await page.goto(path);
        const band = page.locator('footer [data-photograph="stacksAmberSky"]');
        await expect(band).toHaveCount(1);
        await band.scrollIntoViewIfNeeded();
        const box = (await band.boundingBox())!;
        expect(Math.round(box.x)).toBe(0);
        expect(Math.round(box.width)).toBe(width);
        expect(box.height).toBeGreaterThan(250);
        // Its sky passes into the pale ground above it.
        expect(await styleOf(band, "mask-image")).toContain("linear-gradient");
        const lines = await measureTextOverPhotographs(page);
        expect(lines.filter((line) => line.photograph === "stacksAmberSky")).toEqual([]);
      }
    });
  }

  test("the tips of the stacks are in full view and the horizon lies in the lower third", async ({ page }) => {
    for (const [width, height] of [[1440, 900], [390, 844], [1920, 1080]]) {
      await page.setViewportSize({ width, height });
      await page.goto("/");
      const band = page.locator('footer [data-photograph="stacksAmberSky"]');
      await band.scrollIntoViewIfNeeded();
      const img = band.locator("img");
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      // In the photograph the tips reach up to 32 per cent of its height, the horizon is at
      // 58 per cent, and the stacks stand between 27 and 83 per cent of its width.
      const places = {
        tips: (await placeInFrame(band, { x: 0.5, y: 0.32 })).y,
        horizon: (await placeInFrame(band, { x: 0.5, y: 0.58 })).y,
        left: (await placeInFrame(band, { x: 0.27, y: 0.5 })).x,
        right: (await placeInFrame(band, { x: 0.83, y: 0.5 })).x,
        fade: (await band.evaluate((e) => parseFloat(getComputedStyle(e).getPropertyValue("--fade-end")))) / 100,
      };
      expect(places.tips, `tips below the fade at ${width}`).toBeGreaterThanOrEqual(places.fade);
      expect(places.horizon, `horizon in the lower third at ${width}`).toBeGreaterThanOrEqual(0.66);
      expect(places.horizon).toBeLessThan(0.9);
      expect(places.left, `the left stack is in view at ${width}`).toBeGreaterThanOrEqual(0);
      expect(places.right, `the right stack is in view at ${width}`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("the sea stack at the end of the opening of a project page", () => {
  for (const path of ["/projects/rick", "/fixtures/project"]) {
    test(`${path} shows it below the opening's text and screenshot, with no text over it`, async ({ page }) => {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: heights[width] });
        await page.goto(path);
        const opening = page.locator("#about");
        const stack = opening.locator('[data-photograph="seaStack"]');
        await expect(stack).toHaveCount(1);
        await stack.scrollIntoViewIfNeeded();
        const box = (await stack.boundingBox())!;
        expect(Math.round(box.x)).toBe(0);
        expect(Math.round(box.width)).toBe(width);
        // Below everything else of the opening, and closing it.
        const section = (await opening.boundingBox())!;
        expect(Math.round(box.y + box.height)).toBe(Math.round(section.y + section.height));
        const content = await opening.locator("h1, p, ul, a, img").evaluateAll((all) =>
          Math.max(...all.filter((e) => !e.closest("[data-photograph]")).map((e) => e.getBoundingClientRect().bottom + window.scrollY)),
        );
        expect(content).toBeLessThanOrEqual(box.y + (await page.evaluate(() => window.scrollY)) + 1);
        expect(await styleOf(stack, "mask-image")).toContain("linear-gradient");
        const lines = await measureTextOverPhotographs(page);
        expect(lines.filter((line) => line.photograph === "seaStack")).toEqual([]);
        expect(failing(lines)).toEqual([]);
      }
    });
  }

  test("the stack stands right of the middle with its base and the waterline in view", async ({ page }) => {
    for (const [width, height] of [[1440, 900], [390, 844]]) {
      await page.setViewportSize({ width, height });
      await page.goto("/projects/rick");
      const stack = page.locator('[data-photograph="seaStack"]');
      await stack.scrollIntoViewIfNeeded();
      const img = stack.locator("img");
      await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
      // In the photograph the stack stands between 59 and 92 per cent of its width, and its base
      // and the waterline are at 62 per cent of its height.
      const places = {
        left: (await placeInFrame(stack, { x: 0.59, y: 0.5 })).x,
        right: (await placeInFrame(stack, { x: 0.92, y: 0.5 })).x,
        waterline: (await placeInFrame(stack, { x: 0.75, y: 0.62 })).y,
      };
      expect(places.left).toBeGreaterThan(width > 1000 ? 0.45 : 0);
      // On a wide screen the out-of-focus cliff, the left quarter of the photograph, stays outside the frame.
      if (width > 1000) expect((await placeInFrame(stack, { x: 0.22, y: 0.5 })).x).toBeLessThanOrEqual(0.01);
      // The whole stack stands below the fade: its tip is at 19 per cent of the photograph's height.
      const fade = (await stack.evaluate((e) => parseFloat(getComputedStyle(e).getPropertyValue("--fade-end")))) / 100;
      expect((await placeInFrame(stack, { x: 0.75, y: 0.19 })).y).toBeGreaterThanOrEqual(fade);
      expect(places.right).toBeLessThanOrEqual(1);
      expect(places.waterline).toBeGreaterThan(0.5);
      expect(places.waterline).toBeLessThan(0.95);
    }
  });
});

test.describe("credits", () => {
  test("the footer names the four photographers, and each name leads to the page the photograph comes from", async ({ page }) => {
    for (const path of ["/", "/projects/rick"]) {
      await page.goto(path);
      const credits = page.locator("footer [data-credits]");
      await expect(credits).toContainText("Photographs by");
      const links = await credits.getByRole("link").evaluateAll((all) => all.map((a) => [a.textContent, a.getAttribute("href")]));
      expect(links).toEqual([
        ["Sebastian Spindler", images.basaltColumns.source],
        ["Mads Eneqvist", images.rocksInFog.source],
        ["Leo_Visions", images.stacksAmberSky.source],
        ["Joseph Corl", images.seaStack.source],
      ]);
      for (const [, href] of links) expect(href).toMatch(/^https:\/\/unsplash\.com\/photos\//);
    }
  });
});

test.describe("sample data is marked", () => {
  test("the note stands beside data that carries the marker", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#releases").getByText("Sample data")).toBeVisible();
    await page.goto("/projects/rick");
    await expect(page.locator("#about").getByText("Sample data")).toBeVisible();
  });

  test("the note is absent beside data that is real", async ({ page }) => {
    await page.goto("/fixtures/real-data");
    await expect(page.locator("#releases ol > li")).toHaveCount(5);
    await expect(page.getByText("Sample data")).toHaveCount(0);
    await page.goto("/fixtures/real-data/project");
    await expect(page.locator("#about ul").first().getByRole("listitem")).toHaveCount(4);
    await expect(page.getByText("Sample data")).toHaveCount(0);
  });
});
