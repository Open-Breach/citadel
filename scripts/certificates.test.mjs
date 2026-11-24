// `npm test`: which certificate is presented for a host name, and what the
// start logs about a certificate.
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import { makeCertificate, writePair } from "../tests/support/certificates.mjs";
import {
  chooseCertificate,
  describeCertificate,
  dnsNames,
  expiryDate,
  loadCertificates,
  pairsOnDisk,
  wildcardsWithoutBareDomain,
} from "./certificates.mjs";

// Production's shape: the default first, each with its bare domain and its wildcard.
const dev = { name: "dev", names: ["openbreach.dev", "*.openbreach.dev"] };
const com = { name: "com", names: ["open-breach.com", "*.open-breach.com"] };
const org = { name: "org", names: ["open-breach.org", "*.open-breach.org"] };
const all = [dev, com, org];

const dir = mkdtempSync(join(tmpdir(), "citadel-choice-"));
after(() => rmSync(dir, { recursive: true, force: true }));

test("the DNS names are read off the leaf certificate", () => {
  const made = makeCertificate({ names: ["Example.test", "*.example.test"] });
  assert.deepEqual(dnsNames(made.certPem), ["example.test", "*.example.test"]);
  assert.deepEqual(dnsNames(made.chain.join("")), ["example.test", "*.example.test"]);
  assert.equal(expiryDate(made.certPem).slice(0, 19), made.expires.toISOString().slice(0, 19));
});

test("a subdomain under a wildcard gets that certificate", () => {
  assert.equal(chooseCertificate(all, "www.openbreach.dev"), dev);
  assert.equal(chooseCertificate(all, "web-stg.openbreach.dev"), dev);
  assert.equal(chooseCertificate(all, "www.open-breach.org"), org);
});

test("another domain gets its own certificate, not the first one", () => {
  assert.equal(chooseCertificate(all, "open-breach.com"), com);
  assert.equal(chooseCertificate(all, "open-breach.org"), org);
});

test("a wildcard alone does not count as a match for the bare domain", () => {
  const wildcardOnly = { name: "wildcard-only", names: ["*.openbreach.net"] };
  const certificates = [dev, wildcardOnly];
  // Not matched: the default is presented, which here is another certificate.
  assert.equal(chooseCertificate(certificates, "openbreach.net"), dev);
  assert.equal(chooseCertificate(certificates, "www.openbreach.net"), wildcardOnly);
  assert.deepEqual(wildcardsWithoutBareDomain(wildcardOnly.names), ["*.openbreach.net"]);
  assert.deepEqual(wildcardsWithoutBareDomain(dev.names), []);
});

test("a wildcard covers exactly one further label", () => {
  const certificates = [com, dev];
  assert.equal(chooseCertificate(certificates, "a.b.openbreach.dev"), com, "two labels: the default");
  assert.equal(chooseCertificate(certificates, "b.openbreach.dev"), dev);
});

test("an exact name wins over a wildcard, whatever the order", () => {
  const wildcard = { name: "wildcard", names: ["*.openbreach.dev"] };
  const exact = { name: "exact", names: ["www.openbreach.dev"] };
  assert.equal(chooseCertificate([wildcard, exact], "www.openbreach.dev"), exact);
  assert.equal(chooseCertificate([wildcard, exact], "local.openbreach.dev"), wildcard);
});

test("an unknown name gets the first certificate", () => {
  assert.equal(chooseCertificate(all, "example.com"), dev);
  assert.equal(chooseCertificate(all, "localhost"), dev);
  assert.equal(chooseCertificate([com, dev], "example.com"), com);
});

test("a client that names no host gets the first certificate", () => {
  assert.equal(chooseCertificate(all, undefined), dev);
  assert.equal(chooseCertificate(all, ""), dev);
  assert.equal(chooseCertificate(all, false), dev);
});

test("the name is compared without regard to case or a closing dot", () => {
  assert.equal(chooseCertificate(all, "WWW.Open-Breach.COM"), com);
  assert.equal(chooseCertificate(all, "open-breach.org."), org);
});

test("the start logs each certificate with its version, expiry date and names, and no key material", () => {
  const first = makeCertificate({ names: ["first.test", "*.first.test"] });
  const second = makeCertificate({ names: ["*.second.test"] });
  writePair(join(dir, "cert-one"), first);
  writePair(join(dir, "cert-two"), second);

  const lines = [];
  const loaded = loadCertificates(
    [
      { name: "cert-one", version: "v1", key: join(dir, "cert-one", "key.pem"), cert: join(dir, "cert-one", "cert.pem") },
      { name: "cert-two", key: join(dir, "cert-two", "key.pem"), cert: join(dir, "cert-two", "cert.pem") },
    ],
    (line) => lines.push(line),
  );

  const date = String.raw`\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z`;
  assert.match(
    lines[0],
    new RegExp(String.raw`^serve: certificate cert-one \(version v1, expires ${date}\), the default: first\.test, \*\.first\.test$`),
  );
  assert.match(
    lines[1],
    new RegExp(String.raw`^serve: certificate cert-two \(read from disk, expires ${date}\): \*\.second\.test$`),
  );
  assert.ok(lines[0].includes(first.expires.toISOString().slice(0, 19)));
  assert.match(lines[2], /^serve: warning: certificate cert-two holds \*\.second\.test without second\.test/);
  assert.equal(lines.length, 3);

  const log = lines.join("\n");
  assert.doesNotMatch(log, /PRIVATE KEY/);
  for (const made of [first, second]) {
    const body = made.key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
    for (const part of [body.slice(0, 40), body.slice(300, 340), body.slice(-40)]) {
      assert.ok(!log.includes(part), "the log holds a part of a private key");
    }
  }

  assert.deepEqual(loaded.map(({ names }) => names), [["first.test", "*.first.test"], ["*.second.test"]]);
  assert.equal(chooseCertificate(loaded, "www.second.test"), loaded[1]);
  assert.ok(loaded[0].context, "a TLS context is ready for each");
});

test("a line for a certificate without a DNS name says so", () => {
  assert.equal(
    describeCertificate({ name: "odd", version: "v9", expires: "2027-01-01T00:00:00.000Z", names: [] }, false),
    "serve: certificate odd (version v9, expires 2027-01-01T00:00:00.000Z): no DNS name",
  );
});

test("with no vault named, the pair in the certificate folder is the one to serve with", () => {
  const single = join(dir, "single");
  writePair(single, makeCertificate({ names: ["single.test"] }));
  assert.deepEqual(pairsOnDisk({ dir: single }), [
    { name: "single", key: join(single, "key.pem"), cert: join(single, "cert.pem") },
  ]);
});

test("with no vault named and names given, each pair is read from its own folder, in that order", () => {
  const pairs = pairsOnDisk({ dir, names: ["cert-two", "cert-one"] });
  assert.deepEqual(pairs.map(({ name }) => name), ["cert-two", "cert-one"]);
  assert.equal(pairs[0].key, join(dir, "cert-two", "key.pem"));
});

test("with no vault named and no pair, the error says that a certificate is missing", () => {
  const empty = join(dir, "empty");
  assert.throws(() => pairsOnDisk({ dir: empty }), /a certificate is missing: no vault is named .*empty holds no key\.pem and cert\.pem/);
  assert.throws(() => pairsOnDisk({ dir, names: ["cert-one", "cert-nine"] }), /a certificate is missing: .*cert-nine holds no key\.pem/);
});
