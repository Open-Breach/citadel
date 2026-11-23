# Proposal

## Why

Round one shows the front page and the Rick page. Version one of the site has more, and Serge decided what on 2026-11-22: a page for every project, a Community page, a Charter page, release data and badges from GitHub, and real photographs. This change holds those decisions so that none is lost between rounds.

**This change is provisional.** It is revised with what the review of round one decides, and it is not applied before Serge has looked at round one and asked for the next round. It may be split into several rounds then.

## What Changes

- Pages for Meeseeks, Gossip, Trebuchet and Butterbot, made from the template that the Rick page established.
- An install page of its own for a project whose install instructions are long.
- A Community page. The community lives in GitHub Discussions, and the page leads there and says how to report a bug and how to contribute.
- A Charter page with the founding charter of Open-Breach, shown as a working draft and marked as one until the organisation is founded.
- The latest releases and the facts on the badges come from GitHub, read by the server, in place of the sample data of round one.
- The real hero photographs replace the drawn landscape: black stone, grey stone and ocean, under an open licence, each recorded with source, author and licence.
- Final texts and screenshots replace the placeholders.

Explicitly not part of this change:

- A support link (Patreon or similar) and a piece on how Open-Breach works with AI. Both come after version one.
- HTTPS and the container image, which are `add-https-start-up`.

## Capabilities

### New Capabilities

- `community-page`: the page that leads a visitor to the community and says how to take part.
- `charter-page`: the page that shows the founding charter while it is being worked out.
- `github-data`: how the site gets releases and badge facts from GitHub.

### Modified Capabilities

- `project-pages`: requirements are added for the pages of all five projects and for an install page of its own.

`project-pages` comes from the change `add-site-layout`. This change can be archived only after that one.

## Impact

- **Code**: new routes and content; the sample data of round one is replaced by a reader for GitHub's public API.
- **External systems**: GitHub's public API, called from the server. The browser still makes no request to another host.
- **Content from Serge**: the texts, the screenshots, the choice of photographs, and the charter's draft.
- **Outside this repository**: GitHub Discussions has to be switched on for Open-Breach before the Community page can link to it.
