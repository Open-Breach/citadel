// Which certificate the site presents for a host name (scripts/serve.mjs).
//
// The names a certificate covers are read off the certificate itself, not
// off a list in the configuration, so they cannot drift from what the
// certificate really holds.
import { X509Certificate } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import tls from "node:tls";

/** The DNS names of the first certificate in `pem`, the leaf, in lower case. */
export function dnsNames(pem) {
  const alternatives = new X509Certificate(pem).subjectAltName ?? "";
  return alternatives
    .split(", ")
    .filter((entry) => entry.startsWith("DNS:"))
    .map((entry) => entry.slice("DNS:".length).toLowerCase());
}

/** The date the first certificate in `pem` is valid to, as an ISO date. */
export function expiryDate(pem) {
  return new Date(new X509Certificate(pem).validTo).toISOString();
}

/**
 * The certificate for the host name a client asks for:
 *
 * 1. one that holds the name exactly,
 * 2. otherwise one that holds a wildcard covering exactly one further label,
 * 3. otherwise the first, the default. That is also what a client gets that
 *    names no host.
 *
 * `certificates` is a list of objects with `names`; the one chosen is returned.
 */
export function chooseCertificate(certificates, hostName) {
  const asked = typeof hostName === "string" ? hostName.toLowerCase().replace(/\.$/, "") : "";
  if (asked) {
    const exact = certificates.find(({ names }) => names.includes(asked));
    if (exact) return exact;
    // "*.example.org" covers "www.example.org": the name with its first
    // label replaced. It covers neither "example.org" nor "a.b.example.org".
    const dot = asked.indexOf(".");
    if (dot > 0) {
      const wildcard = `*${asked.slice(dot)}`;
      const covering = certificates.find(({ names }) => names.includes(wildcard));
      if (covering) return covering;
    }
  }
  return certificates[0];
}

/**
 * The wildcards of a certificate whose bare domain is missing from it:
 * "*.example.org" without "example.org". A browser that asks for the bare
 * domain gets no match from such a certificate.
 */
export function wildcardsWithoutBareDomain(names) {
  return names.filter((name) => name.startsWith("*.") && !names.includes(name.slice(2)));
}

/** The line the start logs for a certificate. It holds nothing of the key. */
export function describeCertificate({ name, version, expires, names }, isDefault) {
  const origin = version ? `version ${version}` : "read from disk";
  const role = isDefault ? ", the default" : "";
  return `serve: certificate ${name} (${origin}, expires ${expires})${role}: ${names.join(", ") || "no DNS name"}`;
}

/**
 * Reads the pairs and makes each ready to serve with: its key and chain, the
 * names on its leaf and a TLS context. `pairs` is what the download returns:
 * objects with `name`, the paths `key` and `cert`, and the vault's `version`.
 * Each certificate is logged, the default first.
 */
export function loadCertificates(pairs, log = console.log) {
  return pairs.map((pair, index) => {
    const key = readFileSync(pair.key);
    const cert = readFileSync(pair.cert);
    const names = dnsNames(cert);
    const loaded = {
      name: pair.name,
      version: pair.version,
      expires: expiryDate(cert),
      names,
      key,
      cert,
      context: tls.createSecureContext({ key, cert }),
    };
    log(describeCertificate(loaded, index === 0));
    for (const wildcard of wildcardsWithoutBareDomain(names)) {
      log(
        `serve: warning: certificate ${pair.name} holds ${wildcard} without ${wildcard.slice(2)}, ` +
          `so https://${wildcard.slice(2)} is not covered by it`,
      );
    }
    return loaded;
  });
}

/** The callback Node's TLS server asks for the context of a host name. */
export function sniCallback(certificates) {
  return (hostName, done) => done(null, chooseCertificate(certificates, hostName).context);
}

/**
 * The pairs already on disk, for a start with no vault named: a local run of
 * the image, or a cluster where something else provides the certificate.
 *
 * With names given, each is read from `dir/<name>/`, where a download would
 * have put it, the first being the default. Without names it is the one pair
 * in `dir` itself, called by the folder's name.
 */
export function pairsOnDisk({ dir, names = [] }) {
  const folder = path.resolve(dir);
  const pairAt = (name, at) => ({ name, key: path.join(at, "key.pem"), cert: path.join(at, "cert.pem") });
  const pairs = names.length > 0 ? names.map((name) => pairAt(name, path.join(folder, name))) : [pairAt(path.basename(folder), folder)];
  for (const pair of pairs) {
    if (!existsSync(pair.key) || !existsSync(pair.cert)) {
      throw new Error(
        `a certificate is missing: no vault is named (KEYVAULT_URL is not set) and ${path.dirname(pair.key)} holds no key.pem and cert.pem`,
      );
    }
  }
  return pairs;
}
