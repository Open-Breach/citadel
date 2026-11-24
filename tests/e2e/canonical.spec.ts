import { expect, test, type APIRequestContext } from "@playwright/test";

// The main address the tests build the site with (playwright.config.ts).
const mainAddress = "https://openbreach.dev";

/**
 * Asks the site for `path` as a client that reached it under `host`, and
 * gives the canonical addresses in the head of the page as it is sent,
 * before any script runs.
 */
async function canonicalUnder(request: APIRequestContext, host: string, path: string) {
  const response = await request.get(path, { headers: { host }, maxRedirects: 0 });
  const head = (await response.text()).split("</head>")[0];
  const canonical = [...head.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((match) => match[1]);
  return { status: response.status(), canonical };
}

test.describe("canonical address", () => {
  test("the Rick page reached under another domain names its address under the main address", async ({ request }) => {
    expect(await canonicalUnder(request, "open-breach.com", "/projects/rick")).toEqual({
      status: 200,
      canonical: [`${mainAddress}/projects/rick`],
    });
  });

  test("the Rick page reached under the main address names that same address", async ({ request }) => {
    expect(await canonicalUnder(request, new URL(mainAddress).host, "/projects/rick")).toEqual({
      status: 200,
      canonical: [`${mainAddress}/projects/rick`],
    });
  });

  test("with and without www, and under the name of a local start, the address is the same", async ({ request }) => {
    for (const host of ["www.openbreach.dev", "web-stg.openbreach.dev", "local.openbreach.dev:14443", "open-breach.org"]) {
      expect((await canonicalUnder(request, host, "/projects/rick")).canonical, host).toEqual([
        `${mainAddress}/projects/rick`,
      ]);
    }
  });

  for (const [path, canonical] of [
    ["/", mainAddress],
    ["/charter", `${mainAddress}/charter`],
    ["/community", `${mainAddress}/community`],
    ["/projects/gossip", `${mainAddress}/projects/gossip`],
    // What follows the question mark is not part of a page's address.
    ["/projects/rick?ref=x", `${mainAddress}/projects/rick`],
  ]) {
    test(`${path} names ${canonical} in the page the browser shows`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('head > link[rel="canonical"]')).toHaveAttribute("href", canonical);
    });
  }

  test("an address that is no page names no canonical address", async ({ request, page }) => {
    expect(await canonicalUnder(request, "open-breach.com", "/no-such-page")).toEqual({ status: 404, canonical: [] });
    expect(await canonicalUnder(request, "open-breach.com", "/projects/no-such-project")).toEqual({
      status: 404,
      canonical: [],
    });
    await page.goto("/no-such-page");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
});
