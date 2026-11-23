import { defineConfig, devices } from "@playwright/test";

// The end-to-end tests run against a production build served by `next start`.
// They use a port of their own, so a dev server on 3000 is left alone and is
// never tested by mistake.
const port = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // The tests build the site with its test pages, into a folder of their
    // own (see next.config.ts), and serve that build.
    command: `npx next build && npx next start --port ${port}`,
    env: { CITADEL_FIXTURES: "1" },
    url: baseURL,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
