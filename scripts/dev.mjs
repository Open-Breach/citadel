// `npm run dev`: downloads the default certificate from Key Vault and starts
// `next dev` over HTTPS with it, at https://local.openbreach.dev:14443 unless
// DEV_HOST and DEV_PORT say otherwise. The download uses the Azure CLI login,
// so `az login` and the two settings in .env.local are all a local start
// needs.
//
// There is no plain HTTP start: without a certificate nothing starts.
// `next dev` takes one key and one certificate, so only the first certificate
// of the list is used. Arguments are passed on to `next dev`
// (`npm run dev -- --inspect`).
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

import loadEnv from "./dotenv.mjs";
import { fetchCertificates, settingsFromEnv } from "./fetch-cert.mjs";

// `next dev` reads .env.local itself; the download before it needs it too.
loadEnv();

const host = process.env.DEV_HOST?.trim() || "local.openbreach.dev";
const port = process.env.DEV_PORT?.trim() || "14443";

let certificate;
try {
  const settings = settingsFromEnv();
  [certificate] = await fetchCertificates({ ...settings, names: settings.names.slice(0, 1) });
} catch (error) {
  console.error(`dev: not started: ${error.message ?? error}`);
  process.exit(1);
}

const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
const child = spawn(
  process.execPath,
  [
    next,
    "dev",
    "-p",
    port,
    "-H",
    host,
    "--experimental-https",
    "--experimental-https-key",
    certificate.key,
    "--experimental-https-cert",
    certificate.cert,
    ...process.argv.slice(2),
  ],
  { stdio: "inherit", env: process.env },
);

// Ctrl+C reaches the child through the terminal as well; this covers a signal
// sent to this process alone, and makes this process end the way the child did.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("error", (error) => {
  console.error("dev: next dev could not be started:", error.message ?? error);
  process.exit(1);
});
child.on("exit", (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});
