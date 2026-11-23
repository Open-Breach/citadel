# Design

## Context

The repository holds no code yet, only the OpenSpec scaffold and the Impeccable skill. See `proposal.md` for why the site exists and why it is built in rounds.

What the site shows and how it looks was decided by Serge on 2026-11-22. In this document **decided** marks those decisions, and **proposed** marks what was added while writing this change and still waits for his yes. An agent does not reopen a decided point; it raises a problem with it instead.

Two things shape this round:

- **The certificates for HTTPS do not exist yet.** The site will serve HTTPS itself with certificates from a vault (`add-https-start-up`). Until Serge says to switch, the site runs over plain HTTP on localhost. A name under `.dev` cannot be used for that: browsers force HTTPS for the whole `.dev` zone.
- **The round is for looking at.** Its result is judged by Serge on his machine. Layout and design are final work in this round; texts, imagery and data may be placeholders.

The chosen mood board is in the repository as `docs/design/mood-board-b.png`. Its source is the Figma file [Citadel mood boards](https://www.figma.com/design/iHsDUxfxsimiAVAyKz5tdu), board B.

## Goals / Non-Goals

**Goals:**

- A project frame that the later rounds build on without restructuring.
- A design system that carries the mood board into code as tokens and a small set of components.
- The front page and the Rick page, finished in layout and design at phone and desktop widths.
- A project page that is a template: the other four pages need content only.

**Non-Goals:**

- HTTPS, certificates, the redirect listener and the container image.
- Requests to GitHub. Release entries and badge values are sample data in this round.
- The real photographs. The landscape is a drawn stand-in.
- Final texts. They are drafts, marked as placeholders.
- A build workflow, a deployment, analytics, cookies or a consent banner.

## Decisions

### D1. Stack

- **Decided:** a Next.js website.
- **Proposed:** Next.js 16 with the App Router, React 19, TypeScript, Tailwind 4 and Cache Components, on Node 22, with npm. This is what `create-next-app` gives today with `--ts --app --src-dir --tailwind --eslint --turbopack --import-alias "@/*" --use-npm`: Next.js 16.4.6, React 19.3.0, Tailwind 4.3.3, with `cacheComponents` and `partialPrefetching` switched on in `next.config.ts`.

`create-next-app` wants an empty folder, and this repository is not empty. Scaffold in a temporary folder and move the result in, keeping `.agents/`, `.claude/`, `openspec/`, `licenses/`, `docs/`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `THIRD-PARTY-NOTICES.md` and the existing `.gitignore` entries. The scaffold writes an `AGENTS.md` of its own with one marked block, which tells an agent to read the Next.js documentation in `node_modules/next/dist/docs/`; this version differs from older ones. Add that block to the end of the existing `AGENTS.md`.

`output: "standalone"` is not set in this round. It belongs to the container image in `add-https-start-up`, and `next start` does not serve a standalone build.

Alternative considered: a static site generator. Rejected by the decision for Next.js, and the site will later read release data from GitHub on the server.

### D2. Typeface (proposed)

Geist, sans and mono, from the `geist` npm package. The scaffold's template loads Geist through `next/font/google`, which fetches the font from Google when the site is built. A build without access to Google fails at that step; that was seen in a trial build on 2026-11-22. The npm package has the font files in `node_modules`, so the build fetches nothing and the site serves the fonts itself, which the `site-shell` spec requires.

### D3. Layout of the code (proposed)

| Path | Holds |
| --- | --- |
| `src/app` | The routes: `/`, `/projects/[name]`, `/community`, `/charter`, the not-found page, the root layout and the stylesheet |
| `src/components` | The shell (navigation, footer) and the design system's components (panel, button, badge, chip, section heading) |
| `src/features/front-page`, `src/features/project-page` | The sections of the two pages |
| `src/content` | Everything a page says, as typed data: `site.ts`, `projects.ts`, `releases.ts`, `team.ts`, `images.ts` |

Texts and facts live in `src/content`, not in the components. That is what makes the Rick page a template (the `project-pages` spec, "One template for every project"), and it is where a later round replaces sample data with data from GitHub without touching a component.

### D4. Routes and where the navigation leads

- **Decided:** the navigation entries of the mood board: Open-Breach, Projects, Community, Charter, Team and the Install call to action. A page for each project. A Community page and a Charter page.
- **Proposed:**

| Entry | Leads to |
| --- | --- |
| Open-Breach | `/` |
| Projects | `/#projects`, the cards on the front page |
| Community | `/community` |
| Charter | `/charter` |
| Team | `/#team`, the team section of the front page |
| Install | `/#projects` |
| Join the discussion | `/community` |

In this round only `/` and `/projects/rick` are built. `/community`, `/charter` and the pages of the other four projects answer with the still-to-come page of the `site-shell` spec, so the navigation and all five cards can be shown as they will be. Any other name under `/projects/` is not found.

Where Install should lead in the end is an open question: the projects section, as here, or an install page of its own.

### D5. Placeholders (proposed)

- **Texts.** The agent writes drafts: for Rick from the README of `Open-Breach/rick`, for Open-Breach from this document. Every draft is marked as a placeholder until Serge has approved it.
- **Landscape.** A drawn stand-in like the one on the mood board: layered ridges in light grey, mid grey and near-black over a dark band of ocean with a few thin horizontal lines. It is an SVG made for this site, sized and placed as the photograph will be.
- **Screenshots of Rick.** Screenshots from Rick's repository where it has them, otherwise neutral frames in the proportions of a desktop window.
- **Releases and badges.** Sample entries in the shape the data from GitHub will have: project, version, date and link for a release; version, build status, licence and stars for the badges.
- **Team.** Serge and one more entry. The second name, both roles and both lines are placeholders until Serge supplies them.

The marker is part of the content data, so that `npm run placeholders` finds every one (the `local-development` spec).

### D6. Design direction (decided)

- **Character.** Modern, technological and light: clean technology set in raw nature. The inspirations Serge named are the films Oblivion and Minority Report. They are a mood, not a source: nothing is copied from them, and no stills are used.
- **Light.** White and pale grey, thin precise lines, glass-like translucent panels.
- **Landscape.** Real photographs of sparse terrain: black stone, grey stone, ocean water. No green and no turquoise.
- **Hero photographs.** The design depends on striking hero photographs. They are still to be found, under an open licence, and each one is recorded with its source and licence.
- **Accent.** Signal amber: one warm colour as the opposite of the grey. It was chosen from three mood boards; the other two were ice blue and monochrome.
- **Built with Impeccable.** The agent that builds the site uses the Impeccable design skill.

What board B shows, 1440 by 960:

- A pale background that darkens slightly towards the landscape.
- Top left, the navigation as one rounded glass panel: the name OPEN-BREACH in spaced capitals, the four entries, and a small amber Install button.
- Below it, on the left, a small amber label in spaced capitals, then a very large, heavy, near-black headline on two lines, then two lines of grey text.
- A thin horizontal rule with tick marks, like the scale of an instrument, between the text and the buttons.
- Two buttons: Install, filled amber with a dark label, and Join the discussion, outlined.
- On the right, a glass card for Rick: a small amber label, the name, one line, three outlined chips for Linux, macOS and Windows, and an amber "Explore" link with an arrow.
- The lower half is the landscape, edge to edge.

### D7. Tokens (proposed, taken from board B)

| Name | Colour | Use |
| --- | --- | --- |
| Mist | `#F5F7F8` | Background |
| Stone | `#8A9096` | Lines and large text |
| Basalt | `#1E2124` | Text, dark surfaces |
| Ocean | `#3E4A55` | Secondary text, dark panels |
| Amber | `#FF8A1F` | Fills of the calls to action |

Measured contrast, which the `design-system` spec's "Readable contrast" depends on:

| Pair | Contrast | Result |
| --- | --- | --- |
| Basalt on Mist | 15.05 to 1 | Text |
| Ocean on Mist | 8.44 to 1 | Text |
| Stone on Mist | 3.00 to 1 | Too low for running text. Lines and large text only |
| Basalt on Amber | 6.86 to 1 | Label of an amber button |
| White on Amber | 2.36 to 1 | Not used |
| Amber on Mist | 2.19 to 1 | Too low for any text |

Two consequences differ from the board and need Serge's eye in the review:

- **Secondary text is Ocean, not Stone.** The board's grey for the lines under the headline is close to Stone, which fails for text of that size.
- **Small amber text needs a darker amber.** The board sets its small labels and the "Explore" link in Amber on the pale background. A darker amber for text, around `#B45309` (4.67 to 1 on Mist), keeps the warm signal and passes. The fills stay `#FF8A1F`.

The tokens are defined once, as Tailwind theme values in the global stylesheet, and components use the tokens, never a colour value of their own.

### D8. Working with Impeccable (proposed)

1. Start with `/impeccable init`. It writes `PRODUCT.md` and `DESIGN.md` and configures the skill. Feed it from this document. The visual world is chosen already: board B is the brief, and the skill's own rule is that the brief wins. Do not pick another direction from its catalogue.
2. Build the design system and the two pages with the skill's guidance.
3. Before the review, run the skill's critique and audit on both pages at 390 and 1440 pixels wide, and fix what they find.

`PRODUCT.md`, `DESIGN.md` and the shared files under `.impeccable/` are committed. The `.gitignore` already holds Impeccable's entries for the rest.

The Impeccable design hook is not installed in this repository; only the skill and its subagents are. Whether to add the hook is Serge's decision.

### D9. Front page, order of the sections (proposed)

1. First screen: label, headline, two lines on what Open-Breach is, the two calls to action, the landscape, as on the board.
2. Mission statement. **Decided:** Open-Breach is probably going to be a non-profit organisation; the mission statement says what it is for.
3. Projects: the five cards.
4. Built with Claude.
5. Latest releases.
6. Team.
7. The two calls to action again.
8. Footer.

### D10. Tests (proposed)

- `npm test` runs with Node's own test runner and needs no browser: the content checks (every image has its record, the placeholder listing, the five projects in order).
- `npm run test:e2e` runs Playwright against a production build served by `next start` on localhost. It covers the scenarios of the specs that need a browser: routes and status codes, the navigation at 390 and 1440 pixels wide, keyboard use, no request to another host, reduced motion.

`npm test` is part of the "Checks" requirement. The Playwright run is not, because installing its browser needs the network.

### D11. Proposed points inside the specs

The specs state what Serge decided. These points in them are proposals, added to make the decisions testable or to close a gap:

- `site-shell`: the still-to-come page in place of dead links; the rule that a page loads nothing from another host; the footer's links.
- `design-system`: the contrast, focus, screen-width and reduced-motion requirements; the check that every image has a record.
- `front-page`: at most five release entries; Install being the more prominent call to action, as on the board; the whole card being the link.
- `project-pages`: at least three screenshots and a larger view of each; three to eight features; the link to the repository.
- `local-development`: `npm run placeholders`.

## Risks / Trade-offs

- [Placeholders are taken for final content] → Every placeholder is marked in the content data and listed by `npm run placeholders`; the review is about layout and design.
- [The drawn landscape hides how much the design depends on the photographs] → The stand-in has the size and place of the photograph, and finding the photographs is the first item of the next round.
- [Amber as text fails the contrast requirement] → A darker amber for text (D7), shown to Serge in the review because it departs from the board.
- [Glass panels are costly to draw and can hurt legibility over a busy photograph] → The fallback surface of the `design-system` spec, and a check of text contrast over the lightest and darkest part of the image.
- [Next.js 16 is newer than what an agent knows] → The scaffold's `AGENTS.md` and the documentation in `node_modules/next/dist/docs/`.
- [Impeccable's launcher downloads its engine from the project's GitHub releases on first use] → It checks the download against the checksums shipped with the skill. An agent that cannot reach GitHub follows the skill's own fallback and reads `PRODUCT.md` and `DESIGN.md` directly.

## Open Questions

None of these changes the layout work of this round. Each has a placeholder or a proposal in place.

- **Main address.** The site will answer under several names. Which one is the main one, for the canonical URL? Proposed: `https://openbreach.dev`.
- **Install.** Where the Install call to action leads in the end (D4).
- **Team.** The contributor's name, and role and one line for both people.
- **Texts.** The headline, the mission statement and Rick's texts are drafts.
- **Screenshots.** Which screenshots of Rick to show.
- **Community.** Whether GitHub Discussions is switched on for the whole organisation, so that all projects share one place.
- **Support.** The target of the support link. Until there is one, the link is not shown.
- **Mark and icon.** The board has the name in spaced capitals and no logo. The site has no icon yet.
- **Licence.** The repository is public, like the other Open-Breach repositories, and has no licence yet.
