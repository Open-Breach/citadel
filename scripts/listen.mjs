// Where the listeners of the production start bind (scripts/serve.mjs). This
// is the one place that decides the address.
//
// Unless BIND_HOST names an address, a listener binds "::" as one socket that
// takes IPv4 and IPv6. That is asked for (`ipv6Only: false`), not left to the
// system's default for a socket on "::". On a machine without IPv6 it binds
// every IPv4 address instead.
import net from "node:net";

/** Every address of the machine, IPv4 and IPv6. */
export const EVERY_ADDRESS = "::";
/** What is left of it on a machine without IPv6. */
const EVERY_IPV4_ADDRESS = "0.0.0.0";

/** Whether `host` is no address of its own but stands for all of them. */
export function isEveryAddress(host) {
  return host === EVERY_ADDRESS || host === EVERY_IPV4_ADDRESS;
}

/**
 * The address to bind: BIND_HOST when it is set, else every address. An IPv6
 * address may be given in brackets.
 *
 * HOSTNAME is not read, although Next.js's own standalone server takes its
 * address from it. A container runtime sets HOSTNAME to the container's own
 * name (on Kubernetes the pod's), which bound is one address of one family.
 * BIND_HOST is the site's own setting: nothing sets it by itself, and neither
 * the image nor the deployment has to.
 */
export async function listenHost(env = process.env) {
  const given = env.BIND_HOST?.trim().replace(/^\[(.*)\]$/, "$1");
  if (given) {
    return given;
  }
  if (await ipv6Available()) {
    return EVERY_ADDRESS;
  }
  console.warn(`serve: this machine has no IPv6, listening on ${EVERY_IPV4_ADDRESS} (IPv4 only)`);
  return EVERY_IPV4_ADDRESS;
}

/** Whether this machine has IPv6 at all: "::" can be bound. */
export function ipv6Available() {
  return new Promise((resolve) => {
    const probe = net.createServer();
    probe.once("error", () => resolve(false));
    probe.listen({ host: EVERY_ADDRESS, port: 0, ipv6Only: true }, () => probe.close(() => resolve(true)));
  });
}

/**
 * `server.listen` on `host` and `port`. Resolves with the address the socket
 * reports once it listens, and rejects when it cannot be bound.
 */
export function listen(server, { host, port }) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    // ipv6Only: false makes a socket on "::" take IPv4 too, on every system.
    server.listen({ host, port, ipv6Only: false }, () => {
      server.off("error", reject);
      resolve(server.address());
    });
  });
}

/** `host` as it stands in a URL: an IPv6 address in brackets. */
export function urlHost(host) {
  return net.isIPv6(host) ? `[${host}]` : host;
}

/** `[::]:3000 (IPv4 and IPv6)`: what `server.address()` gave, for the start-up line. */
export function describeAddress({ address, family, port }) {
  const bound = family === "IPv6" ? `[${address}]:${port}` : `${address}:${port}`;
  if (address === EVERY_ADDRESS) {
    return `${bound} (IPv4 and IPv6)`;
  }
  return address === EVERY_IPV4_ADDRESS ? `${bound} (IPv4 only)` : bound;
}
