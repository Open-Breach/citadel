import { expect, test } from "@playwright/test";
import {
  desktop,
  expectNoHorizontalScroll,
  expectNoOverlapOrCutOff,
  gotoReady,
  isInViewport,
  scrollThrough,
  sizes,
} from "./helpers.ts";

const names = ["Rick", "Meeseeks", "Gossip", "Trebuchet", "Butterbot"];

test.describe("introduction and mission", () => {
  for (const { name, viewport } of sizes) {
    test(`at ${name}, the first screen says what Open-Breach is without scrolling`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const first = page.locator("main section").first();
      const headline = first.getByRole("heading", { level: 1 });
      await expect(headline).toHaveText("Open tools,built in the open.");
      expect(await isInViewport(headline)).toBe(true);
      const intro = first.getByText("Open-Breach builds the next generation of tools");
      await expect(intro).toBeVisible();
      expect(await isInViewport(intro)).toBe(true);
      // As on board B: the small label above, the ruled line below.
      expect(await isInViewport(first.getByText("Open-Breach · Open source tools"))).toBe(true);
      expect(await isInViewport(first.locator(".scale-rule"))).toBe(true);
    });
  }

  test("on a desktop screen the first screen is as tall as the screen", async ({ page }) => {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 1440, height: 960 }, { width: 1920, height: 1080 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const first = (await page.locator("main section").first().boundingBox())!;
      expect(first.height).toBeLessThanOrEqual(viewport.height + 8);
      const card = page.locator("main section").first().locator("article");
      expect(await isInViewport(card)).toBe(true);
    }
  });

  test("the name Open-Breach never breaks at its hyphen", async ({ page }) => {
    for (const width of [390, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const names = page.locator("main span", { hasText: /^Open-Breach$/ });
      expect(await names.count()).toBeGreaterThan(3);
      for (const name of await names.all()) {
        expect(await name.evaluate((e) => e.getClientRects().length), "one line").toBe(1);
      }
    }
  });

  test("a mission statement says what Open-Breach is for", async ({ page }) => {
    await page.goto("/");
    const mission = page.locator("#mission");
    await expect(mission.getByRole("heading", { name: "What Open-Breach is for" })).toBeVisible();
    await expect(mission.getByText("Open-Breach exists so that")).toBeVisible();
  });

  test("the sections come in the order of design D9", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("main > section").evaluateAll((sections) => sections.map((s) => s.id || s.getAttribute("aria-labelledby")));
    expect(ids).toEqual(["hero-heading", "mission", "projects", "built-with-claude", "releases", "team", "next"]);
    await expect(page.locator("main + footer")).toHaveCount(1);
  });
});

test.describe("two calls to action", () => {
  for (const { name, viewport } of sizes) {
    test(`at ${name}, Install and Join the discussion are both visible without scrolling`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const first = page.locator("main section").first();
      const install = first.getByRole("link", { name: "Install" });
      const discuss = first.getByRole("link", { name: "Join the discussion" });
      await expect(install).toBeVisible();
      await expect(discuss).toBeVisible();
      expect(await isInViewport(install)).toBe(true);
      expect(await isInViewport(discuss)).toBe(true);

      // Install is the more prominent one: filled amber, and it comes first.
      const fill = await install.evaluate((e) => getComputedStyle(e).backgroundColor);
      const other = await discuss.evaluate((e) => getComputedStyle(e).backgroundColor);
      expect(fill).toBe("rgb(255, 138, 31)");
      expect(other).toBe("rgba(0, 0, 0, 0)");
      const a = (await install.boundingBox())!;
      const b = (await discuss.boundingBox())!;
      expect(a.y < b.y || a.x < b.x).toBe(true);
    });

    test(`at ${name}, Install leads to the projects and Join the discussion to the community`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.locator("main section").first().getByRole("link", { name: "Install" }).click();
      await expect(page).toHaveURL("/#projects");
      await expect.poll(() => isInViewport(page.getByRole("heading", { name: "Five projects" }))).toBe(true);

      await page.goto("/");
      await page.locator("main section").first().getByRole("link", { name: "Join the discussion" }).click();
      await expect(page).toHaveURL("/community");
    });
  }

  test("Install moves to the projects every time, also when the address already ends there", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoReady(page, "/");
    const heading = page.getByRole("heading", { name: "Five projects" });
    const first = page.locator("main section").first().getByRole("link", { name: "Install" });
    await first.click();
    await expect(page).toHaveURL("/#projects");
    await expect.poll(() => isInViewport(heading)).toBe(true);
    // Back to the top, and again: the address has not changed, the page still moves.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await first.click();
    await expect.poll(() => isInViewport(heading)).toBe(true);
    // From the end of the page, and from the navigation.
    for (const again of [page.locator("main > section").last().getByRole("link", { name: "Install" }), page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Install" })]) {
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
      await again.click();
      await expect.poll(() => isInViewport(heading)).toBe(true);
    }
    // The focus has moved with it, so that the keyboard goes on from the projects.
    expect(await page.evaluate(() => document.activeElement?.id)).toBe("projects");
  });

  test("the two calls to action come again at the end of the page", async ({ page }) => {
    await page.goto("/");
    const closing = page.locator("main > section").last();
    await expect(closing.getByRole("link", { name: "Install" })).toHaveAttribute("href", "/#projects");
    await expect(closing.getByRole("link", { name: "Join the discussion" })).toHaveAttribute("href", "/community");
  });
});

test.describe("a card for each project", () => {
  test("five cards are shown, in the order Rick, Meeseeks, Gossip, Trebuchet, Butterbot", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#projects article");
    await expect(cards).toHaveCount(5);
    await expect(cards.getByRole("heading")).toHaveText(names);
  });

  test("a card shows the name, one line, and for a program its platforms", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#projects article");
    for (let i = 0; i < 5; i++) {
      await expect(cards.nth(i).getByRole("heading")).toHaveText(names[i]);
      expect(((await cards.nth(i).locator("p").first().textContent()) ?? "").length).toBeGreaterThan(20);
    }
    await expect(cards.nth(0).getByRole("list", { name: "Runs on" }).getByRole("listitem")).toHaveText(["Linux", "macOS", "Windows"]);
    await expect(cards.nth(1).getByRole("list", { name: "Runs on" }).getByRole("listitem")).toHaveText(["Linux"]);
    // Trebuchet is not a program a visitor runs: no platforms, and no empty list.
    await expect(cards.nth(3).getByRole("list")).toHaveCount(0);
  });

  test("the first card shows the project at work", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("#projects article").first();
    await expect(card.locator("img")).toHaveAttribute("alt", /Rick with two panes/);
    await expect(page.locator("#projects article img")).toHaveCount(1);
  });

  test("Rick's card opens the Rick page", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects article").first().getByRole("link", { name: "Rick" }).click();
    await expect(page).toHaveURL("/projects/rick");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rick");
  });

  test("every card leads to its project's page", async ({ page }) => {
    for (const name of names) {
      await page.goto("/");
      await page.locator("#projects article").filter({ has: page.getByRole("heading", { name }) }).click();
      await expect(page).toHaveURL(`/projects/${name.toLowerCase()}`);
    }
  });

  test("any part of a card opens the page", async ({ page }) => {
    await page.setViewportSize(desktop);
    for (const corner of ["top-left", "bottom-right", "tagline", "explore"]) {
      await page.goto("/");
      const card = page.locator("#projects article").nth(2);
      await card.scrollIntoViewIfNeeded();
      const box = (await card.boundingBox())!;
      const centre = async (part: ReturnType<typeof card.locator>) => {
        const rect = (await part.boundingBox())!;
        return [rect.x + rect.width / 2, rect.y + rect.height / 2] as const;
      };
      // The corners of a card are rounded, so the clicks go just inside them.
      if (corner === "top-left") await page.mouse.click(box.x + 24, box.y + 8);
      if (corner === "bottom-right") await page.mouse.click(box.x + box.width - 24, box.y + box.height - 8);
      if (corner === "tagline") await page.mouse.click(...(await centre(card.locator("p").first())));
      if (corner === "explore") await page.mouse.click(...(await centre(card.getByText("Explore"))));
      await expect(page, corner).toHaveURL("/projects/gossip");
    }
  });

  test("a keyboard user reaches each card as one link", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#projects article");
    for (let i = 0; i < 5; i++) {
      await expect(cards.nth(i).locator("a, button, [tabindex]")).toHaveCount(1);
      await expect(cards.nth(i).getByRole("link")).toHaveAccessibleName(names[i]);
    }
    // Tab moves from card to card, one stop each, and Enter opens the page.
    await cards.first().getByRole("link").focus();
    for (let i = 1; i < 5; i++) {
      await page.keyboard.press("Tab");
      await expect(cards.nth(i).getByRole("link")).toBeFocused();
    }
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/projects/butterbot");
  });

  test("the card of the first screen, as on board B, opens the Rick page", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("main section").first().locator("article");
    await expect(card.getByText("Project", { exact: true })).toBeVisible();
    await expect(card.getByRole("heading")).toHaveText("Rick");
    const explore = (await card.getByText("Explore").boundingBox())!;
    await page.mouse.click(explore.x + explore.width / 2, explore.y + explore.height / 2);
    await expect(page).toHaveURL("/projects/rick");
  });
});

test.describe("built with Claude", () => {
  test("a statement says that the work is done with Claude", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#built-with-claude");
    await expect(section.getByRole("heading", { name: "Built with Claude" })).toBeVisible();
    await expect(section.getByText("The projects of Open-Breach are built with Claude")).toBeVisible();
  });
});

test.describe("latest releases", () => {
  test("the five newest are listed, the newest at the top", async ({ page }) => {
    await page.goto("/");
    const entries = page.locator("#releases ol > li");
    await expect(entries).toHaveCount(5);
    const dates = await entries.locator("time").evaluateAll((times) => times.map((time) => time.getAttribute("datetime") ?? ""));
    expect(dates).toEqual([...dates].sort().reverse());
    expect(dates[0]).toBe("2026-11-20");
    // The two oldest sample entries are left out.
    await expect(page.locator("#releases")).not.toContainText("v0.2.0");
    await expect(page.locator("#releases")).not.toContainText("v0.3.0");
  });

  test("while the entries are sample data, the section says so", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#releases").getByText("Sample data")).toBeVisible();
  });

  test("an entry shows the project, the version and the date, and leads to that release", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("#releases ol > li").first();
    await expect(first).toContainText("Rick");
    await expect(first).toContainText("v0.6.0");
    await expect(first).toContainText("20 Nov 2026");
    await expect(first.getByRole("link")).toHaveAttribute("href", "https://github.com/Open-Breach/rick/releases/tag/v0.6.0");
    const second = page.locator("#releases ol > li").nth(1);
    await expect(second).toContainText("Gossip");
    await expect(second.getByRole("link")).toHaveAttribute("href", "https://github.com/Open-Breach/gossip/releases/tag/v0.1.0");
  });

  test("with no release known, the section is left out and the page shows no empty list", async ({ page }) => {
    await page.goto("/fixtures/no-releases");
    await expect(page.getByRole("heading", { name: "Built with Claude" })).toBeVisible();
    await expect(page.locator("#releases")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Latest releases" })).toHaveCount(0);
    await expect(page.locator("main ul:empty, main ol:empty, main dl:empty")).toHaveCount(0);
    await expect(page.getByText("Sample data")).toHaveCount(0);
    // The sections around it close up.
    const ids = await page.locator("main > section").evaluateAll((sections) => sections.map((s) => s.id || s.getAttribute("aria-labelledby")));
    expect(ids).toEqual(["hero-heading", "mission", "projects", "built-with-claude", "team", "next"]);
  });
});

test.describe("the team", () => {
  test("the section shows both people, each with name, role and one line", async ({ page }) => {
    await page.goto("/");
    const people = page.locator("#team ul > li");
    await expect(people).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      await expect(people.nth(i).getByRole("heading")).not.toBeEmpty();
      await expect(people.nth(i).locator("p")).toHaveCount(2);
      for (const line of await people.nth(i).locator("p").allTextContents()) expect(line.trim().length).toBeGreaterThan(5);
    }
    await expect(people.first().getByRole("heading")).toHaveText("Serge");
  });

  test("it lists people only, and no AI", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#team")).not.toContainText(/Claude|\bAI\b/);
  });

  for (const { name, viewport } of sizes) {
    test(`at ${name}, Team in the navigation shows the team section`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await gotoReady(page, "/");
      const nav = page.getByRole("navigation", { name: "Main" });
      if (viewport.width < 1024) await nav.getByRole("button", { name: "Menu" }).click();
      await nav.getByRole("link", { name: "Team" }).click();
      await expect(page).toHaveURL("/#team");
      const heading = page.getByRole("heading", { name: "The team" });
      await expect.poll(() => isInViewport(heading)).toBe(true);
      // The heading is not hidden under the navigation.
      const top = (await heading.boundingBox())!.y;
      const navBottom = await nav.evaluate((e) => e.getBoundingClientRect().bottom);
      expect(top).toBeGreaterThan(navBottom);
    });
  }
});

test.describe("the page at both widths", () => {
  for (const { name, viewport } of sizes) {
    test(`at ${name}, no horizontal scrolling, no overlapping content, no text cut off`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await scrollThrough(page);
      await expectNoHorizontalScroll(page);
      await expectNoOverlapOrCutOff(page);
    });
  }

  for (const width of [360, 768, 1024, 1280, 1920]) {
    test(`at ${width} wide the page does not scroll sideways`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      for (const path of ["/", "/projects/rick", "/community"]) {
        await page.goto(path);
        await expectNoHorizontalScroll(page);
        await expectNoOverlapOrCutOff(page);
      }
    });
  }
});
