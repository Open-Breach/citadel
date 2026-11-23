import { expect, test } from "@playwright/test";
import { projects } from "../../src/content/projects.ts";
import { desktop, gotoReady, isInViewport, phone } from "./helpers.ts";

const entries = ["Projects", "Community", "Charter", "Team"];
const stillToCome = ["/community", "/charter", "/projects/meeseeks", "/projects/gossip", "/projects/trebuchet", "/projects/butterbot"];

test.describe("shared navigation", () => {
  test.use({ viewport: desktop });

  test("on the front page it shows Open-Breach, the four entries and Install", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Open-Breach" })).toBeVisible();
    for (const entry of entries) {
      await expect(nav.getByRole("link", { name: entry, exact: true })).toBeVisible();
    }
    await expect(nav.getByRole("link", { name: "Install" })).toBeVisible();
  });

  test("every page shows the same navigation", async ({ page }) => {
    const seen: string[][] = [];
    for (const path of ["/", "/projects/rick", "/community", "/no-such-page"]) {
      await page.goto(path);
      const links = page.getByRole("navigation", { name: "Main" }).getByRole("link");
      seen.push(await links.evaluateAll((all) => all.map((a) => `${a.textContent} → ${a.getAttribute("href")}`)));
    }
    for (const links of seen) expect(links).toEqual(seen[0]);
    expect(seen[0]).toEqual([
      "Open-Breach → /",
      "Projects → /#projects",
      "Community → /community",
      "Charter → /charter",
      "Team → /#team",
      "Install → /#projects",
    ]);
  });

  test("the name Open-Breach leads from the Rick page to the front page", async ({ page }) => {
    await page.goto("/projects/rick");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Open-Breach" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Open tools");
  });

  test("Team leads from the Rick page to the team section of the front page", async ({ page }) => {
    await page.goto("/projects/rick");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Team" }).click();
    await expect(page).toHaveURL("/#team");
    const heading = page.getByRole("heading", { name: "The team" });
    await expect.poll(() => isInViewport(heading)).toBe(true);
  });
});

test.describe("navigation on small screens", () => {
  test.use({ viewport: phone });

  test("the entries are behind a menu control, and Open-Breach and Install are visible", async ({ page }) => {
    await gotoReady(page, "/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Open-Breach" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Install" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Menu" })).toBeVisible();
    for (const entry of entries) {
      await expect(nav.getByRole("link", { name: entry, exact: true })).toBeHidden();
    }
  });

  test("the menu control shows the four entries, and each can be activated", async ({ page }) => {
    const targets: Record<string, string> = {
      Projects: "/#projects",
      Community: "/community",
      Charter: "/charter",
      Team: "/#team",
    };
    for (const entry of entries) {
      await gotoReady(page, "/projects/rick");
      const nav = page.getByRole("navigation", { name: "Main" });
      await nav.getByRole("button", { name: "Menu" }).click();
      for (const other of entries) {
        await expect(nav.getByRole("link", { name: other, exact: true })).toBeVisible();
      }
      await nav.getByRole("link", { name: entry, exact: true }).click();
      await expect(page).toHaveURL(targets[entry]);
    }
  });

  test("the menu opens and closes with the menu control", async ({ page }) => {
    await gotoReady(page, "/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("button", { name: "Menu" }).click();
    await expect(nav.getByRole("link", { name: "Charter" })).toBeVisible();
    await nav.getByRole("button", { name: "Close menu" }).click();
    await expect(nav.getByRole("link", { name: "Charter" })).toBeHidden();
    await expect(nav.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("with the keyboard alone the menu is focused, opened, walked through and closed", async ({ page }) => {
    await gotoReady(page, "/");
    const nav = page.getByRole("navigation", { name: "Main" });
    const control = nav.getByRole("button", { name: "Menu" });

    // Tab from the top of the page: the skip link, the name, Install, then the menu control.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to the content" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Open-Breach" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Install" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(control).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(nav.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    for (const entry of entries) {
      await page.keyboard.press("Tab");
      await expect(nav.getByRole("link", { name: entry, exact: true })).toBeFocused();
    }

    await page.keyboard.press("Escape");
    await expect(nav.getByRole("link", { name: "Charter" })).toBeHidden();
    await expect(nav.getByRole("button", { name: "Menu" })).toBeFocused();

    // And an entry is activated with Enter.
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Community" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("/community");
  });
});

test.describe("skip link", () => {
  test("the first Tab stop leads past the navigation to the content", async ({ page }) => {
    for (const path of ["/", "/projects/rick", "/community", "/no-such-page"]) {
      await page.goto(path);
      const skip = page.getByRole("link", { name: "Skip to the content" });
      await page.keyboard.press("Tab");
      await expect(skip).toBeFocused();
      await expect(skip).toBeInViewport();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp("#content$"));
      await expect(page.locator("main#content")).toHaveCount(1);
    }
  });
});

test.describe("footer", () => {
  test("on the Rick page it links to Open-Breach on GitHub and to the community", async ({ page }) => {
    await page.goto("/projects/rick");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Open-Breach on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Open-Breach",
    );
    await expect(footer.getByRole("link", { name: "Community" })).toHaveAttribute("href", "/community");
  });

  test("every page ends with the footer", async ({ page }) => {
    for (const path of ["/", "/community", "/no-such-page"]) {
      await page.goto(path);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      const last = await page.evaluate(() => document.body.lastElementChild?.tagName === "FOOTER" || [...document.body.children].filter((c) => !["SCRIPT", "NEXT-ROUTE-ANNOUNCER"].includes(c.tagName)).at(-1)?.tagName === "FOOTER");
      expect(last).toBe(true);
    }
  });
});

test.describe("room for a support link", () => {
  test("with no support target, neither the navigation nor the footer shows one", async ({ page }) => {
    for (const viewport of [desktop, phone]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await expect(page.getByRole("link", { name: "Support" })).toHaveCount(0);
      // No empty place either: the last entry is followed directly by Install.
      const nav = page.getByRole("navigation", { name: "Main" });
      await expect(nav.locator("li:empty")).toHaveCount(0);
      await expect(page.getByRole("contentinfo").locator("li:empty")).toHaveCount(0);
    }
  });

  test("with a support target, the navigation and the footer each link to it", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/fixtures/support-link");
    const area = page.getByTestId("with-support");
    const inNav = area.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Support" });
    const inFooter = area.locator("footer").getByRole("link", { name: "Support" });
    await expect(inNav).toBeVisible();
    await expect(inNav).toHaveAttribute("href", "https://example.org/support");
    await expect(inFooter).toHaveAttribute("href", "https://example.org/support");
  });
});

test.describe("routes", () => {
  test("the front page is returned with the status 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("an unknown path gets the not-found page with the status 404, the navigation and a link to the front page", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist.");
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await page.getByRole("main").getByRole("link", { name: "Back to the front page" }).click();
    await expect(page).toHaveURL("/");
  });

  test("a project name that is no project gets the not-found page with the status 404", async ({ page }) => {
    for (const path of ["/projects/no-such-project", "/projects/Rick", "/projects"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page does not exist.");
    }
  });

  test("the test pages are part of the test build only", async ({ page }) => {
    // This build has them. `npm run build` does not: see src/app/fixtures/layout.tsx.
    const response = await page.goto("/fixtures/components");
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

test.describe("no dead links to pages that are not built", () => {
  test("Community opens a page that says it is still to come, with the status 200", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/");
    const [response] = await Promise.all([
      page.waitForResponse((r) => new URL(r.url()).pathname === "/community" && r.request().resourceType() === "document").catch(() => null),
      page.goto("/community"),
    ]);
    expect(response?.status() ?? 200).toBe(200);
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Community" }).click();
    await expect(page).toHaveURL("/community");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Community is still to come.");
    await page.getByRole("main").getByRole("link", { name: "Back to the front page" }).click();
    await expect(page).toHaveURL("/");
  });

  for (const path of stillToCome) {
    test(`${path} answers 200, says it is still to come and asks not to be indexed`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("is still to come.");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.getByRole("main").getByRole("link", { name: "Back to the front page" })).toHaveAttribute("href", "/");
    });
  }

  test("the page of a project that is still to come says what the project is and links to its source", async ({ page }) => {
    await page.goto("/projects/meeseeks");
    const main = page.getByRole("main");
    await expect(main).toContainText("A virtual second monitor for Linux.");
    await expect(main.getByRole("link", { name: "Meeseeks on GitHub" })).toHaveAttribute("href", "https://github.com/Open-Breach/meeseeks");
  });

  test("the navigation marks the page that is open", async ({ page }) => {
    await page.setViewportSize(desktop);
    await page.goto("/community");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Community" })).toHaveAttribute("aria-current", "page");
    await expect(nav.locator("[aria-current]:visible")).toHaveCount(1);
    await page.goto("/");
    await expect(nav.locator("[aria-current]")).toHaveCount(0);
  });

  test("the built pages do not ask to be kept out of search engines", async ({ page }) => {
    for (const path of ["/", "/projects/rick"]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    }
  });

  test("every link inside the site leads to a page that exists", async ({ page, request }) => {
    const paths = new Set<string>();
    for (const start of ["/", "/projects/rick", "/community", "/no-such-page"]) {
      await page.goto(start);
      const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
      for (const href of hrefs) {
        if (href.startsWith("/")) paths.add(href.split("#")[0] || "/");
      }
    }
    expect(paths.size).toBeGreaterThan(5);
    for (const project of projects) expect([...paths]).toContain(`/projects/${project.slug}`);
    for (const path of paths) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
    }
  });

  test("every link to a section leads to a section that exists", async ({ page }) => {
    await page.goto("/projects/rick");
    const hashes = await page.locator('a[href*="#"]').evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));
    for (const href of new Set(hashes)) {
      const [path, id] = href.split("#");
      await page.goto(path || "/projects/rick");
      await expect(page.locator(`[id="${id}"]`), href).toHaveCount(1);
    }
  });
});

test.describe("page metadata", () => {
  test("the Rick page's title names Rick and Open-Breach, and it has a description of Rick", async ({ page }) => {
    await page.goto("/projects/rick");
    await expect(page).toHaveTitle(/Rick/);
    await expect(page).toHaveTitle(/Open-Breach/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Rick is a fast, lean file manager/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("the front page's title names Open-Breach alone, and it has a description of Open-Breach", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Open-Breach");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Open-Breach builds open source tools/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("the other pages name themselves and Open-Breach", async ({ page }) => {
    await page.goto("/community");
    await expect(page).toHaveTitle("Community · Open-Breach");
    await page.goto("/projects/gossip");
    await expect(page).toHaveTitle("Gossip · Open-Breach");
    await page.goto("/no-such-page");
    await expect(page).toHaveTitle("Page not found · Open-Breach");
  });
});
