// `npm test`: the address the listeners of scripts/serve.mjs bind.
//
// On a machine without IPv6 the connection over ::1 is skipped. REQUIRE_IPV6=1
// turns that skip into a failure, for a machine that is known to have IPv6.
import assert from "node:assert/strict";
import http from "node:http";
import { test } from "node:test";

import { EVERY_ADDRESS, describeAddress, ipv6Available, isEveryAddress, listen, listenHost, urlHost } from "./listen.mjs";

const hasIpv6 = await ipv6Available();
/** What `listenHost` gives when nothing names an address, on this machine. */
const everyAddressHere = hasIpv6 ? EVERY_ADDRESS : "0.0.0.0";

test("without BIND_HOST the server binds every address", async () => {
  assert.equal(await listenHost({}), everyAddressHere);
  assert.equal(await listenHost({ BIND_HOST: "  " }), everyAddressHere);
});

test("HOSTNAME is not read, whatever it holds", async () => {
  // What a container runtime sets: the container's own name, on Kubernetes the pod's.
  assert.equal(await listenHost({ HOSTNAME: "citadel-7c9d8b6f5-x2x4q" }), everyAddressHere);
  // What Next.js's own standalone server would take as its address.
  assert.equal(await listenHost({ HOSTNAME: "0.0.0.0" }), everyAddressHere);
  assert.equal(await listenHost({ HOSTNAME: "127.0.0.1" }), everyAddressHere);
});

test("a BIND_HOST is bound as given", async () => {
  assert.equal(await listenHost({ BIND_HOST: "127.0.0.1", HOSTNAME: "citadel-7c9d8b6f5-x2x4q" }), "127.0.0.1");
  assert.equal(await listenHost({ BIND_HOST: " 0.0.0.0 " }), "0.0.0.0");
  assert.equal(await listenHost({ BIND_HOST: "::" }), "::");
  assert.equal(await listenHost({ BIND_HOST: "::1" }), "::1");
  assert.equal(await listenHost({ BIND_HOST: "[::1]" }), "::1", "an IPv6 address may come in brackets");
});

test("the start-up line says what was bound", () => {
  assert.equal(describeAddress({ address: "::", family: "IPv6", port: 3000 }), "[::]:3000 (IPv4 and IPv6)");
  assert.equal(describeAddress({ address: "0.0.0.0", family: "IPv4", port: 3000 }), "0.0.0.0:3000 (IPv4 only)");
  assert.equal(describeAddress({ address: "127.0.0.1", family: "IPv4", port: 3000 }), "127.0.0.1:3000");
  assert.equal(describeAddress({ address: "::1", family: "IPv6", port: 3000 }), "[::1]:3000");
  assert.ok(isEveryAddress("::") && isEveryAddress("0.0.0.0") && !isEveryAddress("127.0.0.1"));
});

test("an IPv6 address stands in brackets in a URL", () => {
  assert.equal(urlHost("::1"), "[::1]");
  assert.equal(urlHost("2001:db8::7"), "[2001:db8::7]");
  assert.equal(urlHost("127.0.0.1"), "127.0.0.1");
  assert.equal(urlHost("site.internal"), "site.internal");
});

/** `GET /` at `host`, resolving with the status code. */
function get(host, port) {
  return new Promise((resolve, reject) => {
    http
      .get({ host, port, path: "/", agent: false, timeout: 10_000 }, (response) => {
        response.resume();
        resolve(response.statusCode);
      })
      .on("error", reject);
  });
}

async function serving(run, env = {}) {
  const server = http.createServer((_request, response) => response.end("ok"));
  const address = await listen(server, { host: await listenHost(env), port: 0 });
  try {
    await run(address);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("the server accepts a connection over 127.0.0.1", async () => {
  await serving(async ({ port }) => assert.equal(await get("127.0.0.1", port), 200));
});

test("with BIND_HOST the server is bound to that address and no other", async () => {
  await serving(
    async ({ address, family, port }) => {
      assert.deepEqual({ address, family }, { address: "127.0.0.1", family: "IPv4" });
      assert.equal(await get("127.0.0.1", port), 200);
      if (hasIpv6) {
        await assert.rejects(get("::1", port), { code: "ECONNREFUSED" });
      }
    },
    { BIND_HOST: "127.0.0.1" },
  );
});

test("the server accepts a connection over ::1", async (t) => {
  if (!hasIpv6) {
    assert.ok(!process.env.REQUIRE_IPV6, 'REQUIRE_IPV6 is set, but this machine has no IPv6: "::" cannot be bound');
    t.skip('this machine has no IPv6 ("::" cannot be bound); the server listens on 0.0.0.0 here');
    return;
  }
  await serving(async ({ address, port }) => {
    assert.equal(address, EVERY_ADDRESS);
    assert.equal(await get("::1", port), 200);
  });
});
