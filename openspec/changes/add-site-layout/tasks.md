# Tasks

## 1. Project frame

- [x] 1.1 Scaffold the Next.js project in a temporary folder with the options of design D1 and move it into the repository root, keeping everything design D1 lists and adding the scaffold's block to the end of the existing `AGENTS.md`; verify `git status` shows none of the kept files removed, and only `.gitignore` and `AGENTS.md` among them changed, each by gaining the scaffold's part
- [x] 1.2 Remove the scaffold's demo page, demo images and favicon, and add the `typecheck` script; verify `npm run build`, `npm run lint` and `npm run typecheck` succeed
- [x] 1.3 Replace the template's Google font loading with the `geist` package (design D2); verify `npm run build` succeeds with the network switched off after `npm install`
- [x] 1.4 Set up `npm test` with Node's test runner and `npm run test:e2e` with Playwright against `next start` (design D10), each with one trivial test; verify both commands pass
- [x] 1.5 Add to the existing README how to install, start and check the site, where a page's content is changed, and that it runs over plain HTTP on localhost in this round; verify by following it on a clean checkout that `http://localhost:3000` answers

## 2. Design system

- [x] 2.1 Run `/impeccable init` with design D6 to D8 as the brief and board B (`docs/design/mood-board-b.png`) as the chosen direction; verify `PRODUCT.md` and `DESIGN.md` exist, name signal amber as the one accent, and contradict no decided point of design D6
- [x] 2.2 Define the tokens of design D7 as Tailwind theme values in the global stylesheet, including the darker amber for text; verify with a Node test that every pair used for text meets 4.5 to 1 and that no component file holds a colour value of its own
- [x] 2.3 Build the components: glass panel with its fallback surface, button (filled amber and outlined), chip, badge, section label, and the ruled line with tick marks; verify on a scratch page that each matches board B at 1440 pixels wide and that the focus mark is visible on every control
- [x] 2.4 Draw the stand-in landscape as an SVG in the palette (design D5) and add `src/content/images.ts` with its record; verify with a Node test that every image file under the site's image folder has a record and that a file without one fails the test
- [x] 2.5 Add the reduced-motion rule and the no-backdrop-filter fallback; verify with Playwright that with reduced motion on nothing moves beyond a fade, and that with backdrop filters off the navigation text still meets the contrast

## 3. Content

- [x] 3.1 Add `src/content/site.ts` and `src/content/projects.ts` with a typed record for each of the five projects in order (name, one line, platforms, repository, and for Rick the full page content), with a placeholder marker on every draft; verify with a Node test that there are five records in the order Rick, Meeseeks, Gossip, Trebuchet, Butterbot and that TypeScript rejects a record missing a field
- [x] 3.2 Draft Rick's texts from the README of `Open-Breach/rick` (what it is, why it exists, three to eight top features, install steps per platform) and Open-Breach's texts from design D6 and D9 (headline, two lines, mission statement, the built-with-Claude statement), all marked as placeholders; verify each text is present in the content data and marked
- [x] 3.3 Add sample releases and badge values and the two team entries (design D5), marked as placeholders; verify with a Node test that the releases sort newest first and that at most five are returned
- [x] 3.4 Implement `npm run placeholders`; verify it lists every marked text and image with the page that uses it, and that it reports "none" on a content set without markers

## 4. Site shell

- [x] 4.1 Build the root layout with the navigation and the footer, with the entries and targets of design D4 and the support link hidden while no target is configured; verify with Playwright the "Shared navigation" and "Footer" scenarios of the `site-shell` spec
- [x] 4.2 Build the navigation for narrow screens with its menu control; verify with Playwright at 390 pixels wide the three "Navigation on small screens" scenarios, including keyboard use
- [x] 4.3 Add the not-found page and the still-to-come page, and serve the still-to-come page at `/community`, `/charter` and the four projects that have no page yet; verify with Playwright the "Routes" and "No dead links to pages that are not built" scenarios, including the status codes and the request not to index
- [x] 4.4 Add the page metadata; verify with Playwright the two "Page metadata" scenarios
- [x] 4.5 Add a Playwright test that records the network on every built page and fails on a request to another host; verify it passes, and that it fails when a test page loads an image from another host

## 5. Front page

- [x] 5.1 Build the first screen as on board B: label, headline, two lines, ruled line, the two calls to action and the landscape; verify with Playwright the "Introduction and mission" and "Two calls to action" scenarios at 390 and 1440 pixels wide
- [x] 5.2 Build the mission section, the five project cards and the built-with-Claude statement; verify with Playwright the "A card for each project" and "Built with Claude" scenarios, including that a keyboard user reaches each card as one link
- [x] 5.3 Build the latest releases and the team section; verify with Playwright the "Latest releases" scenarios, including that the section is left out when the release data is empty, and the two "The team" scenarios
- [x] 5.4 Add the closing calls to action in the order of design D9; verify the page at 390 and 1440 pixels wide has no horizontal scrolling and no overlapping content

## 6. Rick page

- [x] 6.1 Build the project page from a project's content record: opening, why, screenshots with larger view, top features, install steps, badges and the link to the repository; verify with Playwright every scenario of the `project-pages` spec for `/projects/rick`
- [x] 6.2 Prove the template: add a test fixture for a second project and render it through the same page; verify the fixture's page has the same parts in the same order with no layout code added
- [x] 6.3 Check the page at 390 and 1440 pixels wide; verify no horizontal scrolling, no overlapping content, and that the larger view of a screenshot opens and closes with the keyboard

## 7. Review package

- [ ] 7.1 Run Impeccable's critique and audit on both pages at 390 and 1440 pixels wide and fix what they find; verify the audit reports no remaining finding, or that each remaining one is listed in the pull request with the reason
- [ ] 7.2 Run every check; verify `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run test:e2e` pass
- [ ] 7.3 Capture screenshots of the front page and the Rick page at 390 and 1440 pixels wide and attach them to the pull request, with the output of `npm run placeholders` and the two departures from the board of design D7; verify the pull request shows all four screenshots
- [ ] 7.4 Stop. The round ends here, and Serge looks at the site running before anything else is started

## Workflow follow-up

- Serge reviews the round on his machine with `npm run dev`.
- What the review decides is written into `add-remaining-pages` before that change is applied.
- This change is archived once Serge accepts the round.
