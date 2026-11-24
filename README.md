# Citadel

Citadel is the website of [Open-Breach](https://github.com/Open-Breach), at openbreach.dev. It presents Open-Breach and its five projects, Rick, Meeseeks, Gossip, Trebuchet and Butterbot, as products: what each one is, why it exists, what it looks like and how to install it.

## Status

Round three. The site is specified as [OpenSpec](https://github.com/Fission-AI/OpenSpec) changes and is built in rounds, one change per round. Serge looks at each round running before the next one starts.

The site serves HTTPS itself, with certificates it downloads from Azure Key Vault when it starts, and answers plain HTTP only with a redirect to HTTPS. It is built as a container image for a cluster. It has the front page and the Rick page; the other pages say that they are still to come. The four landscape photographs are in place. Texts, releases and badge values are still placeholders.

| Change | What it is | State |
| --- | --- | --- |
| [add-site-layout](openspec/changes/archive/2026-11-23-add-site-layout/) | Round one: the project's frame, the design system, the front page and the Rick page, over plain HTTP on localhost | Done and archived |
| [add-photographs](openspec/changes/archive/2026-11-24-add-photographs/) | Round two: the four photographs, the first screen over a photograph, and the answers to the questions of round one | Done and archived |
| [add-https-start-up](openspec/changes/add-https-start-up/) | Round three: certificates from Azure Key Vault picked by host name, the HTTP to HTTPS redirect, the container image and its publishing | Built, waits for Serge's review and for the steps that need the vault |
| [add-remaining-pages](openspec/changes/add-remaining-pages/) | The other four project pages, Community, Charter, data from GitHub, the real photographs | Provisional, revised after the review of round one |

Each change has a proposal (what and why), a design (how, and what is still open), specs (the behaviour, one file per capability) and tasks (the plan). The requirements of the archived changes are in [openspec/specs](openspec/specs/).

## Running the site

You need [Node.js](https://nodejs.org) 22 or newer, with npm. The site runs over HTTPS only, also on a developer machine, so a local start needs four more things:

1. **An Azure login.** `az login`, with an account that may read the certificate and its secret in the vault. The site holds no credential of its own.
2. **The vault and the certificate, named in `.env.local`.** Copy [.env.example](.env.example) to `.env.local` and set `KEYVAULT_URL` and `KEYVAULT_CERTIFICATES` there. Git ignores `.env.local`. This repository is public: the name of the vault and the names of the certificates are never written into it.
3. **`local.openbreach.dev` resolving to this machine.** It is one record in the openbreach.dev zone that points the name at 127.0.0.1. `nslookup local.openbreach.dev` shows whether it is there.
4. **A certificate that covers that name.** The wildcard certificate for openbreach.dev does.

```bash
npm install
npm run dev
```

The site is then at <https://local.openbreach.dev:14443>. Changes to the source show in the browser without a restart. `DEV_HOST` and `DEV_PORT` change the address. There is no plain HTTP start: without a certificate nothing starts, and the message says which setting is missing.

The production start serves the built site the way the container does:

```bash
npm run build
PORT=14443 HTTP_PORT=14080 PUBLIC_HTTPS_PORT=14443 npm start
```

That is HTTPS at <https://local.openbreach.dev:14443>, and plain HTTP on port 14080, which only redirects there. Without the three variables it listens on 3000 and 3080, as in the container. `GET /healthz` answers 200 with a short text.

### Settings

They are read from the environment, and on a developer machine from `.env.local`. A variable that is already set in the environment wins over the file. [.env.example](.env.example) lists them all, without a value.

| Variable | Purpose |
| --- | --- |
| `KEYVAULT_URL` | The vault the certificates come from |
| `KEYVAULT_CERTIFICATES` | The names of the certificates in it, separated by commas. The first is the default |
| `CERT_DIR` | Where the key and certificate pairs are written, one folder per certificate. `.certs` unless set, which git ignores |
| `PORT`, `KEEP_ALIVE_TIMEOUT` | The HTTPS listener. `PORT` is 3000 unless set |
| `HTTP_PORT` | The plain HTTP listener that redirects. 3080 unless set |
| `PUBLIC_HTTPS_PORT` | The HTTPS port a visitor uses, for the target of the redirect. 443 unless set |
| `BIND_HOST` | The one address both listeners bind. Unless set they bind every address, IPv4 and IPv6 |
| `DEV_HOST`, `DEV_PORT` | The name and the port of `npm run dev`. `local.openbreach.dev` and 14443 unless set |
| `PUBLIC_BASE_URL` | The site's main address, `https://openbreach.dev` unless set. It is read when the site is **built**, not when it starts |

The site answers the same under every host name, and every page names its own address under the main address as its canonical address, so that search engines count the names as one site. The pages are built ahead of time, and that address is part of them. A start whose environment names another main address than the one the pages were built with says so in its log and changes nothing.

### Certificates

- **Where they come from.** At every start the site downloads each certificate named in `KEYVAULT_CERTIFICATES`, with its private key, and writes the pair to `CERT_DIR/<name>/`: `key.pem` and `cert.pem`, readable by their owner only. When one of them cannot be read, the site does not start, and the message names it.
- **Which one is presented.** The names a certificate covers are read off the certificate itself. A client gets the certificate that holds the name it asks for, otherwise the one with a wildcard that covers exactly one further label, otherwise the first one. A wildcard does not cover its bare domain: `*.openbreach.dev` covers `www.openbreach.dev` and not `openbreach.dev`, so each certificate has to hold both. The start logs every certificate with its names and its expiry date, and warns about a wildcard without its bare domain.
- **Another domain.** Add its certificate's name to `KEYVAULT_CERTIFICATES` and restart. Nothing in the code changes.
- **Stored formats.** PEM, or PKCS#12 without a password. A certificate with a key that is not RSA has to be stored as PEM.
- **Rolling over.** The site reads the certificates at start only, and nothing watches the vault. After a certificate was renewed in the vault, restart the site: it then presents the new version, and until then the old one. The pairs in `CERT_DIR` are written anew at every start and can be deleted at any time.
- **Without a vault.** When `KEYVAULT_URL` is not set, the production start serves with the pair that is already in `CERT_DIR`, `key.pem` and `cert.pem`, and does not start when there is none. That is for a container that gets its certificate from somewhere else. `npm run dev` always asks the vault.

The start scripts are in `scripts/`: `dev.mjs` for `npm run dev`, `serve.mjs` for `npm start` and the container, `fetch-cert.mjs` for the download, `certificates.mjs` for the choice of the certificate, `redirect.mjs` for the plain HTTP listener and `listen.mjs` for the address.

## Checking the site

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the site for production |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Checks the types |
| `npm test` | Runs the checks that need no browser and no build: the content, the colour contrast, the image records, the certificate download and choice, the redirect |
| `npm run placeholders` | Lists every placeholder text and image, with the page that uses it |
| `npm run test:integration` | Starts the production start on the build in `.next`, with two certificates it makes itself, and checks certificates, pages, the redirect, the health path and the stop. Run `npm run build` first |
| `npm run test:e2e` | Builds the site and runs the browser tests against the production start, over HTTPS on port 3100 |
| `npm run test:image` | Starts the container image and checks it. Build the image first, see below |

None of them needs the vault or an Azure login: the tests make their own certificates, signed by nobody, and no test certificate is kept. After `npm install`, all but the last two need no network. The browser tests need Playwright's browser, once:

```bash
npx playwright install chromium
```

The browser tests build the site into a folder of their own, `.next-e2e`, with a few test pages under `/fixtures` switched on. `npm run dev` shows those pages too: `/fixtures/components` has every component of the design system on one page. In a normal build they are not found.

After an upgrade of Next.js, run `npm run build` and `npm run test:integration` before anything else. The HTTPS start mounts a request handler that is internal to Next.js, and that test is what notices when it changed.

## The container image

The [Dockerfile](Dockerfile) builds the image the site runs from in a cluster. It holds no certificate, no key, and no name of a vault, of a certificate or of a registry. It runs as a user that is not root, serves HTTPS on port 3000 and redirects plain HTTP on port 3080, and resizes the photographs itself.

```bash
docker build -t citadel:test .
npm run test:image
```

The workflow [image.yml](.github/workflows/image.yml) runs the checks, then builds the image for `linux/amd64` and for `linux/arm64`, each on a machine of its own kind, and checks it there. On a push to `main` it then publishes the image. A pull request builds and checks and publishes nothing. The workflow does not deploy.

### How a published image is named

The registry is named in the repository's settings and nowhere else: the variable `REGISTRY_IMAGE` holds the registry's address and the image's name, and the secrets `REGISTRY_USERNAME` and `REGISTRY_PASSWORD` hold the login. Where one of them is missing, as in a fork, the workflow builds, publishes nothing and says so.

A published image has two tags under the name in `REGISTRY_IMAGE`:

- `sha-` followed by the first twelve characters of the commit, for example `sha-0123456789ab`. This tag never moves.
- `main`, which moves with every push to `main`.

The summary of the run shows the commit's tag and the digest of the image. A deployment names the commit's tag or the digest, never `main`. Inside the image, `APP_VERSION` is the version of `package.json` with the same twelve characters, and the first line of the site's log says it.

The optional variable `PUBLIC_BASE_URL` sets the main address the image is built with, when it is not `https://openbreach.dev`.

### What a deployment supplies

The manifests are not in this repository. They have to supply:

- **The image**, by its commit tag or its digest.
- **`KEYVAULT_URL` and `KEYVAULT_CERTIFICATES`** in the container's environment. The same image runs everywhere; an environment differs only in these.
- **An identity for the pod** that may read the certificates and their secrets in the vault.
- **A service** that maps port 443 to the container's 3000 and port 80 to its 3080. Nothing terminates TLS in front of the site.
- **Probes** on `/healthz` with the HTTPS scheme on port 3000. Over plain HTTP the path is redirected like every other.
- **Two places the container may write to**, when its root file system is read-only: `/app/.certs`, for the certificates, and `/app/.next/cache`, for the photographs it has resized. The site runs with the user id 1001, which has to be able to write to both. The picture cache is empty after every start, so the first request for each size of a photograph takes longer than the ones after it.
- **A restart after a certificate was renewed.** The site reads the certificates at start only.

## Changing what a page says

Everything a page says is data in `src/content`, not in the components:

| File | Holds |
| --- | --- |
| `src/content/site.ts` | The texts of the front page, the navigation, the footer and the support link |
| `src/content/projects.ts` | The five projects, and for a project with a page everything its page says |
| `src/content/releases.ts` | The release entries of the front page |
| `src/content/team.ts` | The team |
| `src/content/images.ts` | The record of every image: its source, its author, its licence and the changes made to it |

A text or an image that is still a placeholder is marked as one in these files. Remove the marker when the content is final; `npm run placeholders` then stops listing it.

The layout lives in `src/app` (the routes), `src/components` (the shell and the design system) and `src/features` (the sections of the front page and of a project page).

## Photographs

The four photographs are in `public/images/photographs/`, each at most 3840 pixels wide. The site resizes them for the screen that asks and delivers AVIF or WebP. The first request for a size takes a few seconds to encode; after that it comes from the cache under `.next/cache/images`, which keeps a size for 31 days. On a developer machine, when a photograph is replaced under the same name, delete that folder, or the site goes on delivering the old picture. A container starts with an empty cache. A part of a photograph is chosen for its place in the page, by placement, and never by cutting the file. [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) names the photographers and the licence.

## Design

The look is decided: light, modern and technical, set against sparse landscape, with signal amber as the one accent. The chosen mood board is [docs/design/mood-board-b.png](docs/design/mood-board-b.png), and the design decisions are in the [design of round one](openspec/changes/archive/2026-11-23-add-site-layout/design.md) and the [design of round two](openspec/changes/archive/2026-11-24-add-photographs/design.md), which brought in the photographs. [DESIGN.md](DESIGN.md) records the design system as it is built.

## Tools in this repository

- **OpenSpec**: the `openspec/` folder and the OpenSpec skills for Claude Code.
- **Impeccable**: the design skill and its subagents for Claude Code. Its design hook is not installed. It reads [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md), and keeps its shared files under `.impeccable/`.

[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) says where each comes from and under which licence.
