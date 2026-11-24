// The plain HTTP listener of the production start (scripts/serve.mjs). It
// answers every request with a permanent redirect to HTTPS and serves nothing
// else. Next.js is mounted on the HTTPS server and never sees these requests.

/** One label of a host name: letters, digits and hyphens, no hyphen at either end. */
const LABEL = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

/** The Host header without its port, in lower case, or null when it is no valid host name. */
export function hostName(header) {
  if (typeof header !== "string") return null;
  const host = header.trim().toLowerCase().replace(/:\d{1,5}$/, "").replace(/\.$/, "");
  if (host.length === 0 || host.length > 253) return null;
  return host.split(".").every((label) => LABEL.test(label)) ? host : null;
}

/** The path and query of a request line, always starting with a slash. */
function pathAndQuery(url) {
  let target = typeof url === "string" ? url : "/";
  // A client may send the whole address in the request line.
  const absolute = /^https?:\/\/[^/?#]*/i.exec(target);
  if (absolute) target = target.slice(absolute[0].length);
  if (!target.startsWith("/")) target = `/${target.startsWith("?") ? target : ""}`;
  // Whatever a header cannot hold is escaped; a path arrives escaped already.
  return target.replace(/[^\x21-\x7e]/g, (character) => encodeURIComponent(character));
}

/**
 * The answer to a plain HTTP request, as a pure function of the request: the
 * same for every method. A redirect to the same host name, path and query
 * over HTTPS, with the port a visitor uses unless that is 443. A request
 * without a usable Host header gets 400 and no redirect.
 */
export function redirectFor({ host, url, httpsPort = 443 }) {
  const name = hostName(host);
  if (!name) {
    return { status: 400 };
  }
  const port = Number(httpsPort) === 443 ? "" : `:${httpsPort}`;
  return { status: 308, location: `https://${name}${port}${pathAndQuery(url)}` };
}

/** The request handler of the HTTP listener. */
export function redirectHandler({ httpsPort = 443 } = {}) {
  return (request, response) => {
    const { status, location } = redirectFor({ host: request.headers.host, url: request.url, httpsPort });
    if (status === 308) {
      response.writeHead(308, { Location: location, "Content-Type": "text/plain; charset=utf-8" });
      response.end(`This site is served over HTTPS: ${location}\n`);
      return;
    }
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request: the request names no valid host.\n");
  };
}
