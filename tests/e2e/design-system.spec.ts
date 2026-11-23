import { expect, test, type Page } from "@playwright/test";
import { contrast, desktop, parseColor, phone, sizes, styleOf } from "./helpers.ts";

const mist: [number, number, number] = [245, 247, 248];
const amber: [number, number, number] = [255, 138, 31];

/**
 * Every colour that elements of the page use for text, fills, lines and
 * marks, as hue and saturation. Images are not looked into.
 */
async function coloursInUse(page: Page) {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
    const read = (value: string) => {
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = value;
      canvas.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a };
    };
    const seen = new Map<string, { hue: number; saturation: number; where: string }>();
    for (const element of document.querySelectorAll("body *")) {
      const style = getComputedStyle(element);
      for (const property of ["color", "background-color", "border-top-color", "outline-color", "fill", "stroke"]) {
        const value = style.getPropertyValue(property);
        if (!value || value === "none" || seen.has(value)) continue;
        const { r, g, b, a } = read(value);
        if (a < 26) continue;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : (max - min) / max;
        let hue = 0;
        if (max !== min) {
          if (max === r) hue = ((g - b) / (max - min)) % 6;
          else if (max === g) hue = (b - r) / (max - min) + 2;
          else hue = (r - g) / (max - min) + 4;
          hue = (hue * 60 + 360) % 360;
        }
        seen.set(value, { hue, saturation, where: `${element.tagName.toLowerCase()} ${property}` });
      }
    }
    return [...seen.entries()].map(([value, facts]) => ({ value, ...facts }));
  });
}

test.describe("light scheme with one accent", () => {
  test.use({ viewport: desktop });

  test("the front page is pale, its headline near-black, and amber the only saturated colour", async ({ page }) => {
    await page.goto("/");
    const background = parseColor(await styleOf(page.locator("html"), "background-color"));
    expect(background.rgb.map(Math.round)).toEqual(mist);
    const headline = parseColor(await styleOf(page.getByRole("heading", { level: 1 }), "color"));
    expect(Math.max(...headline.rgb)).toBeLessThan(48);

    const saturated = (await coloursInUse(page)).filter((colour) => colour.saturation > 0.45);
    expect(saturated.length).toBeGreaterThan(0);
    for (const colour of saturated) {
      expect(colour.hue, `${colour.value} on ${colour.where} is amber`).toBeGreaterThanOrEqual(18);
      expect(colour.hue, `${colour.value} on ${colour.where} is amber`).toBeLessThanOrEqual(36);
    }
  });

  test("hovered, focused and pressed elements change with the greys or amber only", async ({ page }) => {
    for (const path of ["/", "/projects/rick"]) {
      await page.goto(path);
      const controls = page.locator("a:visible, button:visible");
      const count = await controls.count();
      expect(count).toBeGreaterThan(10);
      for (let i = 0; i < count; i++) {
        const control = controls.nth(i);
        await control.scrollIntoViewIfNeeded();
        await control.hover({ force: true });
        await control.focus();
      }
      // Pressed: hold the mouse down on the two kinds of button.
      for (const name of ["Install", "Join the discussion"]) {
        const button = page.getByRole("main").getByRole("link", { name }).first();
        if ((await button.count()) === 0) continue;
        await button.scrollIntoViewIfNeeded();
        await button.hover();
        await page.mouse.down();
        const pressed = (await coloursInUse(page)).filter((colour) => colour.saturation > 0.45);
        for (const colour of pressed) {
          expect(colour.hue, `${colour.value} is amber`).toBeGreaterThanOrEqual(18);
          expect(colour.hue, `${colour.value} is amber`).toBeLessThanOrEqual(36);
        }
        await page.mouse.move(0, 0);
        await page.mouse.up();
      }
    }
  });

  test("the style sheets hold no hue but amber, in any state", async ({ page }) => {
    await page.goto("/");
    // Every colour written in the site's style sheets, whatever state it is for.
    const values = await page.evaluate(() => {
      const found = new Set<string>();
      const walk = (rules: CSSRuleList) => {
        for (const rule of rules) {
          if ("cssRules" in rule) walk((rule as CSSGroupingRule).cssRules);
          if (rule instanceof CSSStyleRule) {
            for (const hex of rule.cssText.match(/#[0-9a-f]{6}\b/gi) ?? []) found.add(hex.toLowerCase());
          }
        }
      };
      for (const sheet of document.styleSheets) walk(sheet.cssRules);
      return [...found];
    });
    expect(values.length).toBeGreaterThan(5);
    for (const hex of values) {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if ((max - min) / max <= 0.45) continue;
      expect(r, `${hex} is an amber`).toBe(max);
      expect(g, `${hex} is an amber`).toBeGreaterThan(b);
    }
  });
});

test.describe("amber marks actions", () => {
  for (const { name, viewport } of sizes) {
    test(`at ${name}, Install is the largest amber element of the first screen`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const amberAreas = await page.evaluate(() => {
        const areas: { text: string; area: number }[] = [];
        for (const element of document.querySelectorAll("body *")) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= window.innerHeight || rect.bottom <= 0 || rect.width === 0) continue;
          const style = getComputedStyle(element);
          for (const property of ["background-color", "color"]) {
            if (style.getPropertyValue(property) !== "rgb(255, 138, 31)") continue;
            areas.push({ text: (element.textContent ?? "").trim(), area: rect.width * rect.height });
          }
        }
        return areas.sort((a, b) => b.area - a.area);
      });
      expect(amberAreas.length).toBeGreaterThanOrEqual(2);
      expect(amberAreas[0].text).toBe("Install");
      const install = await page.getByRole("main").getByRole("link", { name: "Install" }).first().boundingBox();
      expect(Math.round(amberAreas[0].area)).toBe(Math.round(install!.width * install!.height));
    });
  }

  test("no paragraph is amber", async ({ page }) => {
    for (const path of ["/", "/projects/rick"]) {
      await page.goto(path);
      const colours = await page.locator("main p, main dd, main li, main figcaption").evaluateAll((all) =>
        all.filter((e) => (e.textContent ?? "").trim().length > 60).map((e) => getComputedStyle(e).color),
      );
      expect(colours.length).toBeGreaterThan(5);
      for (const colour of colours) {
        const [r, g, b] = parseColor(colour).rgb;
        expect(Math.max(r, g, b) - Math.min(r, g, b), `${colour} is a grey`).toBeLessThan(40);
      }
    }
  });
});

/** Takes away the rule that makes glass translucent, as a browser without backdrop filters would. */
async function withoutBackdropFilters(page: Page) {
  const removed = await page.evaluate(() => {
    let count = 0;
    const walk = (parent: CSSStyleSheet | CSSGroupingRule) => {
      for (let i = parent.cssRules.length - 1; i >= 0; i--) {
        const rule = parent.cssRules[i];
        if (rule instanceof CSSSupportsRule && rule.conditionText.includes("backdrop-filter")) {
          parent.deleteRule(i);
          count++;
        } else if ("cssRules" in rule) {
          walk(rule as CSSGroupingRule);
        }
      }
    };
    for (const sheet of document.styleSheets) walk(sheet);
    return count;
  });
  expect(removed, "the rule that needs backdrop filters").toBeGreaterThan(0);
}

test.describe("glass panels and thin lines", () => {
  test.use({ viewport: desktop });

  test("the navigation lets the landscape show through softened, and its entries stay readable", async ({ page }) => {
    await page.goto("/");
    // Scroll until the navigation lies over the darkest part of the landscape.
    const image = page.locator("main section").first().locator("img");
    const box = (await image.boundingBox())!;
    await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height - 120);

    const bar = page.getByRole("navigation", { name: "Main" }).locator(".glass").first();
    expect(await styleOf(bar, "backdrop-filter")).toContain("blur");
    const surface = parseColor(await styleOf(bar, "background-color"));
    expect(surface.alpha).toBeLessThan(1);
    expect(surface.alpha).toBeGreaterThan(0.5);

    // Worst case behind the glass: Basalt, the darkest tone of the imagery.
    const behind: [number, number, number] = [30, 33, 36];
    const mixed = surface.rgb.map((c, i) => c * surface.alpha + behind[i] * (1 - surface.alpha)) as [number, number, number];
    const entry = page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Projects" });
    const text = parseColor(await styleOf(entry, "color"));
    expect(contrast(text.rgb, mixed)).toBeGreaterThanOrEqual(4.5);

    const border = parseColor(await styleOf(bar, "border-top-color"));
    expect(await styleOf(bar, "border-top-width")).toBe("1px");
    expect(border.alpha).toBeGreaterThan(0);
  });

  test("the cards are glass too, and keep their text readable over the darkest image", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("main section").first().locator("article");
    expect(await styleOf(card, "backdrop-filter")).toContain("blur");
    const surface = parseColor(await styleOf(card, "background-color"));
    expect(surface.alpha).toBeLessThan(1);
    const behind: [number, number, number] = [30, 33, 36];
    const mixed = surface.rgb.map((c, i) => c * surface.alpha + behind[i] * (1 - surface.alpha)) as [number, number, number];
    for (const part of [card.locator("h2"), card.locator("p").first(), card.locator("p").nth(1), card.locator("p").last()]) {
      const text = parseColor(await styleOf(part, "color"));
      expect(contrast(text.rgb, mixed), await part.textContent() ?? "").toBeGreaterThanOrEqual(4.5);
    }
  });

  test("without backdrop filters the navigation and the cards have a pale surface with readable text", async ({ page }) => {
    await page.goto("/");
    await withoutBackdropFilters(page);

    const bar = page.getByRole("navigation", { name: "Main" }).locator(".glass").first();
    const card = page.locator("main section").first().locator("article");
    for (const panel of [bar, card]) {
      expect(await styleOf(panel, "backdrop-filter")).toBe("none");
      const surface = parseColor(await styleOf(panel, "background-color"));
      expect(surface.alpha, "the surface is solid").toBe(1);
      expect(Math.min(...surface.rgb), "the surface is pale").toBeGreaterThan(240);

      const texts = panel.locator("a, p, h2, span");
      const count = await texts.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const element = texts.nth(i);
        if (!(await element.isVisible())) continue;
        const own = parseColor(await styleOf(element, "background-color"));
        const background = own.alpha === 1 ? own.rgb : surface.rgb;
        const text = parseColor(await styleOf(element, "color"));
        expect(contrast(text.rgb, background), (await element.textContent()) ?? "").toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});

test.describe("readable contrast", () => {
  test("secondary text on the pale background has at least 4.5 to 1", async ({ page }) => {
    await page.goto("/");
    const intro = page.locator("main section").first().locator("p").nth(1);
    const text = parseColor(await styleOf(intro, "color"));
    expect(contrast(text.rgb, mist)).toBeGreaterThanOrEqual(4.5);
    // Where the background darkens towards the land, it still holds.
    expect(contrast(text.rgb, [221, 226, 229])).toBeGreaterThanOrEqual(4.5);
  });

  test("the label of an amber call to action has at least 4.5 to 1 against the fill", async ({ page }) => {
    await page.goto("/");
    const install = page.getByRole("main").getByRole("link", { name: "Install" }).first();
    const fill = parseColor(await styleOf(install, "background-color"));
    expect(fill.rgb.map(Math.round)).toEqual(amber);
    const label = parseColor(await styleOf(install, "color"));
    expect(contrast(label.rgb, fill.rgb)).toBeGreaterThanOrEqual(4.5);
  });

  test("small amber text uses the darker amber, at 4.5 to 1 or more", async ({ page }) => {
    await page.goto("/");
    const label = page.locator("main section").first().locator("p").first();
    const text = parseColor(await styleOf(label, "color"));
    expect(text.rgb.map(Math.round)).not.toEqual(amber);
    expect(contrast(text.rgb, mist)).toBeGreaterThanOrEqual(4.5);
  });

  for (const { name, viewport } of sizes) {
    test(`at ${name}, no text lies over the landscape without a panel behind it`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const uncovered = await page.evaluate(() => {
        const found: string[] = [];
        for (const image of document.querySelectorAll("main img, footer img")) {
          if (image.getAttribute("alt") !== "") continue; // only the decorative landscape
          const area = image.getBoundingClientRect();
          for (const element of document.querySelectorAll("main *, footer *")) {
            const hasText = [...element.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
            if (!hasText || element.closest(".sr-only")) continue;
            const rect = element.getBoundingClientRect();
            const overlaps = rect.left < area.right && rect.right > area.left && rect.top < area.bottom && rect.bottom > area.top;
            if (overlaps && !element.closest(".glass, .glass-card")) found.push((element.textContent ?? "").trim());
          }
        }
        return found;
      });
      expect(uncovered).toEqual([]);
    });
  }
});

test.describe("visible keyboard focus", () => {
  test("the Install call to action shows a focus mark with at least 3 to 1", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/");
    const install = page.getByRole("main").getByRole("link", { name: "Install" }).first();
    for (let i = 0; i < 12 && !(await install.evaluate((e) => e === document.activeElement)); i++) {
      await page.keyboard.press("Tab");
    }
    await expect(install).toBeFocused();
    expect(await styleOf(install, "outline-style")).toBe("solid");
    expect(parseFloat(await styleOf(install, "outline-width"))).toBeGreaterThanOrEqual(2);
    expect(parseFloat(await styleOf(install, "outline-offset"))).toBeGreaterThanOrEqual(2);
    const ring = parseColor(await styleOf(install, "outline-color")).rgb;
    // Next to the ring: the pale background outside, the amber fill inside.
    expect(contrast(ring, mist)).toBeGreaterThanOrEqual(3);
    expect(contrast(ring, [221, 226, 229])).toBeGreaterThanOrEqual(3);
    expect(contrast(ring, amber)).toBeGreaterThanOrEqual(3);
  });

  for (const path of ["/fixtures/components", "/", "/projects/rick", "/community"]) {
    test(`every link, button and control of ${path} shows a focus mark`, async ({ page }) => {
      await page.setViewportSize(desktop);
      await page.goto(path);
      const total = await page.locator("a[href]:visible, button:visible").count();
      expect(total).toBeGreaterThan(5);
      const seen = new Set<string>();
      for (let i = 0; i < total + 5; i++) {
        await page.keyboard.press("Tab");
        const mark = await page.evaluate(() => {
          const element = document.activeElement;
          if (!element || element === document.body) return null;
          // The mark is on the element itself, or on the card it is the link of.
          const marked = [element, element.closest("article")].filter(Boolean) as Element[];
          const widths = marked.map((e) => {
            const style = getComputedStyle(e);
            return style.outlineStyle === "none" ? 0 : parseFloat(style.outlineWidth);
          });
          const rect = element.getBoundingClientRect();
          return {
            key: `${element.tagName} ${element.textContent?.trim().slice(0, 30)} ${Math.round(rect.x)},${Math.round(rect.y + window.scrollY)}`,
            width: Math.max(...widths),
            onDark: !!element.closest(".on-dark"),
            colour: getComputedStyle(marked[widths.indexOf(Math.max(...widths))]).outlineColor,
          };
        });
        if (!mark) continue;
        seen.add(mark.key);
        expect(mark.width, `${mark.key} has a focus mark`).toBeGreaterThanOrEqual(2);
        const ring = parseColor(mark.colour).rgb;
        const ground: [number, number, number] = mark.onDark ? [62, 74, 85] : mist;
        expect(contrast(ring, ground), `${mark.key}: the mark stands out`).toBeGreaterThanOrEqual(3);
      }
      expect(seen.size, "every control was reached").toBeGreaterThanOrEqual(total);
    });
  }
});

test.describe("controls are easy to hit", () => {
  for (const { name, viewport } of sizes) {
    test(`at ${name}, every link and button offers 44 pixels of height to hit, and never less than 24 of width`, async ({ page }) => {
      await page.setViewportSize(viewport);
      for (const path of ["/", "/projects/rick"]) {
        await page.goto(path);
        const small = await page.evaluate(() => {
          const found: string[] = [];
          for (const element of document.querySelectorAll("a[href], button")) {
            const style = getComputedStyle(element);
            // The skip link is out of sight until it has the focus.
            if (style.display === "none" || element.closest("[hidden], dialog, .sr-only")) continue;
            // The place to hit is the element, a larger area it lays over itself, or the card it is the link of.
            const boxes = [element.getBoundingClientRect()];
            const after = getComputedStyle(element, "::after");
            if (after.position === "absolute" && after.content !== "none") {
              const holder = element.closest("article") ?? element;
              const rect = holder.getBoundingClientRect();
              const grow = (side: string) => (holder === element ? -parseFloat(after.getPropertyValue(side)) || 0 : 0);
              boxes.push(new DOMRect(rect.x - grow("left"), rect.y - grow("top"), rect.width + grow("left") + grow("right"), rect.height + grow("top") + grow("bottom")));
            }
            const height = Math.max(...boxes.map((box) => box.height));
            const width = Math.max(...boxes.map((box) => box.width));
            if (width === 0) continue;
            if (height < 44 || width < 24) found.push(`${(element.textContent ?? "").trim().slice(0, 30)} ${Math.round(width)}x${Math.round(height)}`);
          }
          return found;
        });
        expect(small, path).toEqual([]);
      }
    });
  }
});

test.describe("reduced motion", () => {
  test("with reduced motion on, nothing slides, scales, drifts or moves with scrolling", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: desktop });
    const page = await context.newPage();
    for (const path of ["/", "/projects/rick"]) {
      await page.goto(path, { waitUntil: "commit" });
      // While the page comes in, and after: only opacity is ever animated.
      for (let i = 0; i < 6; i++) {
        const moving = await page.evaluate(() =>
          document.getAnimations().flatMap((animation) => {
            const effect = animation.effect as KeyframeEffect | null;
            const properties = new Set(
              (effect?.getKeyframes() ?? []).flatMap((frame) =>
                Object.keys(frame).filter((key) => !["offset", "easing", "composite", "computedOffset"].includes(key)),
              ),
            );
            const allowed = ["opacity", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"];
            return [...properties].filter((property) => !allowed.includes(property));
          }),
        );
        expect(moving, "properties in motion").toEqual([]);
        await page.waitForTimeout(80);
      }
      await page.waitForLoadState("networkidle");

      // Nothing moves with scrolling.
      const transforms = () =>
        page.evaluate(() => [...document.querySelectorAll("main *, footer *, header *")].map((e) => getComputedStyle(e).transform + "|" + getComputedStyle(e).translate));
      const before = await transforms();
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(150);
      expect(await transforms()).toEqual(before);
      expect(await styleOf(page.locator("html"), "scroll-behavior")).toBe("auto");

      // Hovering moves nothing either.
      const card = page.locator("article").first();
      if ((await card.count()) > 0) {
        await card.scrollIntoViewIfNeeded();
        await card.hover();
        await page.waitForTimeout(100);
        expect(await styleOf(card.locator("svg").last(), "transform")).toBe("none");
      }
    }
    await context.close();
  });

  test("without that setting, the page does move: the check above is not empty", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "no-preference", viewport: desktop });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "commit" });
    const names = new Set<string>();
    await expect
      .poll(async () => {
        const running = await page.evaluate(() => document.getAnimations().map((a) => (a as CSSAnimation).animationName));
        for (const name of running) names.add(name);
        return [...names];
      }, { intervals: [20] })
      .toEqual(expect.arrayContaining(["rise", "scale-draw", "drift"]));
    await context.close();
  });
});

test.describe("layout adapts to the screen", () => {
  test("at 390 wide the content is in one column", async ({ page }) => {
    await page.setViewportSize(phone);
    await page.goto("/");
    const lefts = await page.locator("#projects article").evaluateAll((cards) => cards.map((card) => Math.round(card.getBoundingClientRect().left)));
    expect(new Set(lefts).size).toBe(1);
  });

  test("at 1440 wide content with several items uses several columns", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/");
    const boxes = await page.locator("#projects article").evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().toJSON()));
    // The first card spans the row; the other four stand in four columns under it.
    expect(Math.round(boxes[0].width)).toBe(1296);
    expect(new Set(boxes.slice(1).map((box) => Math.round(box.left))).size).toBe(4);
    expect(new Set(boxes.slice(1).map((box) => Math.round(box.top))).size).toBe(1);
    // And the ruled line above them has one tick for each column.
    const step = await page.locator("#projects .scale-rule").evaluate((e) => getComputedStyle(e).getPropertyValue("--scale-step"));
    expect(step).toContain("/ 4");
    const team = await page.locator("#team li").evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().left)));
    expect(new Set(team).size).toBe(2);
  });

  test("the landscape is a drawn stand-in that fills its place edge to edge", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/");
    const image = page.locator("main section").first().locator("img");
    await expect(image).toHaveAttribute("src", /landscape-stand-in\.svg/);
    // The place of the image: the box it fills, from edge to edge.
    const box = (await image.locator("xpath=..").boundingBox())!;
    expect(Math.round(box.x)).toBe(0);
    expect(Math.round(box.width)).toBe(1440);
    expect(await styleOf(image.locator("xpath=.."), "overflow-x")).toBe("hidden");
    // Its place does not depend on the image: the box is sized by the layout.
    expect(await styleOf(image, "position")).toBe("absolute");
    expect(await styleOf(image, "object-fit")).toBe("cover");
  });
});
