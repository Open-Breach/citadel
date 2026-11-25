import { defineConfig, devices } from "@playwright/test";

// The end-to-end tests run against a production build, served over HTTPS by
// the production start with a certificate the tests make for themselves. No
// vault is asked. They use ports of their own, so a start on the usual ports
// is left alone and is never tested by mistake.
const port = Number(process.env.E2E_PORT ?? 3100);
const httpPort = Number(process.env.E2E_HTTP_PORT ?? 3180);
const baseURL = `https://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  use: {
    baseURL,
    // The certificate is signed by nobody a browser trusts.
    ignoreHTTPSErrors: true,
    trace: "off",
  },
  projects: [
    // Resizes the photographs once, so that no test waits for the encoder.
    { name: "warm-up", testMatch: /warm-up\.setup\.ts/, use: { ...devices["Desktop Chrome"] } },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["warm-up"],
    },
  ],
  webServer: {
    // The tests make a certificate, build the site with its test pages into
    // a folder of their own (see next.config.ts), and serve that build.
    command:
      "node tests/support/certificates.mjs .certs-e2e localhost && npx next build && node scripts/serve.mjs",
    env: {
      CITADEL_FIXTURES: "1",
      // Empty, not absent: a developer's .env.local must not send the tests to a real vault.
      KEYVAULT_URL: "",
      KEYVAULT_CERTIFICATES: "",
      CERT_DIR: ".certs-e2e",
      PORT: String(port),
      HTTP_PORT: String(httpPort),
      // The main address the canonical addresses are built under (tests/e2e/canonical.spec.ts).
      PUBLIC_BASE_URL: "https://openbreach.dev",
    },
    url: `${baseURL}/healthz`,
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
