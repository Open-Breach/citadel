# Citadel

Citadel is the website of [Open-Breach](https://github.com/Open-Breach), at openbreach.dev. It presents Open-Breach and its five projects, Rick, Meeseeks, Gossip, Trebuchet and Butterbot, as products: what each one is, why it exists, what it looks like and how to install it.

## Status

Round one. The site is specified as [OpenSpec](https://github.com/Fission-AI/OpenSpec) changes and is built in rounds, one change per round. Serge looks at each round running before the next one starts.

In this round the site runs over plain HTTP on localhost only. It has the front page and the Rick page; the other pages say that they are still to come. Texts, imagery, releases and badge values are placeholders.

| Change | What it is | State |
| --- | --- | --- |
| [add-site-layout](openspec/changes/add-site-layout/) | Round one: the project's frame, the design system, the front page and the Rick page, over plain HTTP on localhost | Built, waits for Serge's review |
| [add-https-start-up](openspec/changes/add-https-start-up/) | The switch to HTTPS: certificates from Azure Key Vault picked by host name, the HTTP to HTTPS redirect, the container image | Waits for the certificates |
| [add-remaining-pages](openspec/changes/add-remaining-pages/) | The other four project pages, Community, Charter, data from GitHub, the real photographs | Provisional, revised after the review of round one |

Each change has a proposal (what and why), a design (how, and what is still open), specs (the behaviour, one file per capability) and tasks (the plan).

## Running the site

You need [Node.js](https://nodejs.org) 22 or newer, with npm. Nothing else: no account, no vault, no certificate and no secret.

```bash
npm install
npm run dev
```

The site is then at <http://localhost:3000>, over plain HTTP. Changes to the source show in the browser without a restart. HTTPS comes with the change `add-https-start-up`.

## Checking the site

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the site for production |
| `npm run lint` | Runs ESLint |
| `npm run typecheck` | Checks the types |
| `npm test` | Runs the checks that need no browser: the content, the colour contrast, the image records |
| `npm run placeholders` | Lists every placeholder text and image, with the page that uses it |
| `npm run test:e2e` | Builds the site and runs the browser tests against it on port 3100 |

After `npm install`, the first five need no network. The browser tests need Playwright's browser, once:

```bash
npx playwright install chromium
```

The browser tests build the site into a folder of their own, `.next-e2e`, with a few test pages under `/fixtures` switched on. `npm run dev` shows those pages too: `/fixtures/components` has every component of the design system on one page. In a normal build they are not found.

## Changing what a page says

Everything a page says is data in `src/content`, not in the components:

| File | Holds |
| --- | --- |
| `src/content/site.ts` | The texts of the front page, the navigation, the footer and the support link |
| `src/content/projects.ts` | The five projects, and for a project with a page everything its page says |
| `src/content/releases.ts` | The release entries of the front page |
| `src/content/team.ts` | The team |
| `src/content/images.ts` | The record of every image: its source, its author and its licence |

A text or an image that is still a placeholder is marked as one in these files. Remove the marker when the content is final; `npm run placeholders` then stops listing it.

The layout lives in `src/app` (the routes), `src/components` (the shell and the design system) and `src/features` (the sections of the front page and of a project page).

## Design

The look is decided: light, modern and technical, set against sparse landscape, with signal amber as the one accent. The chosen mood board is [docs/design/mood-board-b.png](docs/design/mood-board-b.png), and the design decisions are in the [design of round one](openspec/changes/add-site-layout/design.md). [DESIGN.md](DESIGN.md) records the design system as it is built.

## Tools in this repository

- **OpenSpec**: the `openspec/` folder and the OpenSpec skills for Claude Code.
- **Impeccable**: the design skill and its subagents for Claude Code. Its design hook is not installed. It reads [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md), and keeps its shared files under `.impeccable/`.

[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) says where each comes from and under which licence.
