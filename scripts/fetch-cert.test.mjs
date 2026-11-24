// `npm test`: the download of the certificates, without a network. The vault
// is an object of the test, and the certificates are made here.
import assert from "node:assert/strict";
import { X509Certificate, createPrivateKey } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import { makeAuthority, makeCertificate, toPkcs12 } from "../tests/support/certificates.mjs";
import { certificateNames, fetchCertificates, fromPkcs12, settingsFromEnv, splitPem } from "./fetch-cert.mjs";

const authority = makeAuthority();
const first = makeCertificate({ names: ["first.test", "*.first.test"], authority });
const second = makeCertificate({ names: ["second.test", "*.second.test"], authority });
const third = makeCertificate({ names: ["third.test"], authority });

const folders = [];
function folder() {
  const created = mkdtempSync(join(tmpdir(), "citadel-certs-"));
  folders.push(created);
  return created;
}
after(() => folders.forEach((created) => rmSync(created, { recursive: true, force: true })));

/** A vault that is an object: what it stores under each name, PEM or PKCS#12. */
function vaultWith(stored) {
  const asked = [];
  return {
    asked,
    async getCertificate(name) {
      asked.push(`certificate ${name}`);
      const entry = stored[name];
      if (!entry) throw notFound(name);
      return {
        policy: { contentType: entry.contentType },
        properties: { version: entry.version, expiresOn: entry.certificate.expires },
      };
    },
    async getSecret(name) {
      asked.push(`secret ${name}`);
      const entry = stored[name];
      if (!entry) throw notFound(name);
      return { value: entry.value, properties: { contentType: entry.contentType } };
    },
  };
}

function notFound(name) {
  const error = new Error(`A certificate with (name/id) ${name} was not found in this key vault.`);
  error.name = "RestError";
  error.statusCode = 404;
  return error;
}

const asPem = (certificate, version) => ({
  certificate,
  version,
  contentType: "application/x-pem-file",
  value: certificate.key + certificate.chain.join(""),
});
const asPkcs12 = (certificate, version) => ({
  certificate,
  version,
  contentType: "application/x-pkcs12",
  value: toPkcs12(certificate, [authority.cert, certificate.cert]),
});

/** The parts of a private key that must never reach a log. */
function keyMaterial(certificate) {
  const body = certificate.key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
  return [body.slice(0, 40), body.slice(200, 240), body.slice(-40)];
}

function assertNoKeyMaterial(text, certificates) {
  assert.doesNotMatch(text, /PRIVATE KEY/);
  for (const certificate of certificates) {
    for (const part of keyMaterial(certificate)) {
      assert.ok(!text.includes(part), "the log holds a part of a private key");
    }
  }
}

const commonNames = (chain) => chain.map((pem) => new X509Certificate(pem).subject);

test("a PEM secret is split into its key and its chain, the leaf first as stored", () => {
  const { key, chain } = splitPem(first.key + first.chain.join(""));
  assert.equal(key, first.key);
  assert.deepEqual(chain, first.chain);
  assert.deepEqual(commonNames(chain), ["CN=first.test", "CN=Test authority"]);
});

test("a PEM secret is read whatever the type of its key and wherever the key stands", () => {
  const ecKey = "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEE\n-----END EC PRIVATE KEY-----";
  const { key, chain } = splitPem(`${first.chain.join("")}${ecKey}`);
  assert.equal(key, `${ecKey}\n`, "the block ends with a newline");
  assert.equal(chain.length, 2);
});

test("a PEM secret with Windows line ends keeps its blocks whole", () => {
  const { key, chain } = splitPem((first.key + first.chain.join("")).replace(/\n/g, "\r\n"));
  assert.ok(key.endsWith("-----END RSA PRIVATE KEY-----\r\n"));
  assert.equal(chain.length, 2);
  assert.equal(new X509Certificate(chain[0]).subject, "CN=first.test");
});

test("a PEM secret without a key or without a certificate is refused", () => {
  assert.throws(() => splitPem(first.chain.join("")), /no private key or no certificate/);
  assert.throws(() => splitPem(first.key), /no private key or no certificate/);
});

test("a PKCS#12 secret is converted, with the leaf first", () => {
  // The authority's certificate stands first inside, as Key Vault may store it.
  const { key, chain } = fromPkcs12(toPkcs12(first, [authority.cert, first.cert]));
  assert.deepEqual(commonNames(chain), ["CN=first.test", "CN=Test authority"]);
  assert.equal(new X509Certificate(chain[0]).checkPrivateKey(createPrivateKey(key)), true);
});

test("a PKCS#12 secret opens with both forms of no password", () => {
  for (const password of [null, ""]) {
    const { chain } = fromPkcs12(toPkcs12(first, [first.cert, authority.cert], password));
    assert.deepEqual(commonNames(chain), ["CN=first.test", "CN=Test authority"]);
  }
});

test("every certificate of the list is downloaded, each into a folder of its own", async () => {
  const dir = folder();
  const vault = vaultWith({
    "cert-one": asPem(first, "v1"),
    "cert-two": asPkcs12(second, "v2"),
    "cert-three": asPem(third, "v3"),
  });
  const lines = [];
  const written = await fetchCertificates({
    names: ["cert-one", "cert-two", "cert-three"],
    dir,
    vault,
    log: (line) => lines.push(line),
  });

  assert.deepEqual(readdirSync(dir).sort(), ["cert-one", "cert-three", "cert-two"]);
  assert.deepEqual(
    written.map(({ name, version }) => ({ name, version })),
    [
      { name: "cert-one", version: "v1" },
      { name: "cert-two", version: "v2" },
      { name: "cert-three", version: "v3" },
    ],
    "in the order of the list, the default first",
  );
  for (const [index, certificate] of [first, second, third].entries()) {
    const pair = written[index];
    assert.equal(pair.key, join(dir, pair.name, "key.pem"));
    assert.equal(pair.cert, join(dir, pair.name, "cert.pem"));
    const leaf = new X509Certificate(readFileSync(pair.cert));
    assert.equal(leaf.subject, `CN=${certificate.names[0]}`, "the leaf stands first in cert.pem");
    assert.equal(leaf.checkPrivateKey(createPrivateKey(readFileSync(pair.key))), true);
    assert.equal(pair.expires, certificate.expires.toISOString());
  }
});

test("the log names each certificate, its version and its expiry date, and holds no key material", async () => {
  const dir = folder();
  const lines = [];
  await fetchCertificates({
    names: ["cert-one", "cert-two"],
    dir,
    vault: vaultWith({ "cert-one": asPem(first, "v1"), "cert-two": asPkcs12(second, "v2") }),
    log: (line) => lines.push(line),
  });
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^fetch-cert: cert-one \(version v1, expires \d{4}-\d{2}-\d{2}T[\d:.]+Z\) -> /);
  assert.match(lines[1], /^fetch-cert: cert-two \(version v2, expires /);
  assert.ok(lines[0].includes(first.expires.toISOString()));
  assertNoKeyMaterial(lines.join("\n"), [first, second]);
});

test("one name that is not in the vault stops the download, and the error names it", async () => {
  const dir = folder();
  const vault = vaultWith({ "cert-one": asPem(first, "v1"), "cert-three": asPem(third, "v3") });
  const lines = [];
  await assert.rejects(
    fetchCertificates({
      names: ["cert-one", "cert-two", "cert-three"],
      dir,
      vault,
      log: (line) => lines.push(line),
    }),
    (error) => {
      assert.match(error.message, /^certificate cert-two: /);
      assert.match(error.message, /was not found/);
      assertNoKeyMaterial(error.message, [first, third]);
      return true;
    },
  );
  assert.deepEqual(readdirSync(dir), [], "nothing is written when one certificate is missing");
  assert.deepEqual(lines, []);
});

test("a secret that cannot be read stops the download, and the error names the certificate", async () => {
  const broken = { ...asPem(first, "v1"), value: first.chain.join("") };
  await assert.rejects(
    fetchCertificates({ names: ["cert-one"], dir: folder(), vault: vaultWith({ "cert-one": broken }), log() {} }),
    /^Error: certificate cert-one: the PEM secret holds no private key or no certificate$/,
  );
  await assert.rejects(
    fetchCertificates({
      names: ["cert-one"],
      dir: folder(),
      vault: vaultWith({ "cert-one": { ...asPem(first, "v1"), value: "" } }),
      log() {},
    }),
    /certificate cert-one: its secret has no value/,
  );
});

test("without an Azure login the error says how to log in", async () => {
  const vault = {
    async getCertificate() {
      const error = new Error("ChainedTokenCredential authentication failed.\nCredentialUnavailableError: ...");
      error.name = "AggregateAuthenticationError";
      throw error;
    },
  };
  await assert.rejects(
    fetchCertificates({ names: ["cert-one"], dir: folder(), vault, log() {} }),
    /certificate cert-one: no Azure login was found\. Log in with `az login`/,
  );
});

test("the key and its folder are for their owner only", { skip: process.platform === "win32" }, async () => {
  const dir = folder();
  // A pair from an earlier start that was left open to everybody.
  mkdirSync(join(dir, "cert-one"), { mode: 0o755 });
  writeFileSync(join(dir, "cert-one", "key.pem"), "old", { mode: 0o644 });
  const previous = process.umask(0);
  try {
    await fetchCertificates({
      names: ["cert-one", "cert-two"],
      dir,
      vault: vaultWith({ "cert-one": asPem(first, "v1"), "cert-two": asPkcs12(second, "v2") }),
      log() {},
    });
  } finally {
    process.umask(previous);
  }
  for (const name of ["cert-one", "cert-two"]) {
    assert.equal(statSync(join(dir, name)).mode & 0o777, 0o700, `${name}: the folder`);
    assert.equal(statSync(join(dir, name, "key.pem")).mode & 0o777, 0o600, `${name}: the key`);
    assert.equal(statSync(join(dir, name, "cert.pem")).mode & 0o777, 0o600, `${name}: the certificate`);
  }
});

test("KEYVAULT_CERTIFICATES is a list separated by commas, the default first", () => {
  assert.deepEqual(certificateNames("cert-one"), ["cert-one"]);
  assert.deepEqual(certificateNames(" cert-one , cert-two,,cert-three "), ["cert-one", "cert-two", "cert-three"]);
  assert.deepEqual(certificateNames(undefined), []);
  assert.throws(() => certificateNames("cert-one,../elsewhere"), /is not the name of a certificate/);
  assert.throws(() => certificateNames("cert-one,cert-two,cert-one"), /names cert-one twice/);
});

test("missing settings are named, with the place they are set in", () => {
  assert.throws(() => settingsFromEnv({}), /^Error: KEYVAULT_URL and KEYVAULT_CERTIFICATES are not set\. .*\.env\.local/);
  assert.throws(
    () => settingsFromEnv({ KEYVAULT_URL: "https://vault.test/" }),
    /^Error: KEYVAULT_CERTIFICATES is not set\. .*\.env\.local/,
  );
  assert.throws(() => settingsFromEnv({ KEYVAULT_CERTIFICATES: "cert-one" }), /^Error: KEYVAULT_URL is not set\./);
  assert.deepEqual(
    settingsFromEnv({ KEYVAULT_URL: " https://vault.test/ ", KEYVAULT_CERTIFICATES: "cert-one,cert-two" }),
    { vaultUrl: "https://vault.test/", names: ["cert-one", "cert-two"], dir: ".certs" },
  );
  assert.equal(settingsFromEnv({ KEYVAULT_URL: "u", KEYVAULT_CERTIFICATES: "c", CERT_DIR: "/run/certs" }).dir, "/run/certs");
});
