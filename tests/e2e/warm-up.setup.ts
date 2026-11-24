import { test } from "@playwright/test";
import { photographWidths, scrollThrough } from "./helpers.ts";

/*
 * Before the browser tests: ask for every photograph once at each size the
 * tests use. The first request for a large AVIF takes seconds to encode;
 * after that the site serves it from its cache. Without this, the first
 * tests would wait for the encoder and time out.
 */
test("the photographs are resized once", async ({ browser }) => {
  test.setTimeout(600_000);
  const heights: Record<number, number> = { 390: 844, 768: 1024, 1440: 900, 1920: 1080 };
  const screens = [
    ...photographWidths.map((width) => ({ width, height: heights[width], scale: 1 })),
    { width: 1440, height: 900, scale: 2 },
    { width: 390, height: 844, scale: 2 },
    { width: 360, height: 800, scale: 1 },
    { width: 1024, height: 800, scale: 1 },
    { width: 1280, height: 800, scale: 1 },
  ];
  for (const screen of screens) {
    const context = await browser.newContext({
      viewport: { width: screen.width, height: screen.height },
      deviceScaleFactor: screen.scale,
    });
    const page = await context.newPage();
    for (const path of ["/", "/projects/rick"]) {
      await page.goto(path);
      await scrollThrough(page);
      await page.waitForFunction(
        () => [...document.querySelectorAll<HTMLImageElement>("[data-photograph] img")].every((img) => img.complete && img.naturalWidth > 0),
        undefined,
        { timeout: 300_000 },
      );
    }
    await context.close();
  }
});
