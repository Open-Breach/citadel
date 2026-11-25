// Downloads the site's TLS certificates from Azure Key Vault, each as a PEM
// key and certificate pair in a folder of its own under CERT_DIR. On a
// developer machine the identity is the Azure CLI login, in a pod its
// workload identity: DefaultAzureCredential tries both.
//
//   KEYVAULT_URL           the vault
//   KEYVAULT_CERTIFICATES  the names of the certificates in it, separated by
//                          commas; the first is the default
//   CERT_DIR               where the pairs are written (default .certs)
//
// A new version of a certificate is picked up at the next start. Nothing
// watches the vault.
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import forge from "node-forge";

const PEM_CONTENT_TYPE = "application/x-pem-file";

/** The name of a certificate in Key Vault. It becomes the name of a folder. */
const CERTIFICATE_NAME = /^[0-9A-Za-z-]{1,127}$/;

/** The errors of the Azure identity library that mean: nobody is logged in. */
const NO_LOGIN = new Set([
  "CredentialUnavailableError",
  "AggregateAuthenticationError",
  "AuthenticationRequiredError",
]);

/**
 * Downloads every certificate in `names` and writes its pair to
 * `dir/<name>/`. Resolves with one entry per certificate, in the order of
 * `names`. When one of them cannot be read, the error names it and nothing
 * is written.
 *
 * `vault` is what is asked: an object with `getCertificate(name)` and
 * `getSecret(name)`. The tests pass one of their own.
 */
export async function fetchCertificates({ vaultUrl, names, dir, vault, log = console.log }) {
  const from = vault ?? (await azureVault(vaultUrl));
  const downloaded = [];
  for (const name of names) {
    try {
      downloaded.push(await download(from, name));
    } catch (error) {
      throw new Error(`certificate ${name}: ${reason(error)}`, { cause: error });
    }
  }
  return downloaded.map((certificate) => write(certificate, dir, log));
}

/** One certificate from the vault: its key, its chain and what the vault says about it. */
async function download(vault, name) {
  // The certificate's current version and the format its secret is stored in.
  const certificate = await vault.getCertificate(name);
  const contentType = certificate.policy?.contentType ?? PEM_CONTENT_TYPE;

  // The secret of the same name holds the private key and the chain.
  const secret = await vault.getSecret(name);
  if (!secret.value) {
    throw new Error("its secret has no value");
  }
  const format = secret.properties?.contentType ?? contentType;
  const { key, chain } = format === PEM_CONTENT_TYPE ? splitPem(secret.value) : fromPkcs12(secret.value);

  return {
    name,
    version: certificate.properties?.version ?? "?",
    expires: certificate.properties?.expiresOn?.toISOString() ?? "?",
    key,
    chain,
  };
}

/** Writes one pair, the key and its folder for their owner only. */
function write({ name, version, expires, key, chain }, dir, log) {
  const folder = join(dir, name);
  mkdirSync(folder, { recursive: true, mode: 0o700 });
  // The mode given to mkdir and to writeFile counts only when they create
  // something, and the process's umask is taken off it. chmod sets it either way.
  chmodSync(folder, 0o700);
  const keyPath = join(folder, "key.pem");
  const certPath = join(folder, "cert.pem");
  writeFileSync(keyPath, key, { mode: 0o600 });
  chmodSync(keyPath, 0o600);
  writeFileSync(certPath, chain.join(""), { mode: 0o600 });
  chmodSync(certPath, 0o600);

  log(`fetch-cert: ${name} (version ${version}, expires ${expires}) -> ${keyPath}, ${certPath}`);
  return { name, version, expires, key: keyPath, cert: certPath };
}

/** What went wrong, with the way to log in where that is what is missing. */
function reason(error) {
  const message = error?.message ?? String(error);
  if (NO_LOGIN.has(error?.name)) {
    return `no Azure login was found. Log in with \`az login\`, with an account that may read the certificate and its secret. (${firstLine(message)})`;
  }
  return message;
}

function firstLine(text) {
  return text.split("\n", 1)[0];
}

/** The vault at `vaultUrl`, asked with the identity of the place this runs in. */
async function azureVault(vaultUrl) {
  const [{ DefaultAzureCredential }, { CertificateClient }, { SecretClient }] = await Promise.all([
    import("@azure/identity"),
    import("@azure/keyvault-certificates"),
    import("@azure/keyvault-secrets"),
  ]);
  const credential = new DefaultAzureCredential();
  const certificates = new CertificateClient(vaultUrl, credential);
  const secrets = new SecretClient(vaultUrl, credential);
  return {
    getCertificate: (name) => certificates.getCertificate(name),
    getSecret: (name) => secrets.getSecret(name),
  };
}

/** A PEM secret: the private key block and the certificate blocks, leaf first as stored. */
export function splitPem(pem) {
  const blocks = pem.match(/-----BEGIN [^-]+-----[\s\S]*?-----END [^-]+-----\r?\n?/g) ?? [];
  const key = blocks.find((block) => /PRIVATE KEY/.test(block));
  const chain = blocks.filter((block) => /BEGIN CERTIFICATE/.test(block));
  if (!key || chain.length === 0) {
    throw new Error("the PEM secret holds no private key or no certificate");
  }
  return { key: ensureNewline(key), chain: chain.map(ensureNewline) };
}

/** A PKCS#12 secret (base64, no password, as Key Vault stores them): key and chain as PEM. */
export function fromPkcs12(base64) {
  const der = forge.util.decode64(base64);
  // Key Vault stores the PFX without a password: the MAC is keyed with no
  // password at all (null), not with the empty string. OpenSSL tries both
  // forms, node-forge needs the right one.
  const asn1 = forge.asn1.fromDer(der);
  const p12 = openPkcs12(asn1, [null, ""]);

  const keyBags = [
    ...(p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag] ?? []),
    ...(p12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag] ?? []),
  ];
  const privateKey = keyBags.find((bag) => bag.key)?.key;
  if (!privateKey) {
    // node-forge reads RSA keys only.
    throw new Error(
      "the PKCS#12 secret holds no RSA private key. A certificate with a key of another type has to be stored as PEM",
    );
  }

  const certs = (p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag] ?? [])
    .map((bag) => bag.cert)
    .filter(Boolean);
  if (certs.length === 0) {
    throw new Error("the PKCS#12 secret holds no certificate");
  }
  // The leaf is the certificate whose public key matches the private key; the rest is the chain.
  const leafIndex = certs.findIndex((cert) => cert.publicKey.n?.equals(privateKey.n));
  const ordered = leafIndex > 0 ? [certs[leafIndex], ...certs.filter((_, i) => i !== leafIndex)] : certs;

  return {
    key: forge.pki.privateKeyToPem(privateKey),
    chain: ordered.map((cert) => forge.pki.certificateToPem(cert)),
  };
}

function openPkcs12(asn1, passwords) {
  let lastError;
  for (const password of passwords) {
    try {
      return forge.pkcs12.pkcs12FromAsn1(asn1, false, password);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function ensureNewline(block) {
  return block.endsWith("\n") ? block : `${block}\n`;
}

/** The names in KEYVAULT_CERTIFICATES, the default first. */
export function certificateNames(value) {
  const names = (value ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  for (const name of names) {
    if (!CERTIFICATE_NAME.test(name)) {
      throw new Error(`KEYVAULT_CERTIFICATES: "${name}" is not the name of a certificate (letters, digits and hyphens)`);
    }
  }
  const twice = names.find((name, index) => names.indexOf(name) !== index);
  if (twice) {
    throw new Error(`KEYVAULT_CERTIFICATES names ${twice} twice`);
  }
  return names;
}

/** Where the pairs are written, or read from when no vault is named. */
export function certificateFolder(env = process.env) {
  return env.CERT_DIR?.trim() || ".certs";
}

/** The settings of the download. Says which are missing, and where they are set. */
export function settingsFromEnv(env = process.env) {
  const vaultUrl = env.KEYVAULT_URL?.trim();
  const names = certificateNames(env.KEYVAULT_CERTIFICATES);
  const missing = [
    ...(vaultUrl ? [] : ["KEYVAULT_URL"]),
    ...(names.length > 0 ? [] : ["KEYVAULT_CERTIFICATES"]),
  ];
  if (missing.length > 0) {
    throw new Error(
      `${missing.join(" and ")} ${missing.length > 1 ? "are" : "is"} not set. ` +
        "Set the vault's address and the names of the certificates in .env.local on a developer machine " +
        "(.env.example lists the variables), or in the environment of a deployment",
    );
  }
  return { vaultUrl, names, dir: certificateFolder(env) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  // Run by itself: `node scripts/fetch-cert.mjs` downloads the pairs and stops.
  const { default: loadEnv } = await import("./dotenv.mjs");
  loadEnv();
  try {
    await fetchCertificates(settingsFromEnv());
  } catch (error) {
    console.error("fetch-cert failed:", error.message ?? error);
    process.exit(1);
  }
}
