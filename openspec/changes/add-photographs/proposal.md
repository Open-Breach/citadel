# Proposal

## Why

Round one stands as pull request 1: the layout, the design system, the front page and the Rick page, with drawn landscapes where photographs belong. Serge looked at it running and wants the design to gain real photographs before more pages are built.

On 23 November 2026 he looked at eight candidates set into the first screen, chose four of them, and said where they go. He also answered the questions round one left open. This change is round two: the four photographs come into the site, and his answers are folded in.

## What Changes

- Four photographs replace the two drawn landscapes. No drawn landscape remains.
  - The basalt columns fill the first screen of the front page, behind the text.
  - The rocks in fog lie behind the mission statement.
  - The stacks under an amber sky end every page, above the footer.
  - The sea stack ends the opening of every project page.
- **BREAKING for the design of round one:** the text of the first screen no longer stands above the landscape. It lies over the photograph, in light text on the dark rock.
- A label that lies over a photograph is set in the colour of the text beside it, with a small amber mark.
- Photographs are shown sharp: delivered at the resolution of the screen, never blurred, never greyed out by a veil.
- Each photograph is recorded with its source, its author, its licence and the changes made to it, is listed in `THIRD-PARTY-NOTICES.md`, and its photographer is credited in the footer.
- The answers to round one's questions:
  - Install in the navigation of a project page leads to that page's install instructions.
  - A project whose page is not built yet keeps the still-to-come page. Only a name that is no project gets the not-found page.
  - The larger view of a screenshot fits the screen on a phone.
  - A command or a download is shown only for a way of installing that works today.
  - The "Sample data" note stays, and is now required.
  - The Rick card stays on the first screen, and the label above the headline stays.

Explicitly not part of this change:

- The pages for Meeseeks, Gossip, Trebuchet and Butterbot, the Community page, the Charter page and live data from GitHub. They stay in `add-remaining-pages`.
- HTTPS and the container image. They stay in `add-https-start-up`.
- The wording of the mission statement. It stays a draft until Serge writes it.
- Any photograph other than the four chosen ones.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `design-system`: the scheme at first sight, the label over photographs, the imagery, the record of a photograph and the contrast of text over photographs change. Sharp delivery of photographs is added.
- `front-page`: the first screen lies over a photograph, and so does the mission statement. The project card on the first screen becomes a requirement.
- `site-shell`: where Install leads on a project page, the credits in the footer, the photograph that ends every page, and the "Sample data" note.
- `project-pages`: which names get which page, the larger view of a screenshot on a phone, which ways of installing are shown, and the photograph that ends the opening.

## Impact

- Starts only when Serge has merged pull request 1, and when the four photograph files are in the repository (design D3). The first task archives `add-site-layout`, so that this change's deltas have specs to change.
- `src/features/front-page/hero.tsx`, `mission.tsx`, the footer and the project page opening change. The two stand-in drawings and their records are removed.
- `src/content/images.ts` and its type gain the photographs and a field for the changes made to a picture.
- `next.config.ts` gains image settings. The repository grows by four JPEG files.
- The browser checks gain a measurement of text contrast over photographs.
- `DESIGN.md` is brought up to date after the build.
