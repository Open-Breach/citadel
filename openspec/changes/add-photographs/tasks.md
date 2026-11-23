# Tasks

## 0. Before the round

- [x] 0.1 Check that pull request 1 is merged into `main`, then archive `add-site-layout` with the OpenSpec archive skill; verify `openspec/specs/` holds the five capabilities of round one and `openspec validate --all --strict` passes. If the pull request is not merged, stop and tell Serge
- [x] 0.2 Check that the four files of design D1 are in `public/images/photographs/`; verify each opens as a JPEG and is at most 3840 pixels wide. If one is missing, stop and tell Serge. A file narrower than 2880 pixels is a reduced copy (design D3): go on, and name it in the report

## 1. Photographs and their records

- [ ] 1.1 Add the field `changes` to the image record type and one record for each photograph with the facts of design D1 and D3, and remove the two drawn landscapes with their records; verify `npm test` passes, and that it fails when a record of a photograph has no source, no author, no licence or no `changes`
- [ ] 1.2 Add the section "Photographs" to `THIRD-PARTY-NOTICES.md` (design D3); verify it names the four photographs with source, photographer and licence
- [ ] 1.3 Set up the delivery of design D10; verify with a browser check that at 1440 pixels wide and two device pixels per pixel the first screen's photograph arrives at least 2880 pixels wide, or at the full width of its file while that file is a reduced copy, that at 390 pixels wide a smaller file arrives, and that no blurred preview is shown

## 2. The first screen

- [ ] 2.1 Put the basalt columns behind the first screen with the light text of design D4, through the Impeccable skill; verify a screenshot at 1440 by 900 against `docs/design/round-two/first-screen.jpg`: the same part of the photograph, the text on the rock, the Rick card over the wave
- [ ] 2.2 Place the photograph for the other widths by the rule of design D4; verify with screenshots at 390, 768 and 1920 pixels wide that all of the text lies on the rock and nothing overlaps
- [ ] 2.3 Give the label above the headline, and the label of the Rick card, the form of design D9; verify the label's text has the colour of the text beside it and that the amber mark is there
- [ ] 2.4 Add the contrast measurement of design D5 to the browser checks; verify it passes for the first screen at the four widths, and that it fails when the headline is set to Basalt for a trial

## 3. The other three photographs

- [ ] 3.1 Put the rocks in fog behind the mission statement (design D6), through the Impeccable skill; verify at 390, 768, 1440 and 1920 pixels wide that the fog passes into the pale ground without an edge and that the contrast measurement passes for every line of the section
- [ ] 3.2 Put the stacks under the amber sky into the band above the footer in place of the drawn shore (design D7); verify on the front page, the Rick page and the not-found page that the band is there, that the tips of the stacks are fully visible, and that no text lies over it
- [ ] 3.3 Put the sea stack at the end of the opening in the project page template (design D8); verify on the Rick page and on the fixture project page that it is there, and that no text lies over it
- [ ] 3.4 Add the credits to the footer; verify the four names are shown and each leads to its source of design D1

## 4. The answers to round one

- [ ] 4.1 Make Install in the navigation of a project page lead to that page's install instructions; verify with a browser check that on the Rick page it moves to the install part and the address stays on `/projects/rick`, and that on the front page it still moves to the projects section
- [ ] 4.2 Add the check for a project without a page; verify `/projects/gossip` answers 200 with the still-to-come page and `/projects/no-such-project` answers 404
- [ ] 4.3 Make the larger view of a screenshot fit the screen; verify at 390 pixels wide that the whole screenshot is within the screen and nothing scrolls sideways, and that the hint about moving the image is gone
- [ ] 4.4 Remove the command for the package repository from the Rick page and name that way of installing as still to come; check each download against Rick's latest release on GitHub. Verify no command points to a host that does not answer. If GitHub cannot be reached, leave the placeholder marker on the downloads and say so in the report
- [ ] 4.5 Add a check for the "Sample data" note; verify it is shown beside data that carries the marker and is absent on a fixture page with real data

## 5. Review

- [ ] 5.1 Run Impeccable's critique and audit on the front page and the Rick page, fix what they find, and note what stays and why (design D13); verify the detector reports nothing new on the sources
- [ ] 5.2 Let Impeccable's documenter bring `DESIGN.md` up to date; verify it describes the photographs, the first screen over a photograph and the label form
- [ ] 5.3 Run `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run placeholders` and `npm run test:e2e`; verify all pass and that the placeholder list no longer names a landscape
- [ ] 5.4 Put screenshots of the front page and the Rick page at 1440 and 390 pixels wide, and of the first screen at 1440 by 900, into `docs/review/round-two/`, open one pull request from the branch `round-two`, and do not merge it; verify the pull request shows the screenshots and lists every departure from a proposed point and every question for Serge
