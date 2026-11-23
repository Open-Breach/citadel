# Proposal

## Why

Citadel is to be HTTPS on all sides: in production, in staging and on a developer machine. Round one runs over plain HTTP on localhost only because the certificates do not exist yet. This change is the switch.

The site serves TLS itself, with certificates it downloads from Azure Key Vault when it starts. That is how the flowcpt portal does it, and Citadel takes that mechanism over. Production answers under five domains, so unlike the portal Citadel loads several certificates and picks one by the name the browser asks for.

**This change is not applied until Serge says so.** It waits for the certificates, which the reworked certificate job has to issue first.

## What Changes

- At every start the site downloads its certificates and their private keys from Azure Key Vault, with the identity of the place it runs in.
- The site serves the built pages over HTTPS itself. No ingress or proxy terminates TLS in front of it.
- Several certificates can be configured. The site presents the one that matches the host name asked for, and the first configured one otherwise.
- A second, plain HTTP listener answers every request with a redirect to HTTPS and serves nothing else.
- The site answers the same under every host name. There are no redirects between names.
- **BREAKING** for local work: `npm run dev` serves HTTPS at `https://local.openbreach.dev:14443` with the certificate from the vault. The plain HTTP start of round one goes away.
- A container image that runs the site this way.

Explicitly not part of this change:

- Issuing or renewing certificates. That is the certificate job's work.
- The deployment: cluster, namespace, public address, DNS records and manifests. They live outside this repository.
- A build workflow that builds and publishes the image.

## Capabilities

### New Capabilities

- `tls-certificates`: where the site's certificates come from, how they are kept on disk, and which one is presented for a host name.
- `http-serving`: how the site listens: HTTPS for the pages, plain HTTP only to redirect, under any host name.
- `container-image`: the container image through which the site runs in a cluster.

### Modified Capabilities

- `local-development`: the requirement "Dev start" changes from plain HTTP on localhost to HTTPS at `local.openbreach.dev`.
- `site-shell`: a requirement is added that every page names the site's main address as its canonical address.

Both capabilities come from the change `add-site-layout`. This change can be archived only after that one.

## Impact

- **Code**: new start scripts under `scripts/`, a `Dockerfile`, `output: "standalone"` in `next.config.ts`, and the `dev` and `start` scripts in `package.json`.
- **Dependencies**: `@azure/identity`, `@azure/keyvault-certificates`, `@azure/keyvault-secrets` and `node-forge`, for the start scripts only.
- **External systems**: Azure Key Vault at every start. Nothing else.
- **Prerequisites outside this repository**, all Serge's: the certificates in the vault, each carrying its bare domain next to the wildcard; a DNS record that points `local.openbreach.dev` at 127.0.0.1; an Azure login for developers and an identity for the pod that may read the certificates and their secrets.
- **Developers**: a local start needs `az login` and a `.env.local` that names the vault and the certificates.
- **Source**: the single-certificate start-up is ported from the flowcpt portal, `apps/portal` in the private repository `FlairFindr/flow-captain`. `design.md` says what is ported and what is new.
