# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site is written first for people who might install an Open-Breach tool: developers and technical users who arrive at openbreach.dev, want to know what a project such as Rick is, and decide whether to install it. (Confirmed by Serge, 2026-11-23.)

People who might contribute or give feedback come second. They are served by the Join the discussion call to action and the Community page.

## Product Purpose

Citadel is the website of Open-Breach, at openbreach.dev. It presents Open-Breach and its five projects, Rick, Meeseeks, Gossip, Trebuchet and Butterbot, as products: what each one is, why it exists, what it looks like and how to install it. It also says what Open-Breach is and what it is for.

A visit has succeeded when the visitor knows what Open-Breach is, has found a project that fits them, and has what they need to install it.

## Positioning

In Serge's words, lightly edited: visitors should believe that they get the next generation of tools as open source, instead of waiting for a big company to build them. AI now helps to build things fast in a way that was not possible before. So these are tools built by people for people, tools they really love, with no other interest behind them, commercial or otherwise.

What a neighbouring project could not truthfully copy:

- The projects are built in the open, and Open-Breach says plainly that the work is done with Claude.
- There is no commercial interest. Open-Breach is probably going to be a non-profit organisation. This is not settled, so the site does not claim it as a fact.

## Operating Context

- A visitor comes from a search, from GitHub or from a link, on a desktop or a phone, and reads in English.
- The projects live in public repositories under github.com/Open-Breach. Installing a project means copying a command or downloading a release from GitHub.
- Feedback and discussion happen on GitHub.
- The site serves itself: a page loads its fonts, styles, scripts and images from the site's own host and causes no request to another host.

## Capabilities and Constraints

- A Next.js site. It is built in rounds, one OpenSpec change per round, and Serge looks at each round running before the next one starts.
- Round one has the front page and the Rick page. Community, Charter and the other four project pages follow.
- Everything a page says is typed data in `src/content`. A text or image that is not final is marked as a placeholder and listed by `npm run placeholders`.
- The five projects are always listed in this order: Rick, Meeseeks, Gossip, Trebuchet, Butterbot.
- The team section lists people only. An AI is never listed as a member of the team.
- Badges are drawn by the site. Nothing is loaded from a badge service.
- No analytics, no cookies and no consent banner.
- The repository is public. No secret, certificate or name of a vault belongs in it.

Undecided:

- The main address for the canonical URL. Proposed: `https://openbreach.dev`.
- Where the Install call to action leads in the end: the projects section, or an install page of its own.
- The target of a support link. Until there is one, the link is not shown.
- The contributor's name in the team section, and role and one line for both people.
- The site's licence.

## Brand Commitments

- The name is Open-Breach. In the navigation it is set in spaced capitals, OPEN-BREACH. There is no logo and no icon yet.
- The look was decided by Serge on 2026-11-22 from three mood boards. The chosen one is `docs/design/mood-board-b.png`, with signal amber as the one accent. The decisions are in `openspec/changes/add-site-layout/design.md`, D6 and D7. `DESIGN.md` records the look; this file does not repeat it.
- The films Oblivion and Minority Report were named as a mood. Nothing is copied from them, and stills from films are never used.
- Voice: plain and direct, in the spirit of the projects' READMEs. Free software from a small team, described without sales language.

## Evidence on Hand

- The READMEs of the projects under github.com/Open-Breach. Rick's is the source for the Rick page.
- Two screenshots of Rick in its repository, `docs/screenshots/readme-light.png` and `readme-dark.png`.
- The mood board, `docs/design/mood-board-b.png`.

Absent, and not to be fabricated:

- The landscape photographs. They are still to be found, under an open licence, each recorded with its source, author and licence. Until then a drawn stand-in takes their place.
- Final texts. The headline, the mission statement and Rick's texts are drafts until Serge approves them.
- Release data and badge values from GitHub. Round one shows sample data, marked as placeholders.
- Testimonials, user numbers, benchmarks and customers. There are none, and the site shows none.

## Product Principles

1. **The tools are the proof.** Show each project as it is: what it does, what it looks like, how to install it. A claim without something to look at stays out.
2. **Say how it is made.** The work is done with Claude, by people. The site says both and hides neither.
3. **No interest but the user's.** Nothing on the site sells, tracks or holds a visitor back from the install step.
4. **Honest about what is unfinished.** Young software says that it is young. A page that is not built says so. A placeholder is marked.
5. **One template, five projects.** A project gets a page by supplying its content, never a layout of its own.

## Accessibility & Inclusion

WCAG 2.1 level AA for contrast: 4.5 to 1 for text, 3 to 1 for large text. Every control shows a visible keyboard focus mark. Every page is usable from 360 pixels wide. Where the system asks for reduced motion, nothing moves beyond short fades.
