# Tasks

Do not start before Serge has reviewed round one and asked for the next round.

## 1. Revise this change

- [ ] 1.1 Write the outcome of the review of round one into this change's proposal, design, specs and tasks, and split it into several changes if the review asks for several rounds; verify `openspec validate --strict` passes and Serge has said yes to the revised scope

## 2. Photographs

- [ ] 2.1 Collect candidates for the hero photographs (design D5), read each one's licence, and give Serge a list with source, author and licence; verify every candidate on the list has all three and a licence that allows the use
- [ ] 2.2 Replace the drawn landscape with the photographs Serge chose, each with its record in `src/content/images.ts`; verify the image-record test passes, text over each photograph meets the contrast requirement at its lightest and darkest part, and `npm run placeholders` no longer lists the landscape

## 3. Project pages

- [ ] 3.1 Add the content records and screenshots for Meeseeks, Gossip, Trebuchet and Butterbot; verify with Playwright both scenarios of "A page for each of the five projects", and that no card on the front page leads to a still-to-come page
- [ ] 3.2 Add the install page for each project that needs one (design D1) and the short form on its project page; verify with Playwright both scenarios of "Install page of its own"
- [ ] 3.3 Replace Rick's draft texts and screenshots with the approved ones; verify `npm run placeholders` lists nothing for the Rick page

## 4. Community and Charter

- [ ] 4.1 Build the Community page with the link to the discussions and the ways to take part; verify with Playwright every scenario of the `community-page` spec
- [ ] 4.2 Build the Charter page from one Markdown file with its status and date (design D3); verify with Playwright every scenario of the `charter-page` spec, including a test that adds a paragraph to a copy of the file
- [ ] 4.3 Remove the still-to-come page from `/community` and `/charter`; verify both routes show their real page

## 5. Data from GitHub

- [ ] 5.1 Implement the reader for releases and badge facts behind the types of round one, kept for an hour (design D4); verify with Node tests against recorded answers: the newest five releases across the projects, each badge fact, and at most one read per fact within the hour
- [ ] 5.2 Implement the behaviour when GitHub does not answer; verify with Node tests both scenarios of "GitHub out of reach"
- [ ] 5.3 Remove the sample releases and badge values; verify the network-recording test still finds no request from the browser to another host, and `npm run placeholders` lists no release or badge

## 6. Final content and review

- [ ] 6.1 Replace the remaining draft texts and the team entries with the approved ones; verify `npm run placeholders` reports none
- [ ] 6.2 Run Impeccable's critique and audit on every page at 390 and 1440 pixels wide and fix what they find; verify the audit reports no remaining finding, or that each remaining one is listed in the pull request with the reason
- [ ] 6.3 Run every check; verify `npm run build`, `npm run lint`, `npm run typecheck`, `npm test` and `npm run test:e2e` pass
- [ ] 6.4 Stop for Serge's review

## Workflow follow-up

- This change is archived after `add-site-layout`, because it adds requirements to one of that change's capabilities.
