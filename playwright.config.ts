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
    command: `npx next start --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
