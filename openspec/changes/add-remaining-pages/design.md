# Design

## Context

This change is provisional. It records what Serge decided on 2026-11-22 for the parts of the site that round one does not build, so that the next round starts from his decisions and not from memory. See `proposal.md`.

Before it is applied, it is revised with the outcome of the review of round one. The review may change the template, the order of the work, or split this change into several rounds. The first task of the task list is that revision.

**Decided** marks a decision of Serge's; **proposed** marks what was added while writing and waits for his yes.

## Goals / Non-Goals

**Goals:**

- Every page of version one exists, with real content.
- No placeholder is left: `npm run placeholders` reports none.
- The pages keep working when GitHub does not answer.

**Non-Goals:**

- A support link and a piece on working with AI. Both are after version one; the navigation and the footer already have room for the support link.
- Comments, accounts or anything else a visitor could write into the site. The community lives on GitHub.

## Decisions

### D1. Project pages (decided)

Each of the five projects gets its own page, written with the product in front: what it is and why it exists in the spirit of its README, more screenshots than the README has, the top features consolidated, and a detailed install part that may be a page of its own. A project may span several pages.

The pages are made from the template of round one. A project's page needs its content record and its screenshots, and no layout of its own.

**Proposed:** an install page of its own only where the instructions do not fit the project page. Rick, with packages for several Linux distributions, macOS and Windows, is the likely first case.

### D2. Community (decided)

The community aspect is built on GitHub Discussions. A Community page links there, and says how to open an issue and how to contribute.

**Proposed:** Discussions are switched on for the whole organisation, so that all five projects share one place and the page has one link. Serge switches it on; the page needs the address.

### D3. Charter (decided)

A page for the founding charter. It starts as ideas that Serge goes over and refines over time, until a real founding. The page says clearly that the text is a working draft.

**Proposed:** the charter is one Markdown file in `src/content`, with its status (draft or adopted) and its date at the top of the file. Serge edits the file; the page follows.

### D4. Data from GitHub

- **Decided:** a small feed of the latest releases on the front page; badges for version, build status, licence and stars, with the numbers read from GitHub on the server and drawn in the site's own style.
- **Proposed:** GitHub's public REST API, read in server components and kept with Next.js's data cache for an hour. Without a credential GitHub allows 60 requests an hour from one address at the time of writing. Five repositories with three reads each, once an hour, stay well under that, so no token is needed and none has to be kept secret.

The reader replaces `src/content/releases.ts` and the badge values of round one behind the same types, so the components do not change.

### D5. Photographs (decided)

Real photographs of sparse terrain: black stone, grey stone, ocean water, no green and no turquoise. The design depends on striking hero photographs. Serge has none of his own, so they are found among material under an open licence. Film stills are not used.

**Proposed:** the agent collects candidates from collections whose licence allows free use on a website, reads the licence of each one, and gives Serge a short list with source, author and licence for each. Serge chooses. Each chosen photograph gets its record in `src/content/images.ts` before it is used, which the `design-system` spec requires.

### D6. Texts and screenshots (decided)

The drafts of round one are placeholders. Serge supplies or approves the final texts, the screenshots, and the names, roles and lines for the team section. A text loses its placeholder marker only when he has approved it.

## Risks / Trade-offs

- [This change is written before the review it depends on] → It is marked provisional, and revising it is its first task.
- [A photograph's licence turns out not to allow the use] → The licence is read for each photograph, not assumed from the collection, and it is recorded with the photograph.
- [GitHub changes its limits or its API] → The site keeps what it read and serves its pages without GitHub (`github-data` spec); the limit named in D4 is a snapshot.
- [The charter page publishes an unfinished text under the organisation's name] → The draft note is the first thing on the page, and the page is published when Serge says so.

## Open Questions

- **Order of the rounds.** Whether the photographs come first, as the design depends on them, and what else the review of round one asks for.
- **Discussions.** Whether they are switched on for the whole organisation, and their address.
- **Install pages.** Which projects need one.
- **Charter.** Its first draft.
- **Trebuchet and Butterbot.** Both are tools for running things, not programs with a window. Whether "screenshots" for them means terminal output and diagrams.
