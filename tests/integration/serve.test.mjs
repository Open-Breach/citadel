// `npm run test:integration`: the production start, for real and without a
// vault. Two certificates are made here for two names and put where the start
// script reads them; the script then serves the build in .next on free ports.
// Run `npm run build` first.
//
// This is the test that catches a Next.js upgrade that breaks the HTTPS
// start: scripts/serve.mjs mounts a request handler that is internal to
// Next.js.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { X509Certificate } from "node:crypto";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import tls from "node:tls";
import { fileURLToPath } from "node:url";

import { ipv6Available } from "../../scripts/listen.mjs";
import { makeAuthority, makeCertificate, writePair } from "../support/certificates.mjs";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const serveScript = path.join(root, "scripts", "serve.mjs");

const authority = makeAuthority();
const first = makeCertificate({ names: ["first.test", "*.first.test"], authority });
const second = makeCertificate({ names: ["second.test", "*.second.test"], authority });
const fingerprint = (certificate) => new X509Certificate(certificate.certPem).fingerprint256;

const certDir = mkdtempSync(path.join(tmpdir(), "citadel-serve-"));
writePair(path.join(certDir, "cert-one"), first);
writePair(path.join(certDir, "cert-two"), second);
const emptyDir = mkdtempSync(path.join(tmpdir(), "citadel-serve-empty-"));

/** A port nobody listens on at the moment. */
function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

/**
 * Starts the production start with `env` on top of a clean set of variables.
 * Resolves once it says it is ready, or once it has ended.
 */
async function start(env = {}) {
  const port = await freePort();
  const httpPort = await freePort();
  const child = spawn(process.execPath, [serveScript], {
    cwd: root,
    env: {
      PATH: process.env.PATH,
      // Empty, not absent: a developer's .env.local must not send the test to a real vault.
      KEYVAULT_URL: "",
      KEYVAULT_CERTIFICATES: "cert-one,cert-two",
      CERT_DIR: certDir,
      PORT: String(port),
      HTTP_PORT: String(httpPort),
      PUBLIC_HTTPS_PORT: "",
      BIND_HOST: "",
      PUBLIC_BASE_URL: "",
      // What a container runtime sets, and what must not decide the address.
      HOSTNAME: "citadel-7c9d8b6f5-x2x4q",
      ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const started = { child, port, httpPort, log: "" };
  started.exited = new Promise((resolve) => child.once("exit", (code, signal) => resolve({ code, signal })));
  const ready = new Promise((resolve) => {
    const read = (chunk) => {
      started.log += chunk;
      if (started.log.includes("serve: ready on ")) resolve();
    };
    child.stdout.setEncoding("utf8").on("data", read);
    child.stderr.setEncoding("utf8").on("data", read);
  });
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`the start said nothing for 60 seconds:\n${started.log}`)), 60_000).unref(),
  );
  await Promise.race([ready, started.exited, timeout]);
  return started;
}

/** Ends a start and resolves with how it ended and how long that took. */
async function stop(started) {
  const from = Date.now();
  started.child.kill("SIGTERM");
  const { code, signal } = await started.exited;
  return { code, signal, milliseconds: Date.now() - from };
}

/** The leaf certificate the server presents to a client that asks for `servername`. */
function presented(port, servername) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: "127.0.0.1", port, servername, rejectUnauthorized: false }, () => {
      const certificate = socket.getPeerX509Certificate();
      socket.end();
      resolve(certificate.fingerprint256);
    });
    socket.on("error", reject);
  });
}

/** One request, resolving with the status, the headers and the body. */
function ask({ port, host, method = "GET", path: target = "/", plain = false, address = "127.0.0.1", headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const request = (plain ? http : https).request(
      {
        host: address,
        port,
        method,
        path: target,
        agent: false,
        headers: { ...(host ? { host } : {}), ...headers },
        // The name on the certificate is checked where a test is about it.
        ...(plain ? {} : { servername: host, rejectUnauthorized: false }),
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () =>
          resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }),
        );
      },
    );
    request.on("error", reject);
    request.end(body);
  });
}

let site;
const hasIpv6 = await ipv6Available();

before(async () => {
  assert.ok(
    existsSync(path.join(root, ".next", "required-server-files.json")),
    "there is no build in .next: run `npm run build` before `npm run test:integration`",
  );
  site = await start();
  assert.equal(site.child.exitCode, null, `the production start ended:\n${site.log}`);
});

after(async () => {
  if (site && site.child.exitCode === null) site.child.kill("SIGKILL");
  rmSync(certDir, { recursive: true, force: true });
  rmSync(emptyDir, { recursive: true, force: true });
});

test("a subdomain under a wildcard gets that certificate", async () => {
  assert.equal(await presented(site.port, "www.first.test"), fingerprint(first));
  assert.equal(await presented(site.port, "www.second.test"), fingerprint(second));
});

test("another domain gets its own certificate, not the first one", async () => {
  assert.equal(await presented(site.port, "second.test"), fingerprint(second));
  assert.equal(await presented(site.port, "first.test"), fingerprint(first));
});

test("an unknown name gets the first certificate", async () => {
  assert.equal(await presented(site.port, "example.com"), fingerprint(first));
  assert.equal(await presented(site.port, "a.b.second.test"), fingerprint(first), "a wildcard covers one label only");
});

test("a client that names no host gets the first certificate", async () => {
  assert.equal(await presented(site.port, undefined), fingerprint(first));
});

test("each certificate is presented with its chain, and a client that trusts the authority accepts it", async () => {
  for (const name of ["first.test", "www.second.test"]) {
    await new Promise((resolve, reject) => {
      const socket = tls.connect({ host: "127.0.0.1", port: site.port, servername: name, ca: authority.certPem }, () => {
        assert.equal(socket.authorized, true, name);
        socket.end();
        resolve();
      });
      socket.on("error", reject);
    });
  }
});

test("the front page is served over HTTPS", async () => {
  const answer = await ask({ port: site.port, host: "first.test" });
  assert.equal(answer.status, 200);
  assert.match(answer.headers["content-type"], /^text\/html/);
  assert.match(answer.body.toString(), /<title>Open-Breach<\/title>/);
});

test("the stylesheet a page refers to and a font the stylesheet refers to are served", async () => {
  const html = (await ask({ port: site.port, host: "first.test" })).body.toString();
  const stylesheets = [...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map((match) => match[1]);
  assert.ok(stylesheets.length > 0, "the front page refers to a stylesheet");
  let font;
  for (const stylesheet of stylesheets) {
    const answer = await ask({ port: site.port, host: "first.test", path: stylesheet });
    assert.equal(answer.status, 200, stylesheet);
    assert.match(answer.headers["content-type"], /^text\/css/);
    const referred = /url\(["']?([^)"']+\.woff2)["']?\)/.exec(answer.body.toString())?.[1];
    if (referred) font = new URL(referred, `https://first.test${stylesheet}`).pathname;
  }
  assert.ok(font, "a stylesheet refers to a font");
  const answer = await ask({ port: site.port, host: "first.test", path: font });
  assert.equal(answer.status, 200, font);
  assert.match(answer.headers["content-type"], /^font\/woff2/);
});

test("a file from the public folder is served", async () => {
  const html = (await ask({ port: site.port, host: "first.test" })).body.toString();
  const image = /\/_next\/image\?url=([^&"]+)/.exec(html)?.[1];
  assert.ok(image, "the front page shows a photograph");
  const answer = await ask({ port: site.port, host: "first.test", path: decodeURIComponent(image) });
  assert.equal(answer.status, 200);
  assert.match(answer.headers["content-type"], /^image\//);
});

test("a path that is no page gets the not-found page", async () => {
  const answer = await ask({ port: site.port, host: "first.test", path: "/no-such-page" });
  assert.equal(answer.status, 404);
  assert.match(answer.body.toString(), /Page not found/);
});

test("every host name gets the same page, and none is redirected to another", async () => {
  const reference = await ask({ port: site.port, host: "openbreach.dev", path: "/projects/rick" });
  assert.equal(reference.status, 200);
  for (const host of ["open-breach.com", "www.openbreach.dev", "second.test", "localhost"]) {
    const answer = await ask({ port: site.port, host, path: "/projects/rick" });
    assert.equal(answer.status, 200, host);
    assert.equal(answer.headers.location, undefined, host);
    assert.equal(answer.body.toString(), reference.body.toString(), `${host} gets the same page`);
  }
});

test("plain HTTP is redirected to HTTPS with the same host, path and query", async () => {
  const answer = await ask({ port: site.httpPort, plain: true, host: "open-breach.org", path: "/projects/rick?ref=x" });
  assert.equal(answer.status, 308);
  assert.equal(answer.headers.location, "https://open-breach.org/projects/rick?ref=x");
  assert.doesNotMatch(answer.body.toString(), /<html/i, "no page is served over plain HTTP");
});

test("a POST over plain HTTP gets the same redirect", async () => {
  const answer = await ask({
    port: site.httpPort,
    plain: true,
    method: "POST",
    host: "open-breach.org",
    path: "/projects/rick?ref=x",
    body: "name=value",
  });
  assert.equal(answer.status, 308);
  assert.equal(answer.headers.location, "https://open-breach.org/projects/rick?ref=x");
});

test("a plain HTTP request for an invalid host gets 400 and no redirect", async () => {
  const answer = await ask({ port: site.httpPort, plain: true, host: "evil.example/path" });
  assert.equal(answer.status, 400);
  assert.equal(answer.headers.location, undefined);
});

test("the health path answers 200 over HTTPS, whatever name the probe uses", async () => {
  // A cluster probes the pod's address and does not check the name on the certificate.
  const answer = await ask({ port: site.port, path: "/healthz" });
  assert.equal(answer.status, 200);
  assert.match(answer.headers["content-type"], /^text\/plain/);
  assert.equal(answer.body.toString(), "ok\n");
});

test("the health path is redirected over plain HTTP like every other path", async () => {
  const answer = await ask({ port: site.httpPort, plain: true, host: "openbreach.dev", path: "/healthz" });
  assert.equal(answer.status, 308);
  assert.equal(answer.headers.location, "https://openbreach.dev/healthz");
});

test("both listeners answer over IPv6 as well, although HOSTNAME holds a pod's name", async (t) => {
  if (!hasIpv6) {
    assert.ok(!process.env.REQUIRE_IPV6, "REQUIRE_IPV6 is set, but this machine has no IPv6");
    assert.match(site.log, /this machine has no IPv6, listening on 0\.0\.0\.0 \(IPv4 only\)/, "the start says so");
    t.skip("this machine has no IPv6; the listeners bind 0.0.0.0 and say so");
    return;
  }
  assert.equal((await ask({ port: site.port, address: "::1", path: "/healthz" })).status, 200);
  assert.equal((await ask({ port: site.httpPort, address: "::1", plain: true, host: "openbreach.dev" })).status, 308);
});

test("the log names each certificate with its expiry date and its names, and holds no key material", () => {
  const date = String.raw`\d{4}-\d{2}-\d{2}T[\d:.]+Z`;
  assert.match(
    site.log,
    new RegExp(String.raw`serve: certificate cert-one \(read from disk, expires ${date}\), the default: first\.test, \*\.first\.test`),
  );
  assert.match(
    site.log,
    new RegExp(String.raw`serve: certificate cert-two \(read from disk, expires ${date}\): second\.test, \*\.second\.test`),
  );
  assert.doesNotMatch(site.log, /PRIVATE KEY/);
  for (const certificate of [first, second]) {
    const body = certificate.key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
    assert.ok(!site.log.includes(body.slice(100, 140)), "the log holds a part of a private key");
  }
});

test("a configured public HTTPS port is the port of the redirect's target", async () => {
  const local = await start({ PUBLIC_HTTPS_PORT: "14443", BIND_HOST: "127.0.0.1" });
  try {
    const answer = await ask({ port: local.httpPort, plain: true, host: `local.openbreach.dev:${local.httpPort}` });
    assert.equal(answer.status, 308);
    assert.equal(answer.headers.location, "https://local.openbreach.dev:14443/");
    if (hasIpv6) {
      await assert.rejects(ask({ port: local.port, address: "::1", path: "/healthz" }), { code: "ECONNREFUSED" });
    }
  } finally {
    const ended = await stop(local);
    assert.equal(ended.code, 0, "an idle start ends with the status 0 on the termination signal");
    assert.ok(ended.milliseconds < 5_000, `it ended after ${ended.milliseconds} ms`);
  }
});

test("a main address that differs from the one the site was built with is pointed out at start", async () => {
  const other = await start({ PUBLIC_BASE_URL: "https://main.example/" });
  try {
    assert.match(
      other.log,
      /serve: warning: PUBLIC_BASE_URL is https:\/\/main\.example, but this build names https:\/\/\S+ as the main address/,
    );
    assert.doesNotMatch(site.log, /PUBLIC_BASE_URL/, "a start that names no main address says nothing about it");
  } finally {
    await stop(other);
  }
});

test("with no vault and no certificate on disk the start ends with an error, and nothing listens", async () => {
  const failed = await start({ CERT_DIR: emptyDir, KEYVAULT_CERTIFICATES: "" });
  const { code } = await failed.exited;
  assert.equal(code, 1);
  assert.match(failed.log, /serve: not started: a certificate is missing/);
  await assert.rejects(ask({ port: failed.port, path: "/healthz" }), { code: "ECONNREFUSED" });
  await assert.rejects(ask({ port: failed.httpPort, plain: true, host: "openbreach.dev" }), { code: "ECONNREFUSED" });
});

test("one certificate of the list that is missing ends the start, and the error names it", async () => {
  const failed = await start({ KEYVAULT_CERTIFICATES: "cert-one,cert-nine,cert-two" });
  const { code } = await failed.exited;
  assert.equal(code, 1);
  assert.match(failed.log, /serve: not started: a certificate is missing: .*cert-nine holds no key\.pem and cert\.pem/);
  await assert.rejects(ask({ port: failed.port, path: "/healthz" }), { code: "ECONNREFUSED" });
});

// Last, because it ends the start the tests above ask.
test("on the termination signal a request in progress is answered, then the start ends with the status 0", async () => {
  // A request the server has begun to receive: its last line is still missing.
  const socket = tls.connect({ host: "127.0.0.1", port: site.port, servername: "first.test", rejectUnauthorized: false });
  await new Promise((resolve, reject) => socket.once("secureConnect", resolve).once("error", reject));
  let answer = "";
  socket.setEncoding("utf8").on("data", (chunk) => (answer += chunk));
  const closed = new Promise((resolve) => socket.once("close", resolve));
  socket.write("GET /healthz HTTP/1.1\r\nHost: first.test\r\n");
  await new Promise((resolve) => setTimeout(resolve, 200));

  const from = Date.now();
  site.child.kill("SIGTERM");
  await new Promise((resolve) => setTimeout(resolve, 500));
  assert.equal(site.child.exitCode, null, "the start waits for the request in progress");
  await assert.rejects(
    ask({ port: site.port, path: "/healthz" }),
    { code: "ECONNREFUSED" },
    "no new connection is accepted after the signal",
  );

  socket.write("\r\n");
  const { code, signal } = await site.exited;
  await closed;
  assert.match(answer, /^HTTP\/1\.1 200 /, "the request in progress was answered");
  assert.match(answer, /\r\nok\n/, "with its body");
  assert.equal(signal, null);
  assert.equal(code, 0);
  assert.ok(Date.now() - from < 5_000, `it ended ${Date.now() - from} ms after the signal`);
});
