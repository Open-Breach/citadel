<!-- SEED: established with the user before implementation; re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: Citadel
description: The website of Open-Breach. Light, precise technology set in raw landscape, with signal amber as the one accent.
---

## Overview

Clean technology set in raw nature. The site is light and technical: white and pale grey, thin precise lines and glass-like translucent panels, laid over sparse terrain of black stone, grey stone and ocean water.

The direction was decided by Serge on 2026-11-22. The chosen mood board is `docs/design/mood-board-b.png`, and the decisions are in `openspec/changes/add-site-layout/design.md` (D6 and D7). The films Oblivion and Minority Report were named as a mood. Nothing is copied from them, and stills from films are never used.

**The Instrument Rule.** Every line on the page could be the edge of an instrument: thin, exact and placed on purpose. The reusable signature is the instrument scale, a ruled line with tick marks, which divides and measures.

**The Landscape Rule.** Imagery shows sparse terrain only: black stone, grey stone, ocean water. No green and no turquoise. The finished site uses photographs, each recorded with its source, author and licence. Until they are chosen, a drawn stand-in in the same tones and proportions takes their place, and replacing it does not change the layout around it.

Motion is quiet: short fades and small lifts with an exponential ease-out. Where the system asks for reduced motion, nothing slides, scales, drifts or moves with scrolling.

## Colors

A light scheme with exactly one accent. The strategy is restrained: neutrals taken from the landscape, and signal amber as the single warm opposite of the grey.

| Name | Value | Role |
| --- | --- | --- |
| Mist | `#F5F7F8` | Background |
| Stone | `#8A9096` | Lines and large text |
| Basalt | `#1E2124` | Text, dark surfaces |
| Ocean | `#3E4A55` | Secondary text, dark panels |
| Amber | `#FF8A1F` | Fills of the calls to action |
| Amber for text | around `#B45309`, [exact value to be resolved during implementation] | Small labels and links that lead on |

**The One Accent Rule.** Signal amber is the only saturated colour. No second accent hue marks an interactive or highlighted element, in any state.

**The Amber Marks Actions Rule.** Amber is kept for the calls to action and for small signals, such as a label or a link that leads on. It is never the colour of running text or of a large surface. On the first screen, the Install call to action is the largest amber element.

**The Readable Rule.** Text meets WCAG 2.1 level AA against what is behind it, on panels, on amber and over imagery: 4.5 to 1, and 3 to 1 for large text. Two consequences depart from the mood board. Secondary text is Ocean, not Stone, because Stone on Mist reaches only 3.00 to 1. Small amber text uses the darker amber, because Amber on Mist reaches only 2.19 to 1. The label on an amber fill is Basalt (6.86 to 1), never white.

## Typography

Geist, sans and mono, served by the site itself from the `geist` npm package.

- Display: Geist Sans, heavy and tightly set, near-black, on two lines in the first screen.
- Body: Geist Sans, regular. Secondary text in Ocean.
- Labels: small, in spaced capitals. The name OPEN-BREACH in the navigation is set the same way.
- Data: Geist Mono for versions, dates and commands.

Sizes and the scale are [to be resolved during implementation].

## Layout

Text and actions stand on the left over the pale ground, and the landscape runs edge to edge below them. Content keeps to a wide column with generous margins, and sections that hold several items use several columns on a desktop screen.

Every page is usable from 360 pixels wide to a wide desktop screen, with no horizontal scrolling, no overlapping content and no text cut off. At 390 pixels wide the content is in one column, and the navigation entries move behind a menu control while the name and Install stay visible.

## Elevation & Depth

Depth comes from glass, not from stacked shadows. The navigation and the cards are translucent panels that let what lies behind them show through softened, edged with thin lines.

**The Glass Fallback Rule.** Where the browser cannot soften what lies behind a panel, the panel falls back to a pale surface on which its text stays readable. A panel that lies over imagery keeps its text at 4.5 to 1 wherever the image is light or dark.

The pale background darkens slightly towards the landscape.

## Shapes

Rounded, calm forms: the navigation is one rounded panel, buttons and cards have rounded corners, and chips are outlined pills. Lines are thin. Exact radii are [to be resolved during implementation].

## Do's and Don'ts

- Do keep amber for actions and small signals.
- Do show a clearly visible focus mark on every link, button and control, with at least 3 to 1 against what is next to it.
- Do record every image with its source, author and licence before it is used.
- Don't add a second accent hue, for any state.
- Don't set running text in amber, or fill a large surface with it.
- Don't use green or turquoise in imagery.
- Don't use stills from films.
- Don't let the page turn heavy or dark. Basalt and Ocean surfaces stay small against the Mist.
- Don't build a generic SaaS landing page: no centred headline over a gradient, no grid of icon cards, no wall of claims.
