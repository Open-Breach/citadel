# Design

## Context

See `proposal.md` for why the site serves HTTPS itself and why this change waits.

In this document **decided** marks a decision of Serge's from 2026-11-22, and **proposed** marks what was added while writing this change and still waits for his yes.

The mechanism exists already in two other projects of Serge's, both in the private repository `FlairFindr/flow-captain`:

- **The flowcpt portal** (`apps/portal`, read at commit `9a200cd`) is a Next.js site that downloads one certificate from Azure Key Vault at start and serves TLS itself. Its start scripts are the source for this change.
- **The flowcpt hosting service** (`services/hosting`) is a Rust server that loads several wildcard certificates from one vault and picks one by the host name the client asks for, with one of them as the default. Citadel does the same, in Node.

The agent that applies this change needs read access to that repository for the port, or gets the six script files and the Dockerfile from Serge.

A trial port of the portal's single-certificate start-up was run on 2026-11-22 against Next.js 16.4.6, with a self-signed certificate in place of the vault. It is not in this repository. What it showed is under "Trial" below.

## Goals / Non-Goals

**Goals:**

- The same site, served over HTTPS by the site itself, locally, in staging and in production.
- One image and one start script for every environment; an environment differs only in its configuration.
- No vault name, certificate name, certificate or key in this repository.

**Non-Goals:**

- Issuing and renewing certificates.
- Watching the vault. A renewed certificate is picked up at the next start.
- The deployment and its manifests, and a build workflow.
- Redirects between host names.

## Decisions

### D1. TLS in the process, no proxy in front (decided)

"The same way with the certificate from Key Vault as in the portal": the site's own process terminates TLS, locally and in a pod. A service maps the public ports 443 and 80 to the container's ports.

Alternative considered: TLS at an ingress, with the pod speaking plain HTTP. It is the usual Kubernetes arrangement. It was set aside for the portal already, where Serge chose TLS in the process for local and deployed runs alike, and Citadel follows the portal.

### D2. What is ported and what is new

Ported from the portal's `scripts/` folder, with every flowcpt name taken out:

| File | Does |
| --- | --- |
| `fetch-cert.mjs` | Logs in with `DefaultAzureCredential`, reads a certificate and the secret of the same name, which holds the private key, and writes `key.pem` and `cert.pem` |
| `serve.mjs` | The production start: certificate, then the built site on `https.createServer` |
| `dev.mjs` | `npm run dev`: certificate, then `next dev --experimental-https` with the pair |
| `dotenv.mjs` | Loads `.env.local` and `.env` for the scripts that run before Next.js; a variable that is already set wins |
| `listen.mjs`, `listen.test.mjs` | The address the listeners bind, and its tests |
| `Dockerfile` | The image, D10 |

Not taken over: the portal's `secrets.mjs` (Citadel has no secret) and `gen-api.mjs` (Citadel has no backend). When Citadel gets its first secret, `secrets.mjs` is the pattern to port then.

New in Citadel, because the portal has one certificate and no plain HTTP listener:

- Several certificates and the choice between them (D4, D5).
- The HTTP listener that redirects (D7).

### D3. How one certificate is downloaded (ported)

1. `DefaultAzureCredential` gives the identity: the Azure CLI login on a developer machine, the workload identity in a pod.
2. The certificate object is read for its version, its expiry date and the format its secret is stored in.
3. The secret of the same name is read. It holds the private key and the chain.
4. A PEM secret is split into its key block and its certificate blocks. A PKCS#12 secret is base64 without a password; it is opened with node-forge, trying both forms of "no password", and the leaf is the certificate whose public key matches the private key.
5. `key.pem` and `cert.pem` are written, the leaf first and the chain after it. The files are mode 0600 and their folder 0700.
6. One log line names the certificate, its version, its expiry date and the paths.

### D4. Several certificates

- **Decided:** a wildcard certificate per domain, picked by the host name the client asks for, as the hosting service does. Production has five: for `openbreach.dev`, `open-breach.com`, `open-breach.dev`, `openbreach.net` and `open-breach.org`. Staging and a local start have one, for `openbreach.dev`.
- **Proposed:** `KEYVAULT_CERTIFICATES` holds the names of the certificates in the vault, separated by commas. The first is the default. It replaces the portal's `KEYVAULT_CERTIFICATE`. Each certificate is written to a folder of its own, `CERT_DIR/<name>/`.

Every certificate must carry its bare domain next to the wildcard. `*.openbreach.dev` covers `www`, `web-stg` and `local`, and does not cover `openbreach.dev` itself, which is where production lives. The same holds for the four other domains.

### D5. Choosing the certificate (proposed)

`serve.mjs` reads the DNS names off each leaf certificate, builds a TLS context for each, and gives `https.createServer` the default pair plus a callback that picks the context for the name the client asks for:

1. A certificate that holds the name exactly.
2. Otherwise a certificate that holds a wildcard covering exactly one further label.
3. Otherwise the default.

The hosting service lists the host names for each certificate in its configuration. Reading them off the certificate saves that list and cannot drift from what the certificate really covers. The start logs each certificate with its names, so a missing bare domain shows in the first log lines.

`next dev` takes one key and one certificate, so `npm run dev` uses the default certificate only.

### D6. The HTTPS listener (ported)

`next start` cannot serve TLS. `serve.mjs` therefore does what the `server.js` that Next.js generates for a standalone build does, with one difference: the request handler is mounted on `https.createServer` instead of the plain HTTP server. It reads the build's configuration from `.next/required-server-files.json`, sets the environment variables the generated `server.js` sets, and takes the handler from `getRequestHandlers` in `next/dist/server/lib/start-server`.

That function is not a public interface of Next.js. Every upgrade of Next.js re-checks the HTTPS start, and the integration test of the task list is what catches a break.

`next.config.ts` gets `output: "standalone"` in this change.

### D7. The HTTP listener

- **Decided:** the only redirect is from HTTP to HTTPS, and the site does it itself.
- **Proposed:** a second listener in `serve.mjs`, an `http.createServer` whose handler never reaches Next.js. It answers 308 with `Location: https://<host><path and query>`. The host is the request's Host header without its port, checked to be a valid host name; the port in the target is `PUBLIC_HTTPS_PORT`, left out when it is 443. A request without a usable Host header gets 400.

It sits in the start script because Next.js is mounted on the HTTPS server and never sees a plain HTTP request.

Ports: 3000 for HTTPS and 3080 for HTTP in the container, neither of which needs privilege. `npm run dev` has no HTTP listener: a browser never tries plain HTTP for a name under `.dev`.

### D8. Host names

- **Decided:** the site accepts every host name and answers the same under each. There are no redirects between names. Next.js does not check the host, so this needs no code.
- **Proposed:** every page names the main address as its canonical address (the `site-shell` delta), so that search engines count the names as one site. The main address comes from `PUBLIC_BASE_URL`. Which name is the main one is an open question; `https://openbreach.dev` is assumed.

A client that asks for a name no certificate covers gets the default certificate and a warning from its browser. That is the correct outcome for a name that was never set up.

### D9. Listening address (ported)

Both listeners bind `::` as one socket that takes IPv4 and IPv6, asked for explicitly because the default differs between operating systems. On a machine without IPv6 they bind `0.0.0.0` and say so. `BIND_HOST` names one address instead. `HOSTNAME` is not read, although Next.js's own standalone server takes its address from it: a container runtime sets it to the pod's name, which is one address of one family.

### D10. Container image (ported)

A multi-stage build on `node:22-alpine`:

1. **Dependencies:** `npm ci --ignore-scripts`.
2. **Build:** `next build`. The build argument `APP_VERSION` carries the version.
3. **Script modules:** installs only the four packages the start scripts import, at the versions of the root `package.json`.
4. **Runtime:** a user that is not root, the standalone output, the static files, `public`, the start scripts and their modules. `CERT_DIR` is `/app/.certs`. `HOSTNAME` is not set. The command is `node scripts/serve.mjs`.

**Proposed:** the image builds on amd64 and on arm64, as the portal's does.

### D11. Local development

- **Decided:** local testing runs at `local.openbreach.dev`, over HTTPS like everything else.
- **Proposed:** port 14443, and 14080 for the HTTP listener when the production start is run locally. They continue the ports of the flowcpt services. `DEV_HOST` and `DEV_PORT` change the address without touching the script.

A local start needs four things:

- `az login`, with an account that may read the certificate and its secret.
- `KEYVAULT_URL` and `KEYVAULT_CERTIFICATES` in `.env.local`.
- `local.openbreach.dev` resolving to 127.0.0.1: one DNS record in the openbreach.dev zone.
- A certificate that covers that name, which the wildcard does.

There is no plain HTTP start any more. A name under `.dev` could not use one anyway.

### D12. Variables

| Variable | Purpose |
| --- | --- |
| `KEYVAULT_URL` | The vault |
| `KEYVAULT_CERTIFICATES` | The names of the certificates in it, the default first |
| `CERT_DIR` | Where the pairs are written, or read from when no vault is named. Default `.certs`, ignored by git |
| `PORT`, `KEEP_ALIVE_TIMEOUT` | The HTTPS listener. `PORT` is 3000 unless set |
| `HTTP_PORT` | The plain HTTP listener that redirects. 3080 unless set |
| `PUBLIC_HTTPS_PORT` | The HTTPS port a visitor uses, for the redirect's target. 443 unless set |
| `BIND_HOST` | The one address both listeners bind, when not every address |
| `PUBLIC_BASE_URL` | The site's main address, for the canonical address |
| `DEV_HOST`, `DEV_PORT` | The name and port of `npm run dev`. `local.openbreach.dev` and 14443 unless set |

A deployment sets `KEYVAULT_URL`, `KEYVAULT_CERTIFICATES` and `PUBLIC_BASE_URL`, and gives the pod a workload identity that may read the certificates and their secrets.

### D13. No names in the repository (proposed)

The vault's name and the certificates' names are in `.env.local` and in the deployment only. The repository has a committed `.env.example` with every variable commented out and no real value, and `.gitignore` ignores `.env*` except that file. The portal's README tells a developer to copy an `.env.example` that its `.gitignore` keeps out of the repository; Citadel commits the file.

### D14. Tests

- **Node tests, no network:** splitting a PEM secret; converting a PKCS#12 secret, with fixtures the test generates; the download against a vault that is an object in the test; the choice of certificate for a name, as a pure function, with every scenario of the `tls-certificates` spec; the redirect handler, with every scenario of "Plain HTTP only redirects"; the ported listener tests.
- **Integration test, no vault:** the test generates two certificates for two names, puts them where the start script reads them, starts the production start on free ports, and checks which certificate is presented for each name, the pages over HTTPS, the redirect over HTTP, and the stop on a signal.
- **With the real vault:** once, by hand, on a machine with an Azure login. It is the last group of the task list.

## Trial

On 2026-11-22 the portal's scripts, ported for one certificate, were run with Next.js 16.4.6 and a self-signed pair in `CERT_DIR`:

| Check | Result |
| --- | --- |
| The production start from the project folder | HTTPS: front page 200, stylesheet 200, unknown path 404, stops on the termination signal |
| The same from the image's file layout, put together by hand | Same, and the font files are served |
| `npm run dev` with a certificate pair | The HTTPS dev server answers 200 |
| The ported listener tests | 7 passed, 1 skipped: the machine had no IPv6 |

Not covered by the trial: the download from a real vault, the image build, several certificates, the HTTP listener, and `local.openbreach.dev` with a real certificate.

## Risks / Trade-offs

- [A wildcard without its bare domain makes `https://openbreach.dev` fail in every browser] → The start logs each certificate's names; the task list checks the names before the switch; it is a prerequisite in the proposal.
- [`getRequestHandlers` is internal to Next.js and can change] → The integration test starts the real build over HTTPS; a Next.js upgrade is not merged without it passing.
- [One missing certificate keeps the whole site from starting] → Chosen on purpose: a site that starts without one of its domains fails for that domain's visitors with no error anywhere. The error names the certificate.
- [The PKCS#12 conversion reads RSA keys only, a limit of node-forge] → A certificate with an ECDSA key has to be stored as PEM, which the script reads for any key type. The certificate job's stored format has to match this.
- [A renewed certificate is served only after a restart] → Something outside this repository has to restart the pods after a renewal, or on a schedule shorter than the renewal window. It is an open question for the deployment.
- [The site depends on the vault at every start] → A pod that restarts while the vault is unreachable does not come up. The same holds for the portal today.
- [Three of the alias domains are outside `.dev`, so a browser may try plain HTTP first] → The HTTP listener redirects them.

## Migration Plan

Before the change is applied, Serge confirms:

1. The certificates are in the vault, each with its bare domain and its wildcard. The domains' DNS is at Cloudflare and a wildcard is validated through DNS, so the certificate job needs to be able to write records there.
2. `local.openbreach.dev` resolves to 127.0.0.1.
3. A developer account, and later the pod's identity, may read the certificates and their secrets.

Then the tasks run in order. The plain HTTP dev start of round one ends with this change; going back is going back to the commit before it.

## Open Questions

None of these changes the code of this change; each is a value or lies outside the repository.

- **Names of the certificates in the vault.** They are configuration.
- **Ports.** 14443 and 14080 locally, 3000 and 3080 in the container, are proposals.
- **Main address.** Which of the names is the main one.
- **Working without the vault.** Whether `npm run dev` may take a key and certificate that someone puts into `CERT_DIR` themselves, as the production start does, or whether the vault is the only way.
- **Hosting.** Which cluster and namespace for production and for staging, each with a public address of its own.
- **Build and deploy.** A workflow in this repository that builds the image and hands it to the deployment. The portal's workflow is in a private repository, and a public repository cannot call a reusable workflow from a private one.
- **Restart after a renewal.** What restarts the pods once the certificate job has renewed a certificate.
