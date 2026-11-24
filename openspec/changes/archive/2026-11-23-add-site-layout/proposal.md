# Proposal

## Why

Open-Breach has five projects, Rick, Meeseeks, Gossip, Trebuchet and Butterbot, and no place that presents them. Citadel is that place: the website of Open-Breach at openbreach.dev, where each project is shown as a product and a visitor learns what Open-Breach is.

The site is built in rounds, and Serge looks at each round running before the next one starts. This change is round one: enough of the site to judge the layout and the design, and no more.

## What Changes

- A new Next.js project in this repository, which is empty apart from the OpenSpec and Impeccable tooling.
- A design system from the chosen mood board (signal amber): a light, modern, technical look with glass panels and thin lines, set against sparse landscape.
- The site's shell: the navigation, the footer, the page metadata and the not-found page.
- The front page with all of its sections: what Open-Breach is with its mission, the calls to action, a card for each project, the note that the work is done with Claude, the latest releases, and the team.
- The Rick page, built as the template the other four project pages will be made from.
- The site runs over plain HTTP on localhost in this round, because the certificates for HTTPS do not exist yet.
- Texts, imagery, release entries and badge values may be placeholders. Every placeholder is marked and listed.

Explicitly not part of this change:

- HTTPS, the certificates from Key Vault, the HTTP to HTTPS redirect and the container image. They are the change `add-https-start-up`, which waits for the certificates.
- The pages for Meeseeks, Gossip, Trebuchet and Butterbot, the Community page, the Charter page, live data from GitHub, and the real photographs and texts. They are the change `add-remaining-pages`, which is revised after the review of this round.
- A support link (Patreon or similar) and a piece on how Open-Breach works with AI. Both come after version one.
- The build workflow, the deployment and the repository's licence, which is still to be chosen.

## Capabilities

### New Capabilities

- `site-shell`: what every page shares: the navigation, the footer, the routes, the page metadata and the not-found page.
- `design-system`: the visual language of the site: colour, type, surfaces, imagery, and how they behave across screen sizes and user settings.
- `front-page`: what a visitor finds on the front page.
- `project-pages`: how a project is presented as a product on a page of its own.
- `local-development`: how the site is started and checked on a developer machine.

### Modified Capabilities

None. This is the first change in the repository.

## Impact

- **Code**: a new Next.js project at the root of this repository. There is no existing code.
- **Dependencies**: Next.js, React, Tailwind and TypeScript, plus the Geist typeface as an npm package. Versions are in `design.md`.
- **External systems**: none at run time. In this round the site makes no request to another host, neither from the server nor from the browser.
- **Design tooling**: the Impeccable skill, which is installed in this repository, writes `PRODUCT.md`, `DESIGN.md` and files under `.impeccable/`.
- **Review**: the round ends with Serge looking at the site running on his machine. Nothing is deployed.
