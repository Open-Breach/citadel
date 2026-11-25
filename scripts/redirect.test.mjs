// `npm test`: the plain HTTP listener only redirects.
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import { test } from "node:test";

import { hostName, redirectFor, redirectHandler } from "./redirect.mjs";

test("a page over HTTP is redirected to the same host, path and query over HTTPS", () => {
  assert.deepEqual(redirectFor({ host: "open-breach.org", url: "/projects/rick?ref=x" }), {
    status: 308,
    location: "https://open-breach.org/projects/rick?ref=x",
  });
  assert.deepEqual(redirectFor({ host: "openbreach.dev", url: "/" }), {
    status: 308,
    location: "https://openbreach.dev/",
  });
});

test("a port in the Host header is left out of the target", () => {
  assert.equal(redirectFor({ host: "open-breach.org:80", url: "/" }).location, "https://open-breach.org/");
  assert.equal(redirectFor({ host: "www.openbreach.dev:3080", url: "/charter" }).location, "https://www.openbreach.dev/charter");
});

test("a local run redirects to the public HTTPS port that is configured", () => {
  assert.deepEqual(redirectFor({ host: "local.openbreach.dev:14080", url: "/", httpsPort: 14443 }), {
    status: 308,
    location: "https://local.openbreach.dev:14443/",
  });
  assert.equal(
    redirectFor({ host: "local.openbreach.dev:14080", url: "/healthz", httpsPort: "14443" }).location,
    "https://local.openbreach.dev:14443/healthz",
  );
  assert.equal(redirectFor({ host: "openbreach.dev", url: "/", httpsPort: "443" }).location, "https://openbreach.dev/");
});

test("a request that names no host gets 400 and no redirect", () => {
  assert.deepEqual(redirectFor({ host: undefined, url: "/" }), { status: 400 });
  assert.deepEqual(redirectFor({ host: "", url: "/" }), { status: 400 });
  assert.deepEqual(redirectFor({ host: ":3080", url: "/" }), { status: 400 });
});

test("a host that is no valid host name gets 400 and no redirect", () => {
  for (const host of [
    "evil.example/path",
    "evil.example\\@openbreach.dev",
    "user@openbreach.dev",
    "open breach.dev",
    "openbreach.dev?x",
    "openbreach.dev#x",
    "-openbreach.dev",
    "openbreach-.dev",
    "open..breach.dev",
    ".openbreach.dev",
    "open_breach.dev",
    "[::1]:3080",
    "openbreach.dev:port",
    "öpenbreach.dev",
    `${"a".repeat(64)}.dev`,
    `${"a.".repeat(127)}dev`,
  ]) {
    assert.deepEqual(redirectFor({ host, url: "/" }), { status: 400 }, host);
  }
});

test("the host name is taken in lower case, without a closing dot", () => {
  assert.equal(hostName("Open-Breach.COM"), "open-breach.com");
  assert.equal(hostName("openbreach.dev.:80"), "openbreach.dev");
  assert.equal(hostName("localhost:14080"), "localhost");
  assert.equal(hostName("127.0.0.1:3080"), "127.0.0.1");
});

test("the path cannot lead the redirect to another host", () => {
  assert.equal(redirectFor({ host: "openbreach.dev", url: "//evil.example/x" }).location, "https://openbreach.dev//evil.example/x");
  assert.equal(redirectFor({ host: "openbreach.dev", url: "http://evil.example/x?y=1" }).location, "https://openbreach.dev/x?y=1");
  assert.equal(redirectFor({ host: "openbreach.dev", url: "*" }).location, "https://openbreach.dev/");
  assert.equal(redirectFor({ host: "openbreach.dev", url: "@evil.example" }).location, "https://openbreach.dev/");
  assert.equal(redirectFor({ host: "openbreach.dev", url: "/a b\r\nX: y" }).location, "https://openbreach.dev/a%20b%0D%0AX:%20y");
});

/** Sends one request to the handler on a real socket and resolves with the answer. */
function ask({ method = "GET", path = "/", headers = {}, httpsPort, body }) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(redirectHandler({ httpsPort }));
    server.listen(0, "127.0.0.1", () => {
      const request = http.request(
        { host: "127.0.0.1", port: server.address().port, method, path, headers, agent: false },
        (response) => {
          let text = "";
          response.setEncoding("utf8");
          response.on("data", (chunk) => (text += chunk));
          response.on("end", () => {
            server.close();
            resolve({ status: response.statusCode, location: response.headers.location, text });
          });
        },
      );
      request.on("error", reject);
      request.end(body);
    });
  });
}

test("any method gets the same redirect, and nothing is processed", async () => {
  for (const method of ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"]) {
    const answer = await ask({
      method,
      path: "/projects/rick?ref=x",
      headers: { host: "open-breach.org" },
      body: method === "POST" || method === "PUT" ? "name=value" : undefined,
    });
    assert.equal(answer.status, 308, method);
    assert.equal(answer.location, "https://open-breach.org/projects/rick?ref=x", method);
  }
});

test("the answer holds the address and none of the site's content", async () => {
  const answer = await ask({ headers: { host: "local.openbreach.dev:14080" }, httpsPort: 14443 });
  assert.equal(answer.status, 308);
  assert.equal(answer.location, "https://local.openbreach.dev:14443/");
  assert.equal(answer.text, "This site is served over HTTPS: https://local.openbreach.dev:14443/\n");
});

test("an invalid host gets 400 on the wire, without a Location", async () => {
  const answer = await ask({ headers: { host: "evil.example/path" } });
  assert.equal(answer.status, 400);
  assert.equal(answer.location, undefined);
});

test("a request without a Host header gets 400", async () => {
  const server = http.createServer(redirectHandler());
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const answer = await new Promise((resolve, reject) => {
      const socket = net.connect(server.address().port, "127.0.0.1", () => socket.write("GET / HTTP/1.0\r\n\r\n"));
      let text = "";
      socket.setEncoding("utf8");
      socket.on("data", (chunk) => (text += chunk));
      socket.on("end", () => resolve(text));
      socket.on("error", reject);
    });
    assert.match(answer, /^HTTP\/1\.1 400 /);
    assert.doesNotMatch(answer, /location:/i);
  } finally {
    server.close();
  }
});
