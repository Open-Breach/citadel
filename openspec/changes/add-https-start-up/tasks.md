# Tasks

Do not start before Serge says the certificates exist. Group 1 is the check that they do.

## 1. Prerequisites

- [ ] 1.1 Ask Serge for the vault's address and the certificates' names and put them into `.env.local` only; verify `git status` shows no change and `git check-ignore .env.local` confirms the file is ignored
- [ ] 1.2 Check that each certificate carries its bare domain and its wildcard; verify by reading the names off each certificate's public part with `az keyvault certificate show` and listing them for Serge
- [ ] 1.3 Check that `local.openbreach.dev` resolves to 127.0.0.1; verify with a DNS lookup

## 2. Certificate download

- [ ] 2.1 Port `dotenv.mjs` and `fetch-cert.mjs` from the portal (design D2, D3) with every flowcpt name removed, and add the Azure packages and node-forge; verify with Node tests that a PEM secret is split into key and chain and that a PKCS#12 secret made by the test is converted with the leaf first
- [ ] 2.2 Extend the download to the list in `KEYVAULT_CERTIFICATES`, one folder per certificate under `CERT_DIR` (design D4), failing the whole start when one cannot be read; verify with Node tests against a vault that is an object in the test: all downloaded, one missing name stops with an error that names it, no key material in the log
- [ ] 2.3 Write the key files with owner-only access and make sure `.certs/` and `.env*` are ignored by git while `.env.example` is not; verify with a Node test on the file modes and with `git check-ignore`
- [ ] 2.4 Add the committed `.env.example` with every variable of design D12 commented out and no real value; verify it contains no vault name and no certificate name

## 3. Choosing the certificate

- [ ] 3.1 Implement reading the DNS names off a leaf certificate and the choice for a host name as a pure function (design D5); verify with Node tests every scenario of "The certificate matches the host name asked for" in the `tls-certificates` spec
- [ ] 3.2 Log each certificate with its version, expiry date and names at start; verify the log lines in a Node test and that they hold no key material

## 4. Listeners

- [ ] 4.1 Port `listen.mjs` and its tests (design D9); verify the ported tests pass
- [ ] 4.2 Implement the redirect handler as a pure function of method, Host header and URL (design D7); verify with Node tests every scenario of "Plain HTTP only redirects" in the `http-serving` spec, including a Host header with a port, an invalid host name and `PUBLIC_HTTPS_PORT` set to 14443
- [ ] 4.3 Set `output: "standalone"` and port `serve.mjs`: the certificates, the HTTPS server with the certificate choice, Next.js's request handler on it, the HTTP listener beside it, and the stop on a signal (design D6); verify `npm run build` followed by `npm start` answers over HTTPS with a certificate pair in `CERT_DIR`
- [ ] 4.4 Write the integration test of design D14: two generated certificates for two names, the production start on free ports; verify it checks the certificate presented for each name and for an unknown name, a page and a static file over HTTPS, the redirect over HTTP, every host name getting the same page, and exit status 0 on the termination signal

## 5. Local development

- [ ] 5.1 Port `dev.mjs` with `DEV_HOST` and `DEV_PORT` and no plain HTTP start (design D11), and point the `dev` and `start` scripts in `package.json` at the two scripts; verify that with no vault named `npm run dev` ends with a message that names the missing settings and `.env.local`
- [ ] 5.2 Point the Playwright run at the production start over HTTPS with generated certificates; verify `npm run test:e2e` passes with every test of `add-site-layout` unchanged
- [ ] 5.3 Add the canonical address from `PUBLIC_BASE_URL` to every page; verify with Playwright both scenarios of "Canonical address" in the `site-shell` delta
- [ ] 5.4 Rewrite the README's setup for HTTPS: the four things a local start needs, the variables of design D12, how a certificate is rolled over; verify by following it on a machine with an Azure login

## 6. Container image

- [ ] 6.1 Port the `Dockerfile` and add `.dockerignore` (design D10); verify the image builds
- [ ] 6.2 Start the image with a generated certificate pair mounted into its certificate folder; verify HTTPS on 3000, the redirect on 3080, a user id that is not 0, and exit status 0 within five seconds of `docker stop`
- [ ] 6.3 Inspect the image; verify it holds no certificate, no key and no name of a vault or certificate
- [ ] 6.4 Build the image on arm64, or note in the pull request that no arm64 machine was at hand; verify the same checks as 6.2 where it was built

## 7. With the real vault

- [ ] 7.1 On a machine with an Azure login, run `npm run dev`; verify `https://local.openbreach.dev:14443` opens in a browser with no certificate warning
- [ ] 7.2 On the same machine, run the production start with the full list of certificates and send a request for each of the site's host names to it; verify each gets the certificate of its own domain, including the bare domains
- [ ] 7.3 Run every check; verify `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run test:e2e` pass

## Workflow follow-up

- The deployment, the build workflow and the restart after a renewal are decided with Serge; they are not part of this change.
- This change is archived after `add-site-layout`, because it modifies two of that change's capabilities.
