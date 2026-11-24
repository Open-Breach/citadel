// The production start, `npm start` and the container's command: downloads
// the certificates from Key Vault, then serves the built site over HTTPS on
// PORT (3000) and answers plain HTTP on HTTP_PORT (3080) with a redirect to
// HTTPS. Both listen on every address of the machine, IPv4 and IPv6
// (scripts/listen.mjs).
//
// It does what the server.js that Next.js generates for a standalone build
// does, with Next's request handler mounted on https.createServer instead of
// the plain HTTP server: `next start` cannot serve TLS. getRequestHandlers is
// internal to Next.js, so every upgrade of Next.js has to pass
// tests/integration/serve.test.mjs, which starts this script for real.
import { existsSync, readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadCertificates, pairsOnDisk, sniCallback } from "./certificates.mjs";
import loadEnv from "./dotenv.mjs";
import { certificateFolder, certificateNames, fetchCertificates, settingsFromEnv } from "./fetch-cert.mjs";
import { describeAddress, isEveryAddress, listen, listenHost, urlHost } from "./listen.mjs";
import { redirectHandler } from "./redirect.mjs";

// The folder the build lives in: the project on a developer machine, /app in
// the image, which holds the standalone output of the build.
const dir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
process.chdir(dir);
loadEnv();
process.env.NODE_ENV = "production";

/** A port from the environment, or its default. */
function portFrom(value, fallback) {
  const port = parseInt(value ?? "", 10);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : fallback;
}

const port = portFrom(process.env.PORT, 3000);
const httpPort = portFrom(process.env.HTTP_PORT, 3080);
const publicHttpsPort = portFrom(process.env.PUBLIC_HTTPS_PORT, 443);
let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT ?? "", 10);
if (Number.isNaN(keepAliveTimeout) || !Number.isFinite(keepAliveTimeout) || keepAliveTimeout < 0) {
  keepAliveTimeout = undefined;
}

// The image carries its version: package.json's with the short commit.
if (process.env.APP_VERSION?.trim()) {
  console.log(`serve: citadel ${process.env.APP_VERSION.trim()}`);
}

/** Ends a start that cannot go on. Nothing listens yet when this is called. */
function fail(message) {
  console.error(`serve: not started: ${message}`);
  process.exit(1);
}

/**
 * The key and certificate pairs to serve with, the default first: from Key
 * Vault, or the pairs already in CERT_DIR when no vault is named. One
 * certificate that cannot be had ends the start.
 */
async function certificatePairs() {
  if (process.env.KEYVAULT_URL?.trim()) {
    return fetchCertificates(settingsFromEnv());
  }
  const pairs = pairsOnDisk({
    dir: certificateFolder(),
    names: certificateNames(process.env.KEYVAULT_CERTIFICATES),
  });
  console.log(`serve: no vault is named, using the certificates on disk in ${path.resolve(certificateFolder())}`);
  return pairs;
}

let certificates;
try {
  certificates = loadCertificates(await certificatePairs());
} catch (error) {
  fail(error.message ?? error);
}

// The build. The browser tests build with their test pages into a folder of
// their own (next.config.ts) and start this script on that build.
const distDir = process.env.CITADEL_FIXTURES === "1" ? ".next-e2e" : ".next";
const serverFiles = path.join(dir, distDir, "required-server-files.json");
if (!existsSync(serverFiles)) {
  fail(`${path.join(distDir, "required-server-files.json")} is missing. Build the site first: npm run build`);
}

const hostname = await listenHost();
const shownHost = isEveryAddress(hostname) ? "localhost" : urlHost(hostname);

// What the generated server.js does before it starts: the build's
// configuration for the runtime.
const require = createRequire(path.join(dir, "server.js"));
const { config } = JSON.parse(readFileSync(serverFiles, "utf8"));
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config);

// The main address is part of the built pages (next.config.ts). An
// environment that names another one changes nothing, and is told so.
const builtMainAddress = config.env?.PUBLIC_BASE_URL;
const askedMainAddress = process.env.PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
if (askedMainAddress && builtMainAddress && askedMainAddress !== builtMainAddress) {
  console.warn(
    `serve: warning: PUBLIC_BASE_URL is ${askedMainAddress}, but this build names ${builtMainAddress} as the main address. ` +
      "The main address is set when the site is built, and the pages keep the one they were built with",
  );
}

require("next");
const { getRequestHandlers } = require("next/dist/server/lib/start-server");

process.env.PORT = String(port);
process.env.__NEXT_PRIVATE_ORIGIN = `https://${shownHost}:${port}`;
process.env.__NEXT_EXPERIMENTAL_HTTPS = "1";

// The HTTPS server. A client that names no host gets the default pair; for a
// client that names one, the callback picks the certificate.
const [defaultCertificate] = certificates;
const server = https.createServer({
  key: defaultCertificate.key,
  cert: defaultCertificate.cert,
  SNICallback: sniCallback(certificates),
});
if (keepAliveTimeout) {
  server.keepAliveTimeout = keepAliveTimeout;
}

const handlers = await getRequestHandlers({
  dir,
  port,
  isDev: false,
  hostname,
  keepAliveTimeout,
  experimentalHttpsServer: true,
  server,
  onDevServerCleanup: undefined,
  quiet: false,
});

server.on("request", async (req, res) => {
  try {
    await handlers.requestHandler(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
    console.error(`Failed to handle request for ${req.url}`, error);
  }
});
server.on("upgrade", async (req, socket, head) => {
  try {
    await handlers.upgradeHandler(req, socket, head);
  } catch (error) {
    socket.destroy();
    console.error(`Failed to handle upgrade for ${req.url}`, error);
  }
});

// The plain HTTP listener. Its handler never reaches Next.js.
const redirector = http.createServer(redirectHandler({ httpsPort: publicHttpsPort }));

let stopping = false;
for (const listener of [server, redirector]) {
  listener.on("error", (error) => {
    if (stopping) return;
    console.error("serve: a listener failed", error);
    process.exit(1);
  });
}

// A port that cannot be bound ends the start.
try {
  const address = await listen(server, { host: hostname, port });
  const httpAddress = await listen(redirector, { host: hostname, port: httpPort });
  const shownPort = publicHttpsPort === 443 ? "" : `:${publicHttpsPort}`;
  console.log(`serve: plain HTTP on ${describeAddress(httpAddress)} redirects to https://<host>${shownPort}`);
  console.log(`serve: ready on https://${shownHost}:${port}, listening on ${describeAddress(address)}`);
} catch (error) {
  console.error(`serve: not started: ${error.message ?? error}`);
  process.exit(1);
}

// On a termination signal: no new connections, the requests in progress
// finish, and the process ends with success within five seconds.
function shutdown() {
  if (stopping) return;
  stopping = true;
  const listeners = [server, redirector];
  let open = listeners.length;
  for (const listener of listeners) {
    listener.close(() => {
      open -= 1;
      if (open === 0) process.exit(0);
    });
  }
  // close() ends the connections that are idle now. One that answers a
  // request stays open until its answer is out, and is ended then.
  setInterval(() => listeners.forEach((listener) => listener.closeIdleConnections()), 100).unref();
  setTimeout(() => process.exit(0), 4_500).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
