import { expect, test } from "@playwright/test";
import { recordForeignRequests, scrollThrough } from "./helpers.ts";

/*
 * Nothing is loaded from other hosts. Every request a page makes is
 * recorded; one to another host fails the test.
 */

const builtPages = [
  "/",
  "/projects/rick",
  "/projects/gossip",
  "/community",
  "/charter",
  "/no-such-page",
];

for (const path of builtPages) {
  test(`${path} loads everything from the site itself`, async ({ page, baseURL }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    const foreign = await recordForeignRequests(page, baseURL!);

    await page.goto(path);
    await scrollThrough(page);

    expect(requests.length, "the page made requests").toBeGreaterThan(3);
    expect(foreign, "requests to another host").toEqual([]);
  });
}

test("fonts, styles, scripts and images all come from the site", async ({ page, baseURL }) => {
  const types = new Set<string>();
  page.on("request", (request) => {
    expect(new URL(request.url()).host).toBe(new URL(baseURL!).host);
    types.add(request.resourceType());
  });
  await page.goto("/");
  await scrollThrough(page);
  for (const type of ["document", "stylesheet", "script", "font", "image"]) {
    expect([...types], `a ${type} was loaded`).toContain(type);
  }
});

test("a link to GitHub requests nothing until the visitor follows it", async ({ page, baseURL }) => {
  const foreign = await recordForeignRequests(page, baseURL!);
  await page.goto("/projects/rick");
  await scrollThrough(page);
  const link = page.getByRole("main").getByRole("link", { name: "Source on GitHub" }).first();
  await expect(link).toHaveAttribute("href", "https://github.com/Open-Breach/rick");
  await link.hover();
  expect(foreign).toEqual([]);

  // Following the link is the visitor's own request.
  await link.click({ noWaitAfter: true });
  await expect.poll(() => foreign).toContainEqual(expect.stringContaining("https://github.com/Open-Breach/rick"));
});

test("the check fails when a page loads an image from another host", async ({ page, baseURL }) => {
  const foreign = await recordForeignRequests(page, baseURL!);
  // A page of the site that, unlike the real ones, loads an image from elsewhere.
  await page.route("**/a-page-with-a-foreign-image", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<!doctype html><title>Test</title><img src="https://images.example.com/badge.svg" alt="">',
    }),
  );
  await page.goto("/a-page-with-a-foreign-image");
  await expect.poll(() => foreign).toEqual(["https://images.example.com/badge.svg"]);
});
