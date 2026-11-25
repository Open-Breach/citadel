// `npm run test:image`: the container image, started for real. Build it
// first and name it in IMAGE (default citadel:test):
//
//   docker build -t citadel:test .
//   npm run test:image
//
// The container gets a certificate that is made here, mounted into its
// certificate folder, and no vault. The workflow runs this for each platform
// on a machine of that platform.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, chmodSync, mkdtempSync, rmSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

import sharp from "sharp";

import { makeCertificate, writePair } from "../support/certificates.mjs";

const image = process.env.IMAGE?.trim() || "citadel:test";
const docker = (...args) => execFileSync("docker", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

// The pair is mounted from here. The container's user is not this user, so
// the test key, which protects nothing, is readable by everybody.
const certDir = mkdtempSync(path.join(tmpdir(), "citadel-image-"));
writePair(certDir, makeCertificate({ names: ["openbreach.dev", "*.openbreach.dev", "localhost"] }));
chmodSync(certDir, 0o777);
chmodSync(path.join(certDir, "key.pem"), 0o644);
chmodSync(path.join(certDir, "cert.pem"), 0o644);

const containers = [];

/** Starts a container of the image and waits until the site says it is ready. */
async function run(...options) {
  const id = docker("run", "--detach", "--publish", "127.0.0.1::3000", "--publish", "127.0.0.1::3080", ...options, image);
  containers.push(id);
  const hostPort = (port) => Number(docker("port", id, `${port}/tcp`).split("\n")[0].split(":").pop());
  const container = { id, port: hostPort(3000), httpPort: hostPort(3080) };
  for (let attempt = 0; attempt < 120; attempt++) {
    if (logs(id).includes("serve: ready on ")) return container;
    assert.equal(docker("inspect", "--format", "{{.State.Running}}", id), "true", `the container ended:\n${logs(id)}`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.fail(`the site was not ready after 30 seconds:\n${logs(id)}`);
}

/** What the container wrote, to both of its outputs. */
function logs(id) {
  const { stdout, stderr } = spawnSync("docker", ["logs", id], { encoding: "utf8" });
  return `${stdout}${stderr}`;
}

/** Stops a container as a cluster does, and says how it ended. */
function stop({ id }) {
  const from = Date.now();
  docker("stop", "--time", "10", id);
  return {
    milliseconds: Date.now() - from,
    exitCode: Number(docker("inspect", "--format", "{{.State.ExitCode}}", id)),
  };
}

/** One request to the container, resolving with status, headers, body and the time it took. */
function ask({ port, path: target = "/", plain = false, host = "openbreach.dev", headers = {} }) {
  return new Promise((resolve, reject) => {
    const from = process.hrtime.bigint();
    const request = (plain ? http : https).request(
      {
        host: "127.0.0.1",
        port,
        path: target,
        agent: false,
        headers: { host, ...headers },
        // A probe that asks for an address names no host in its TLS greeting.
        ...(plain ? {} : { rejectUnauthorized: false, ...(net.isIP(host) ? {} : { servername: host }) }),
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks),
            milliseconds: Number(process.hrtime.bigint() - from) / 1e6,
          }),
        );
      },
    );
    request.on("error", reject);
    request.end();
  });
}

/** The most memory the site's process has held so far, in MiB. */
function peakMemory({ id }) {
  const status = docker("exec", id, "cat", "/proc/1/status");
  return Math.round(Number(/VmHWM:\s+(\d+) kB/.exec(status)[1]) / 1024);
}

/** The address of the first screen's photograph in a width, as the front page asks for it. */
async function firstScreenPhotograph(container, width) {
  const html = (await ask({ port: container.port })).body.toString().replaceAll("&amp;", "&");
  const preload = /<link rel="preload" as="image" imageSrcSet="([^"]+)"/.exec(html)?.[1];
  assert.ok(preload, "the front page asks for the photograph of its first screen with priority");
  const address = preload.split(", ").find((entry) => entry.endsWith(` ${width}w`))?.split(" ")[0];
  assert.ok(address, `the photograph is offered ${width} pixels wide`);
  return address;
}

const AVIF = "image/avif,image/webp,image/*,*/*;q=0.8";
const WEBP = "image/webp,image/*,*/*;q=0.8";

let site;

before(async () => {
  site = await run("--volume", `${certDir}:/app/.certs:ro`);
});

after(() => {
  for (const id of containers) {
    try {
      docker("rm", "--force", id);
    } catch {
      // Gone already.
    }
  }
  rmSync(certDir, { recursive: true, force: true });
});

// First, on a container that has resized nothing yet, so that the numbers are those of one request.
test("the first screen's photograph for a 1440 screen at two device pixels per pixel, as AVIF: time and memory", async (t) => {
  const address = await firstScreenPhotograph(site, 2880);
  const idle = peakMemory(site);
  const first = await ask({ port: site.port, path: address, headers: { accept: AVIF } });
  const peak = peakMemory(site);
  assert.equal(first.status, 200);
  assert.equal(first.headers["content-type"], "image/avif");
  const { format, width } = await sharp(first.body).metadata();
  assert.deepEqual({ format, width }, { format: "heif", width: 2880 });
  const line =
    `first AVIF request, 2880 wide, on ${process.arch}: ${Math.round(first.milliseconds)} ms, ` +
    `${Math.round(first.body.length / 1024)} KiB; peak memory of the site's process ${peak} MiB (${idle} MiB before)`;
  t.diagnostic(line);
  // In a workflow the numbers go onto the run's summary page.
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n\n`);
});

for (const [name, width, accept, type, format] of [
  ["AVIF for a 1440 screen at two device pixels per pixel", 2880, AVIF, "image/avif", "heif"],
  ["WebP for a 1440 screen at two device pixels per pixel", 2880, WEBP, "image/webp", "webp"],
  ["AVIF for a phone", 828, AVIF, "image/avif", "heif"],
  ["WebP for a phone", 828, WEBP, "image/webp", "webp"],
]) {
  test(`the first screen's photograph as ${name}, and again from what the container kept`, async () => {
    const address = await firstScreenPhotograph(site, width);
    const first = await ask({ port: site.port, path: address, headers: { accept } });
    assert.equal(first.status, 200);
    assert.equal(first.headers["content-type"], type);
    const decoded = await sharp(first.body).metadata();
    assert.deepEqual({ format: decoded.format, width: decoded.width }, { format, width });

    const again = await ask({ port: site.port, path: address, headers: { accept } });
    assert.equal(again.status, 200);
    assert.equal(again.headers["x-nextjs-cache"], "HIT", "the second request is answered from what the container kept");
    assert.ok(again.body.equals(first.body), "with the same picture");
  });
}

test("the phone gets a smaller file than the 1440 screen", async () => {
  const phone = await ask({ port: site.port, path: await firstScreenPhotograph(site, 828), headers: { accept: AVIF } });
  const desktop = await ask({ port: site.port, path: await firstScreenPhotograph(site, 2880), headers: { accept: AVIF } });
  assert.ok(phone.body.length < desktop.body.length);
});

test("without arguments the image serves the site over HTTPS on 3000", async () => {
  const front = await ask({ port: site.port });
  assert.equal(front.status, 200);
  assert.match(front.body.toString(), /<title>Open-Breach<\/title>/);
  const stylesheet = /href="(\/_next\/static\/[^"]+\.css)"/.exec(front.body.toString())?.[1];
  assert.equal((await ask({ port: site.port, path: stylesheet })).status, 200, "a stylesheet");
  assert.equal((await ask({ port: site.port, path: "/projects/rick", host: "open-breach.com" })).status, 200);
  assert.equal((await ask({ port: site.port, path: "/no-such-page" })).status, 404);
});

test("plain HTTP on 3080 redirects to HTTPS", async () => {
  const answer = await ask({ port: site.httpPort, plain: true, host: "open-breach.org", path: "/projects/rick?ref=x" });
  assert.equal(answer.status, 308);
  assert.equal(answer.headers.location, "https://open-breach.org/projects/rick?ref=x");
});

test("the health path answers 200 over HTTPS and is redirected over plain HTTP", async () => {
  const probe = await ask({ port: site.port, path: "/healthz", host: "10.0.0.7" });
  assert.equal(probe.status, 200);
  assert.equal(probe.body.toString(), "ok\n");
  assert.equal((await ask({ port: site.httpPort, plain: true, path: "/healthz" })).status, 308);
});

test("the site's process is not root, and HOSTNAME does not decide the address", () => {
  const status = docker("exec", site.id, "cat", "/proc/1/status");
  const uid = Number(/Uid:\s+(\d+)/.exec(status)[1]);
  assert.notEqual(uid, 0);
  assert.equal(Number(docker("exec", site.id, "id", "-u")), uid);
  assert.match(docker("exec", site.id, "cat", "/proc/1/cmdline"), /^node\0scripts\/serve\.mjs/);
  // The runtime sets HOSTNAME to the container's name; the site answered on the published ports all the same.
  assert.notEqual(docker("exec", site.id, "printenv", "HOSTNAME"), "");
  assert.match(logs(site.id), /listening on (\[::\]:3000 \(IPv4 and IPv6\)|0\.0\.0\.0:3000 \(IPv4 only\))/);
});

test("the image's environment names no vault, no certificate and no registry", () => {
  const environment = docker("inspect", "--format", "{{range .Config.Env}}{{println .}}{{end}}", image);
  assert.doesNotMatch(environment, /KEYVAULT|REGISTRY|PASSWORD|TOKEN/i);
  assert.match(environment, /^CERT_DIR=\/app\/\.certs$/m);
  assert.doesNotMatch(environment, /^HOSTNAME=/m);
  assert.notEqual(docker("inspect", "--format", "{{.Config.User}}", image), "");
});

test("stopped, the site's process ends with the status 0 within five seconds", () => {
  const ended = stop(site);
  assert.equal(ended.exitCode, 0, logs(site.id));
  assert.ok(ended.milliseconds < 5_000, `it took ${ended.milliseconds} ms`);
});

test("with a read-only root file system and its two folders writable, pages and photographs are served", async () => {
  // The folder for resized pictures is an empty one that everybody may write
  // to, as a cluster's empty volume is.
  const readOnly = await run("--read-only", "--tmpfs", "/app/.next/cache:mode=1777", "--volume", `${certDir}:/app/.certs`);
  assert.throws(() => docker("exec", readOnly.id, "touch", "/app/written"), /Read-only file system/);
  docker("exec", readOnly.id, "sh", "-c", "touch /app/.certs/written /app/.next/cache/written");

  assert.equal((await ask({ port: readOnly.port })).status, 200);
  assert.equal((await ask({ port: readOnly.port, path: "/projects/rick" })).status, 200);
  assert.equal((await ask({ port: readOnly.port, path: "/healthz" })).status, 200);
  const address = await firstScreenPhotograph(readOnly, 828);
  const photograph = await ask({ port: readOnly.port, path: address, headers: { accept: AVIF } });
  assert.equal(photograph.status, 200);
  assert.equal(photograph.headers["content-type"], "image/avif");
  assert.equal((await ask({ port: readOnly.port, path: address, headers: { accept: AVIF } })).headers["x-nextjs-cache"], "HIT");
  assert.doesNotMatch(logs(readOnly.id), /EROFS|read-only file system/i);

  assert.equal(stop(readOnly).exitCode, 0);
});

test("without a vault and without a certificate the container does not start", async () => {
  const id = docker("run", "--detach", image);
  containers.push(id);
  assert.equal(Number(docker("wait", id)), 1);
  assert.match(logs(id), /serve: not started: a certificate is missing/);
});
