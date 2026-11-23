import { expect, test } from "@playwright/test";
import {
  expectNoHorizontalScroll,
  expectNoOverlapOrCutOff,
  isInViewport,
  recordForeignRequests,
  scrollThrough,
  sizes,
} from "./helpers.ts";

const parts = ["about", "why", "screenshots", "features", "install", "source"];

test.describe("a page for a project", () => {
  test("/projects/rick returns the Rick page with the status 200", async ({ page }) => {
    const response = await page.goto("/projects/rick");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rick");
  });

  test("/projects/no-such-project returns the not-found page with the status 404", async ({ page }) => {
    const response = await page.goto("/projects/no-such-project");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist.");
  });
});

test.describe("what it is and why it exists", () => {
  for (const { name, viewport } of sizes) {
    test(`at ${name}, the first screen says what Rick is`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/projects/rick");
      const what = page.locator("#about").getByText("Rick is a fast, lean file manager for professionals.");
      await expect(what).toBeVisible();
      expect(await isInViewport(page.getByRole("heading", { level: 1 }))).toBe(true);
      expect(await isInViewport(what)).toBe(true);
    });
  }

  test("a part of the page says why Rick exists", async ({ page }) => {
    await page.goto("/projects/rick");
    const why = page.locator("#why");
    await expect(why.getByRole("heading", { name: "Why Rick exists" })).toBeVisible();
    expect((await why.locator("p").allTextContents()).join(" ").length).toBeGreaterThan(200);
  });
});

test.describe("screenshots", () => {
  test("at least three screenshots are shown", async ({ page }) => {
    await page.goto("/projects/rick");
    const shots = page.locator("#screenshots figure img");
    expect(await shots.count()).toBeGreaterThanOrEqual(3);
    await scrollThrough(page);
    for (const shot of await shots.all()) {
      await shot.scrollIntoViewIfNeeded();
      await expect(shot).toBeVisible();
      await expect.poll(() => shot.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  });

  test("each screenshot is announced with what it shows", async ({ page }) => {
    await page.goto("/projects/rick");
    const alts = await page.locator("#screenshots figure img").evaluateAll((images) => images.map((img) => img.getAttribute("alt") ?? ""));
    for (const alt of alts) expect(alt.length).toBeGreaterThan(20);
    expect(new Set(alts).size).toBe(alts.length);
    expect(alts[0]).toBe("Rick with two panes side by side and the preview pane showing a 3D model of a pig.");
    // The opening's screenshot has its text alternative too.
    await expect(page.locator("#about img")).toHaveAttribute("alt", /Rick with two panes/);
    // Each is a button, named after what it shows.
    await expect(page.locator("#screenshots").getByRole("button", { name: /Rick in its dark theme.*View larger/ })).toHaveCount(1);
  });

  for (const { name, viewport } of sizes) {
    test(`at ${name}, a screenshot is shown larger, and the larger view closes with the keyboard`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/projects/rick");
      const thumbnails = page.locator("#screenshots figure button");
      const second = thumbnails.nth(1);
      await second.scrollIntoViewIfNeeded();
      const small = (await second.locator("img").boundingBox())!;

      // Open with the keyboard.
      await second.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName(/Rick in its dark theme/);
      const large = (await dialog.locator("img").boundingBox())!;
      expect(large.width).toBeGreaterThan(small.width * 1.5);
      // The view itself stays inside the screen. On a narrow screen the
      // image in it is wider than the screen and is moved sideways.
      const view = (await dialog.boundingBox())!;
      expect(view.x).toBeGreaterThanOrEqual(0);
      expect(view.x + view.width).toBeLessThanOrEqual(viewport.width);
      expect(view.y).toBeGreaterThanOrEqual(0);
      expect(view.y + view.height).toBeLessThanOrEqual(viewport.height);
      // The focus is inside the larger view, on its Close button.
      await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

      // Escape closes it, and the focus returns to the screenshot.
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(second).toBeFocused();

      // The Close button closes it too, with Enter.
      await page.keyboard.press("Enter");
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Enter");
      await expect(dialog).toBeHidden();

      // And so does a click, on the screenshot and then beside the larger view.
      await thumbnails.first().click();
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAccessibleName(/Rick with two panes/);
      await page.mouse.click(4, 4);
      await expect(dialog).toBeHidden();
    });
  }
});

test.describe("top features", () => {
  test("between three and eight features are shown, each with a name and a short description", async ({ page }) => {
    await page.goto("/projects/rick");
    const features = page.locator("#features dl > div");
    const count = await features.count();
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(8);
    for (let i = 0; i < count; i++) {
      expect(((await features.nth(i).locator("dt").textContent()) ?? "").trim().length).toBeGreaterThan(3);
      const description = ((await features.nth(i).locator("dd").textContent()) ?? "").trim();
      expect(description.length).toBeGreaterThan(20);
      expect(description.split(/[.!?](?:\s|$)/).filter(Boolean).length).toBeLessThanOrEqual(2);
    }
  });
});

test.describe("install instructions", () => {
  test("the steps for each platform Rick runs on are shown", async ({ page }) => {
    await page.goto("/projects/rick");
    const install = page.locator("#install");
    await expect(install.getByRole("heading", { level: 3 })).toHaveText(["Linux", "macOS", "Windows"]);
    for (const platform of ["Linux", "macOS", "Windows"]) {
      const block = install.locator(`[data-platform="${platform}"]`);
      await expect(block.getByRole("heading", { level: 3 })).toHaveText(platform);
      expect(await block.locator("ol > li").count()).toBeGreaterThanOrEqual(1);
    }
    await expect(install.getByRole("link", { name: /Windows x64/ })).toHaveAttribute("href", /rick-0\.6\.0-windows-x64\.zip$/);
  });

  test("a command is text in the page, not an image, and can be copied", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/projects/rick");
    const command = page.locator("#install pre code").first();
    await expect(command).toHaveText("curl -fsSL https://get.openbreach.dev/install.sh | sh -s rick");
    await expect(page.locator("#install pre img, #install pre svg")).toHaveCount(0);
    expect(await command.evaluate((e) => getComputedStyle(e).userSelect)).not.toBe("none");

    // Selecting it gives the command.
    await command.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);
    });
    expect(await page.evaluate(() => window.getSelection()!.toString())).toBe("curl -fsSL https://get.openbreach.dev/install.sh | sh -s rick");

    // And its button copies it.
    const copy = page.locator("#install").getByRole("button", { name: "Copy" }).first();
    await copy.click();
    await expect(page.locator("#install").getByRole("button", { name: "Copied" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("curl -fsSL https://get.openbreach.dev/install.sh | sh -s rick");
  });

  test("Install at the top of the page leads to the install steps", async ({ page }) => {
    await page.goto("/projects/rick");
    await page.locator("#about").getByRole("link", { name: "Install" }).click();
    await expect(page).toHaveURL("/projects/rick#install");
    await expect.poll(() => isInViewport(page.getByRole("heading", { name: "Install", exact: true }))).toBe(true);
  });
});

test.describe("badges drawn by the site", () => {
  test("a badge each for version, build status, licence and stars", async ({ page }) => {
    await page.goto("/projects/rick");
    const badges = page.locator("#about ul").first().getByRole("listitem");
    await expect(badges).toHaveText(["Versionv0.6.0", "Buildpassing", "LicenceApache-2.0", "Stars128"]);
    // Drawn as text and lines of the page, in its own colours: no badge image.
    await expect(page.locator("#about ul img")).toHaveCount(0);
    const fonts = await badges.locator("span span").last().evaluate((e) => getComputedStyle(e).fontFamily);
    expect(fonts).toMatch(/geist/i);
  });

  test("no badge is requested from another host", async ({ page, baseURL }) => {
    const foreign = await recordForeignRequests(page, baseURL!);
    const images: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "image") images.push(new URL(request.url()).pathname + new URL(request.url()).search);
    });
    await page.goto("/projects/rick");
    await scrollThrough(page);
    expect(foreign).toEqual([]);
    expect(images.join("\n")).not.toMatch(/badge|shields/i);
  });
});

test.describe("link to the source", () => {
  test("the link to the source opens Rick's repository on GitHub", async ({ page }) => {
    await page.goto("/projects/rick");
    for (const part of ["#about", "#source"]) {
      await expect(page.locator(part).getByRole("link", { name: "Source on GitHub" })).toHaveAttribute("href", "https://github.com/Open-Breach/rick");
    }
  });
});

test.describe("one template for every project", () => {
  test("the Rick page has the parts of the template, in order", async ({ page }) => {
    await page.goto("/projects/rick");
    expect(await page.locator("main > section").evaluateAll((sections) => sections.map((s) => s.id))).toEqual(parts);
  });

  test("a second project has the same parts in the same order, from its content alone", async ({ page }) => {
    await page.goto("/fixtures/project");
    expect(await page.locator("main > section").evaluateAll((sections) => sections.map((s) => s.id))).toEqual(parts);

    // Its own content, in the same places.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fixture");
    await expect(page.locator("#why").getByRole("heading")).toHaveText("Why Fixture exists");
    await expect(page.locator("#screenshots figure")).toHaveCount(4);
    await expect(page.locator("#features dl > div")).toHaveCount(3);
    await expect(page.locator("#install").getByRole("heading", { level: 3 })).toHaveText(["Linux"]);
    await expect(page.locator("#install pre code")).toHaveText("fixture --install");
    await expect(page.locator("#about ul").first().getByRole("listitem")).toHaveText(["Versionv1.2.3", "Buildfailing", "LicenceMIT", "Stars7"]);
    await expect(page.locator("#source").getByRole("link", { name: "Source on GitHub" })).toHaveAttribute("href", "https://github.com/Open-Breach/fixture");
    await expect(page.locator("#source")).toContainText("Fixture is open source under the MIT licence.");
  });

  test("the two pages have the same structure of headings and parts", async ({ page }) => {
    const outline = async (path: string) => {
      await page.goto(path);
      return page.locator("main > section").evaluateAll((sections) =>
        sections.map((section) => ({
          id: section.id,
          heading: section.querySelector("h1, h2")?.tagName,
          classes: section.className,
        })),
      );
    };
    expect(await outline("/fixtures/project")).toEqual(await outline("/projects/rick"));
  });

  for (const { name, viewport } of sizes) {
    test(`at ${name}, the second project's page holds its layout`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/fixtures/project");
      await scrollThrough(page);
      await expectNoHorizontalScroll(page);
      await expectNoOverlapOrCutOff(page);
    });
  }
});

test.describe("the page at both widths", () => {
  for (const { name, viewport } of sizes) {
    test(`at ${name}, no horizontal scrolling, no overlapping content, no text cut off`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/projects/rick");
      await scrollThrough(page);
      await expectNoHorizontalScroll(page);
      await expectNoOverlapOrCutOff(page);
    });
  }

  test("at 390 wide a long command scrolls inside its box, not the page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/projects/rick");
    const pre = page.locator("#install pre").nth(1);
    const { scrollWidth, clientWidth } = await pre.evaluate((e) => ({ scrollWidth: e.scrollWidth, clientWidth: e.clientWidth }));
    expect(scrollWidth).toBeGreaterThan(clientWidth);
    await expectNoHorizontalScroll(page);
  });
});
