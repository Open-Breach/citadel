// Certificates for the tests, made on the spot and signed by nobody a browser
// trusts. No test uses a certificate from a vault, and none of these is kept.
//
// Run by itself, it writes pairs where the production start reads them when
// no vault is named:
//
//   node tests/support/certificates.mjs <folder> <dns name>[,<dns name>...]
//   node tests/support/certificates.mjs <folder> <name>=<dns name>[,...] <name>=...
//
// The first form writes <folder>/key.pem and cert.pem, the second one pair
// per name into <folder>/<name>/.
import { generateKeyPairSync } from "node:crypto";
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import forge from "node-forge";

const { pki } = forge;
let serial = 1;

function rsaKeys() {
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const key = pki.privateKeyFromPem(privateKey.export({ type: "pkcs8", format: "pem" }));
  return { privateKey: key, publicKey: pki.setRsaPublicKey(key.n, key.e) };
}

function certificate({ commonName, publicKey, issuer, signingKey, extensions, days = 30 }) {
  const cert = pki.createCertificate();
  cert.publicKey = publicKey;
  cert.serialNumber = String(serial++).padStart(2, "0");
  cert.validity.notBefore = new Date(Date.now() - 60_000);
  cert.validity.notAfter = new Date(Date.now() + days * 86_400_000);
  const subject = [{ name: "commonName", value: commonName }];
  cert.setSubject(subject);
  cert.setIssuer(issuer ?? subject);
  cert.setExtensions(extensions);
  cert.sign(signingKey, forge.md.sha256.create());
  return cert;
}

/** node-forge ends its lines with CR LF. The tests compare with plain newlines. */
function pem(text) {
  return text.replace(/\r\n/g, "\n");
}

/** A certificate authority to sign test certificates with. */
export function makeAuthority(commonName = "Test authority") {
  const keys = rsaKeys();
  const cert = certificate({
    commonName,
    publicKey: keys.publicKey,
    signingKey: keys.privateKey,
    extensions: [
      { name: "basicConstraints", cA: true, critical: true },
      { name: "keyUsage", keyCertSign: true, cRLSign: true, critical: true },
    ],
  });
  return { keys, cert, certPem: pem(pki.certificateToPem(cert)) };
}

/**
 * A certificate for `names` with its private key, as PEM. Signed by
 * `authority` when one is given, by itself otherwise. `chain` is what a
 * server presents: the leaf first, then the authority's certificate.
 */
export function makeCertificate({ names, authority, days }) {
  const keys = rsaKeys();
  const cert = certificate({
    commonName: names[0],
    publicKey: keys.publicKey,
    issuer: authority?.cert.subject.attributes,
    signingKey: authority?.keys.privateKey ?? keys.privateKey,
    days,
    extensions: [
      { name: "basicConstraints", cA: false },
      { name: "keyUsage", digitalSignature: true, keyEncipherment: true },
      { name: "extKeyUsage", serverAuth: true },
      { name: "subjectAltName", altNames: names.map((value) => ({ type: 2, value })) },
    ],
  });
  const certPem = pem(pki.certificateToPem(cert));
  return {
    names,
    keys,
    cert,
    key: pem(pki.privateKeyToPem(keys.privateKey)),
    certPem,
    chain: authority ? [certPem, authority.certPem] : [certPem],
    expires: cert.validity.notAfter,
  };
}

/**
 * The certificate as Key Vault stores a PKCS#12 secret: base64, with no
 * password. `certs` gives the order of the certificates inside, so that a
 * test can put the leaf last. `password` is null as Key Vault does it, or ""
 * for the other form of "no password".
 */
export function toPkcs12({ keys }, certs, password = null) {
  const asn1 = forge.pkcs12.toPkcs12Asn1(keys.privateKey, certs, password, { algorithm: "3des" });
  return forge.util.encode64(forge.asn1.toDer(asn1).getBytes());
}

/** Writes a pair the way the download does: key.pem and cert.pem, for their owner only. */
export function writePair(folder, { key, chain }) {
  mkdirSync(folder, { recursive: true, mode: 0o700 });
  writeFileSync(join(folder, "key.pem"), key, { mode: 0o600 });
  writeFileSync(join(folder, "cert.pem"), chain.join(""), { mode: 0o600 });
  chmodSync(join(folder, "key.pem"), 0o600);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [folder, ...pairs] = process.argv.slice(2);
  if (!folder || pairs.length === 0) {
    console.error("usage: node tests/support/certificates.mjs <folder> [<name>=]<dns name>[,<dns name>...] ...");
    process.exit(1);
  }
  for (const pair of pairs) {
    const [name, list] = pair.includes("=") ? pair.split("=") : [null, pair];
    const names = list.split(",");
    const target = name ? join(folder, name) : folder;
    writePair(target, makeCertificate({ names }));
    console.log(`test certificate for ${names.join(", ")} -> ${target}`);
  }
}
