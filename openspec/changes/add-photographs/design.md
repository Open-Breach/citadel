# Design

## Context

Round one is built on the branch `round-one` (pull request 1). Its first screen stands above a drawn landscape, and a second drawing, a shore, ends every page. Serge's verdict on round one: so far so good, and the design should now gain real photographs.

On 23 November 2026 Serge looked at eight photographs, each set into the first screen of round one in two ways: behind the text, and below the text as built. He chose four. Of the others he said that they are too fussy or too flat: he likes a picture that stands out, and he does not like it blurry or out of focus. That sentence is the brief for every choice of crop and treatment in this round.

Two reference images are in `docs/design/round-two/`:

- `first-screen.jpg`: the first screen at 1440 by 900 with the basalt columns behind the text. It is the board Serge chose. It shows placement and tone. It is not a measured comp: the type is drawn by a script.
- `photograph-fading-in.jpg`: how a photograph fades in from the pale ground, with no edge at its top.

## Goals / Non-Goals

**Goals**

- The four photographs are in the site, each in its place, sharp, and with readable text wherever text lies over one.
- Every photograph is recorded and credited.
- The answers to round one's questions are in the site and in the specs.
- Serge can look at the front page and the Rick page running and judge the photographs in place.

**Non-Goals**

- No further pages, no live data, no HTTPS.
- No new photographs, no mirrored photographs, no generated imagery.
- No rework of sections that this document does not name.

## Decisions

### D1. The four photographs (decided)

| Name in this document | File | Photographer | Source | Original |
| --- | --- | --- | --- | --- |
| Basalt columns | `basalt-columns.jpg` | Sebastian Spindler | https://unsplash.com/photos/gray-rock-formation-on-gray-sand-during-daytime-ycA729rLQKw | 5717 by 3811 |
| Sea stack | `sea-stack.jpg` | Joseph Corl | https://unsplash.com/photos/black-sand-beach-with-rock-formations-FV7NJ-bSH6o | 4436 by 3378 |
| Stacks under an amber sky | `stacks-amber-sky.jpg` | Leo_Visions | https://unsplash.com/photos/a-group-of-large-rocks-in-the-ocean-oJX5gsIBOag | 8369 by 5448 |
| Rocks in fog | `rocks-in-fog.jpg` | Mads Eneqvist | https://unsplash.com/photos/a-body-of-water-w2VxnoRrsjE | 3479 by 1957 |

All four are on Unsplash under the Unsplash License. Each page showed "Free to use under the Unsplash License" on 23 November 2026, and none is an Unsplash+ picture. The licence allows use, copying, changing and distributing without permission and without credit. It forbids selling the pictures unchanged.

### D2. Where each photograph goes

Decided by Serge:

- The basalt columns fill the first screen of the front page, behind the text.
- The other three are spread over the site: one behind the mission statement, one in the band above the footer on every page, one for the project pages.

Proposed, which of the three goes where:

- Rocks in fog behind the mission statement. Its upper half is plain fog, so text can lie on it.
- Stacks under an amber sky in the band above the footer. Its sky is the site's accent colour, and its sea is close to the footer's Ocean.
- Sea stack at the end of the opening of every project page.

### D3. The files (proposed)

- The files are in `public/images/photographs/` before this round starts. Serge or Claude puts them there. They come from the sources of D1, are at most 3840 pixels wide, and are JPEG files of high quality. The agent does not fetch pictures from the internet and does not put another picture in the place of a missing one. If a file is missing, stop and tell Serge.
- The agent does not change the picture files. A crop for a screen size is done in the page, by placement.
- The sea stack has a small patch of moss. Serge chose the picture knowing that. In the file its green is toned down until it reads as grey, so that "no green" holds. The record says so.
- `src/content/images.ts` holds one record for each photograph with `kind: "photograph"`, the source and the photographer of D1, the licence "Unsplash License", and a new field `changes` that says what was done to the file (resized, toned). The records of the two drawn landscapes and their files are removed.
- `THIRD-PARTY-NOTICES.md` gains a section "Photographs" with the same facts and the sentence that the photographs are not covered by the repository's own licence.

### D4. The first screen (decided: basalt columns behind the text, light text)

As in `docs/design/round-two/first-screen.jpg`:

- The photograph fills the first screen from edge to edge, behind the navigation, the text and the Rick card. The screen is as tall as in round one.
- At 1440 by 900 the photograph is shown about 1600 pixels wide, anchored to the left edge and centred vertically. The columns then lie under the navigation and the text, and the wave lies under the Rick card.
- The label, the headline, the lines under it, the ruled line and the outlined button are Mist. The Install button stays amber with Basalt text.
- The rule for every other width: the columns lie under the whole text block, and the right edge of the columns stays to the right of it. Scale the photograph with the screen. Where the text block moves to the middle on a wide screen, enlarge or shift the photograph so that the rock still lies under the text. On a phone the photograph shows mostly rock and sand. That is accepted.
- No veil lies over the photograph. On the board the text had more than 10 to 1 on the rock with no veil.
- Proposed: the photograph is not mirrored. It shows a real place.

### D5. Text over photographs

Decided, in Serge's words: a picture should stand out, and it should not be blurry or flat.

Proposed, what follows from that:

- Contrast comes from where the picture is placed and from the text colour. A veil is the last means, never more than a fifth strong, and never over the whole picture.
- Nothing blurs a photograph except a glass panel over it. No blurred preview while a photograph loads.
- A browser check measures the contrast. For each line of text over a photograph it takes the rendered page with the text hidden, reads the pixels under the line, and computes the WCAG contrast with the colour of the text. The line passes when at most one pixel in twenty is below the requirement. It runs at 390, 768, 1440 and 1920 pixels wide.

### D6. The mission statement (proposed)

- The section keeps its content and its two columns.
- The rocks in fog span the section from edge to edge. The upper part of the picture, the fog, fades into the pale ground as in `photograph-fading-in.jpg`. The rocks fill the lower part and close the section with a straight edge.
- The text lies in the upper part, on pale ground and fog, in the dark text colours. The section grows as tall as the rocks need.
- The picture is 3479 pixels wide. On a screen with more device pixels across it is enlarged. Say so in the report if it shows.

### D7. The band above the footer (proposed)

- The stacks under the amber sky take the place of the drawn shore on every page.
- The sky fades into the pale ground above it. The tips of the stacks are fully visible, and the horizon lies in the lower third of the band. Below the horizon the sea passes into the Ocean colour of the footer over a short distance.
- No text lies over it. The closing section of the front page stays above it on the pale ground.
- On a page with little content, such as the not-found page, the band may be lower.

### D8. The opening of a project page (proposed)

- The opening keeps its content: name, text, badges, buttons and the screenshot.
- Below it the sea stack fades in from the pale ground and spans the page. The stack stands right of the middle with its base and the waterline in view, and the cliff stands on the left. The top of the stack may dissolve in the fade.
- No text lies over it. The part on why the project exists follows on the pale ground.
- It belongs to the template, so every project page gets it.

### D9. Labels

- Decided: the label above the headline stays, as on board B. Impeccable bans such a label. Note its finding and keep the label.
- Decided with the board Serge chose: over a photograph the label has the colour of the text beside it and a small amber square before it.
- Proposed: the label "PROJECT" on the Rick card takes the same form, so that the first screen has one kind of label. The "Explore" links keep the darker amber of round one.

### D10. Delivery of the photographs (proposed)

- Use the image component of Next.js with AVIF first and WebP second, widths up to 3840, and `sizes` that matches how wide each picture is shown. Read the image docs of the Next.js version in the repository first and set what that version needs.
- The photograph of the first screen is loaded with priority. The others load as they come near the screen.
- While a photograph loads, its place has a flat tone taken from the picture, such as Basalt for the columns. Not a blurred preview.
- Aim: the photograph of the first screen at 2880 pixels wide is under 450 kB. Where that costs visible sharpness, sharpness wins. Say so in the report.

### D11. The answers to round one's questions (decided on 23 November 2026)

| Question of round one | Answer |
| --- | --- |
| 1. The Rick card on the first screen | It stays, and it is Rick. |
| 2. Install on a project page | It leads to that page's install instructions. |
| 3. A project without a page | The still-to-come page with the status 200. Only a name that is no project gets 404. |
| 4. Task 2.1 and `DESIGN.md` | A mistake in the task. Nothing to do. |
| 5. Platforms on the cards | Not answered. It stays as built. |
| 6. The larger view on a phone | It fits the screen. |
| 7. The "Sample data" note | It stays, and is now required. |
| 8. An install command before it works | Not shown. The way of installing is named as still to come. |
| 9. The mission wording | Serge writes it. The draft stays marked as a draft. |
| 10. The label above the headline | The board stands. |

### D12. What round one's documents got wrong

Three things in `add-site-layout` were mistakes of the specification and not of the build. This change corrects them through its deltas. The archived change is not edited.

- `project-pages`, "A page for a project", said that a name without a project page gets the not-found page. It meant a name that is no project.
- Design D4 sent Install to `/#projects` on every page. On a project page it now leads to that page's install instructions.
- Task 2.1 expected `/impeccable init` to write `DESIGN.md`.

### D13. Working with Impeccable (proposed)

- Do the design work of task groups 2 and 3 through the Impeccable skill. This document and the two reference images are the brief, and the brief wins over the skill's own taste.
- Where Impeccable objects to a decided point, such as text over a photograph or the label above the headline, note the finding in the report and keep the decision.
- After the build, let the documenter bring `DESIGN.md` up to date.

### D14. Proposed points inside the specs

These points of the spec deltas are proposals and wait for Serge's yes:

- Which of the three photographs goes where (D2).
- The credits in the footer.
- Toning down the moss on the sea stack.
- That the contrast over photographs is measured by the browser checks, and at which widths.
- The numbers in "Photographs are shown sharp".

## Risks / Trade-offs

- The first screen is now dark on its left half. The site is light from the second screen on. Serge chose this on the board. → The light scheme is kept everywhere below.
- The headline's second line ends near the right edge of the columns. → The measured contrast decides. Enlarge the photograph a little if a letter falls on the sky.
- Rocks in fog is the smallest original. → See D6.
- Four photographs add weight to every page. → D10, and only the first loads with priority.
- The image component needs its optimiser when the site runs. → Nothing to do in this round. `add-https-start-up` gets a note that the container image has to carry it.
- The agent may have no way to open the source pages. → The facts of D1 are complete. Do not look for other sources.

## Open Questions

- The wording of the mission statement.
- Question 5 of round one, the platforms on the cards.
- The two colour departures of round one: secondary text in Ocean, and the darker amber for small text, which reads as rust. They stand until Serge says otherwise.
- Three findings of round one's audit are not in this round: the silent refusal of a clipboard write, the section headings that pass under the navigation at 1440 pixels, and the keyboard reach of a scrolling box. The last one goes away with the answer to question 6.
- The licence of the repository.
