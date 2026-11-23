---
name: Citadel
description: The website of Open-Breach. Light, precise technology set in raw landscape, with signal amber as the one accent.
colors:
  amber: "#ff8a1f"
  amber-deep: "#a04a00"
  amber-bright: "#ff9a3d"
  amber-pressed: "#f07a0c"
  mist: "#f5f7f8"
  haze: "#dde2e5"
  white: "#ffffff"
  stone: "#8a9096"
  fog: "#c3c9ce"
  ocean: "#3e4a55"
  basalt: "#1e2124"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.136rem + 4.571vw, 5.25rem)"
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.38rem + 1.52vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  statement:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.05rem + 1.33vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 0.97rem + 0.38vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  reading:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
  control:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
  fine:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
  name:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
  name-wide:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.14em"
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  control: "0.625rem"
  panel: "1rem"
  card: "1.25rem"
  pill: "9999px"
spacing:
  gutter-narrow: "1.25rem"
  gutter-medium: "2rem"
  gutter-wide: "4.5rem"
  card-gap: "1rem"
  column-gap: "2rem"
  section: "5rem"
  section-wide: "8rem"
  scale-step: "3.75rem"
components:
  button-filled:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.basalt}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.25rem"
    height: "2.75rem"
  button-filled-hover:
    backgroundColor: "{colors.amber-bright}"
    textColor: "{colors.basalt}"
  button-filled-active:
    backgroundColor: "{colors.amber-pressed}"
    textColor: "{colors.basalt}"
  button-filled-small:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.basalt}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "2.25rem"
  button-solid:
    backgroundColor: "{colors.basalt}"
    textColor: "{colors.mist}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.25rem"
    height: "2.75rem"
  button-solid-hover:
    backgroundColor: "{colors.ocean}"
    textColor: "{colors.mist}"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.basalt}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.25rem"
    height: "2.75rem"
  button-outlined-hover:
    backgroundColor: "{colors.basalt}"
    textColor: "{colors.mist}"
  button-outlined-active:
    backgroundColor: "{colors.ocean}"
    textColor: "{colors.mist}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.basalt}"
    rounded: "{rounded.pill}"
    padding: "0 0.625rem"
    height: "1.5rem"
  label:
    textColor: "{colors.amber-deep}"
    typography: "{typography.label}"
  navigation-bar:
    textColor: "{colors.basalt}"
    rounded: "{rounded.panel}"
    padding: "0 0.625rem 0 1.75rem"
    height: "3.5rem"
  project-card:
    textColor: "{colors.basalt}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
  badge:
    textColor: "{colors.basalt}"
    rounded: "0.375rem"
    padding: "0 0.625rem"
    height: "1.75rem"
  command-block:
    backgroundColor: "{colors.white}"
    textColor: "{colors.basalt}"
    typography: "{typography.data}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.5rem 0.5rem 1rem"
  footer:
    backgroundColor: "{colors.ocean}"
    textColor: "{colors.mist}"
---

# Design System: Citadel

## Overview

**Creative North Star: "The Instrument Panel on the Coast"**

This name is proposed and waits for the owner's yes. So do the display names Deep Amber, Bright Amber and Pressed Amber used below; the token names `amber-deep`, `amber-bright` and `amber-pressed` are the build's own.

Clean technology set in raw nature. The site is light and technical: a pale ground of white and pale grey, thin precise lines and glass-like translucent panels, laid over sparse terrain of black stone, grey stone and ocean water. Signal amber is the one accent.

The direction was decided by Serge on 2026-11-22. The chosen mood board is `docs/design/mood-board-b.png`, and the decisions are in `openspec/changes/add-site-layout/design.md` (D6 and D7). The films Oblivion and Minority Report were named as a mood only. Nothing is copied from them, and stills from films are never used. Two results would feel wrong to the owner: a page that is heavy or dark, and a generic SaaS landing page.

Every colour, type size, radius and shadow is defined once, in the `@theme` block of `src/app/globals.css`. Tailwind's own palette is switched off, so the eleven colours below are the only ones that exist. Components use the tokens and hold no colour value of their own.

Motion is quiet. One easing is used everywhere, an exponential ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`). The first screen composes itself once in reading order, with small lifts of 0.75rem over 700ms, 70ms apart. The instrument scale draws itself in from the left over 1100ms. The landscape drifts by 2.5 per cent against the scroll. The arrow of a link that leads on moves 0.25rem to the right under the pointer. State changes take 150ms to 200ms, and a control lists only its text colour, background colour and border colour as the properties that change, so the focus ring never fades in from another colour. Where the visitor asks for reduced motion, the lifts and the drawn scale become a 300ms fade, and nothing slides, scales, drifts or moves with scrolling.

**The Instrument Rule.** Every line on the page could be the edge of an instrument: thin, exact and placed on purpose. The reusable signature is the instrument scale, a ruled line with tick marks, which divides and measures.

**The Landscape Rule.** Imagery shows sparse terrain only: black stone, grey stone, ocean water. No green and no turquoise. The finished site uses real photographs, each recorded with its source, author and licence. Until they are chosen, a drawn stand-in in the same tones and proportions takes their place, and replacing it does not change the layout around it. In the build the stand-ins are two drawn SVG files: layered ridges over a band of ocean for the first screen, and a shore above the footer.

**Key Characteristics:**

- A light scheme: Mist ground, Basalt type, Stone hairlines.
- Signal amber as the one accent, on actions and small signals only.
- Glass panels with a thin light edge and one soft shadow.
- The instrument scale as the divider and the measure.
- Landscape of stone and ocean, edge to edge, at the top and the foot of the page.
- Labels in spaced capitals; versions, dates and commands in mono.

## Colors

A light scheme with exactly one accent. The neutrals are taken from the landscape, and signal amber is the single warm opposite of the grey.

### Primary

- **Signal Amber** (`amber`): the one accent. As a fill it is the Install call to action and nothing else. The text selection is a 38 per cent mix of it with Mist.
- **Deep Amber** (`amber-deep`): amber as text. It is used for small labels, for the "Explore" link of a card, for the arrow of a release row and for the text caret. It reaches 5.62 to 1 on Mist and 4.63 to 1 on Haze.
- **Bright Amber** (`amber-bright`): an amber fill under the pointer.
- **Pressed Amber** (`amber-pressed`): an amber fill while pressed.

### Neutral

- **Mist** (`mist`): the background of every page, and the text on Ocean and Basalt.
- **Haze** (`haze`): the background where it darkens towards the land. Sections that meet the landscape run from Mist to Haze.
- **White** (`white`): the base of the glass panels, and of the small pale surfaces that hold a command or a badge label.
- **Stone** (`stone`): lines, tick marks and chip outlines. It is not a colour for running text (3.00 to 1 on Mist).
- **Fog** (`fog`): secondary text and thinned lines on Ocean and Basalt (5.43 to 1 on Ocean).
- **Ocean** (`ocean`): secondary text on the light ground (8.44 to 1 on Mist), and the water band of the footer.
- **Basalt** (`basalt`): text, the fill of the solid button, the outline and hover fill of the outlined button, the focus ring, and the darkest stone (15.05 to 1 on Mist).

### Named Rules

**The One Accent Rule.** Signal amber is the only saturated colour. No second accent hue marks an interactive or highlighted element, in any state. Hover and pressed states of amber stay amber; hover states elsewhere turn to Basalt or Ocean.

**The Amber Marks Actions Rule.** Amber is kept for the Install call to action and for small signals, such as a label or a link that leads on. It is never the colour of running text or of a large surface. On the first screen, the Install call to action is the largest amber element.

**The Amber Means Install Rule.** An amber fill means Install only. Where the first action of a place is not Install, such as "Source on GitHub" at the close of a project page, it is a solid Basalt button, and no other action borrows the amber fill.

**The Readable Rule.** Text meets WCAG 2.1 level AA against what is behind it, on panels, on amber and over imagery: 4.5 to 1, and 3 to 1 for large text. `tests/unit/tokens.test.ts` checks every pair used for text. Two consequences are deliberate departures from the mood board. Secondary text is Ocean, not Stone, because Stone on Mist reaches only 3.00 to 1. Small amber text uses Deep Amber, because Signal Amber on Mist reaches only 2.19 to 1; the fills stay Signal Amber. The label on an amber fill is Basalt (6.86 to 1), never white.

## Typography

**Display Font:** Geist Sans (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Geist Sans (the same family)
**Label/Mono Font:** Geist Mono (with ui-monospace, monospace)

**Character:** One family carries the whole page. Display is heavy and tightly set in Basalt; body is regular and calm; mono marks what a machine produced. The fonts are served by the site itself from the `geist` npm package.

### Hierarchy

- **Display** (650, 2.25rem to 5.25rem fluid, line height 1.02, tracking -0.035em): the headline of the first screen, on two lines, and the name of a project at the top of its page.
- **Title** (600, 1.75rem to 2.75rem fluid, line height 1.1, tracking -0.025em): the heading of a section, and the closing headline.
- **Statement** (500, 1.375rem to 2.25rem fluid, line height 1.3, tracking -0.02em): the one large sentence of a section, in Basalt, at most 44rem wide.
- **Lead** (400, 1.0625rem to 1.3125rem fluid, line height 1.5): the lines under a headline or section heading, in Ocean, at most 34rem to 40rem wide.
- **Body** (400, 1rem, line height 1.625): running text, in Ocean when it is secondary and in Basalt when it instructs. Lines keep to 40rem at most.
- **Label** (500, 0.75rem, tracking 0.14em, capitals): a small signal in Deep Amber. The name OPEN-BREACH in the navigation and the footer is set in the same manner, at the fine size and in the text colour (600, tracking 0.16em).
- **Data** (Geist Mono 400, 0.875rem): versions, dates and commands. The value of a badge is mono at the fine size.

Five more tokens carry a size only, with no line height or weight of their own:

- **Reading** (1.0625rem): the longer paragraphs of the mission and of "Why".
- **Control** (0.9375rem): buttons, card taglines, footer links and notes under a heading.
- **Fine** (0.8125rem): badges, the name in the navigation and the footer, and the Copy control.
- **Name** (1.75rem): the name of a project on its card, set at 600 with line height 1 and tracking -0.02em.
- **Name wide** (2.25rem): the name on the wide first card on a desktop screen.

No component holds a literal type size. The smaller headings use the steps of the standard scale: the side heading of a two-column section and the name of a team member (600, 1.25rem, tracking -0.01em), and the name of a step or feature (600, 1.125rem).

### Named Rules

**The Mono Means Data Rule.** Geist Mono is for versions, dates and commands. It is never used for a heading, for running text or for a note about data: the "Sample data" note is a note, so it is set in the sans.

**The Two Labels Rule.** The small amber label in spaced capitals appears in two places, both taken from the mood board by the owner's decision: above the headline of the first screen, and on the project card where it stands alone there. No other section or heading gets one.

Headings wrap balanced, and paragraphs wrap pretty. The name Open-Breach never breaks at its hyphen: wherever content text is set, the name is wrapped so that it stays on one line.

## Layout

Content keeps to one column, 90rem wide at most, with side margins of 1.25rem on a phone, 2rem from 640px and 4.5rem from 1024px. Text and actions stand on the left over the pale ground, and the landscape runs edge to edge below them. Text never lies over the landscape; only a glass card overlaps it.

Sections on a desktop screen use a grid of twelve columns with a 2rem gap. The recurring split is four columns for the heading and eight for the content. Cards stand in a grid with a 1rem gap: one column on a phone, two from 768px, four from 1280px, with the first project spanning the row. Sections are separated by space, 5rem on a phone and 7rem to 8rem on a desktop screen, and by the Mist to Haze gradient, not by boxes.

The first screen fills the height of the viewport and ends on the ocean band. The navigation is fixed at the top left and the page scrolls under it. Below 1024px its entries move behind a menu control, while the name and Install stay visible.

Every page is usable from 360 pixels wide to a wide desktop screen, with no horizontal scrolling, no overlapping content and no text cut off. Every target a finger must hit is at least 44px tall, by its own height or by an invisible extension.

## Elevation & Depth

Depth comes from glass, with one soft shadow under it. The navigation and the cards are translucent panels that soften what lies behind them (a blur of 18px to 22px, saturation 1.15) and are edged with a thin light line. There are two kinds. The bar carries Basalt text only and is clearer (white at 66 per cent). The card also carries secondary and amber text, so it is milkier (white at 88 per cent). The rest of the page is flat: lists and columns are divided by hairlines, not lifted.

### Shadow Vocabulary

- **Glass** (`box-shadow: 0 1px 1px` Basalt at 4 per cent, `0 18px 40px -18px` Basalt at 22 per cent): under every glass panel at rest.
- **Window** (`box-shadow: 0 1px 2px` Basalt at 8 per cent, `0 32px 64px -28px` Basalt at 34 per cent): under a screenshot of a program, which is shown as a window, and under a project card while the pointer is on it.

### Named Rules

**The Glass Fallback Rule.** Where the browser cannot soften what lies behind a panel, the panel falls back to a pale opaque surface (white mixed with 6 per cent Mist) with a Stone edge at 22 per cent, on which its text stays readable. A panel that lies over imagery keeps its text at 4.5 to 1 wherever the image is light or dark.

**The Small Dark Rule.** Basalt and Ocean surfaces stay small against the Mist: the landscape, the water band of the footer, and a control under the pointer. No section of content is set on a dark ground.

## Shapes

Rounded, calm forms and thin lines. Three radii are tokens: controls (0.625rem) for buttons, the menu control, command blocks and notes; panels (1rem) for the navigation and its menu; cards (1.25rem) for glass cards. Chips are full pills. Screenshots have window corners (0.75rem), and badges are small (0.375rem); these two values are used directly and are not tokens.

Every line is 1px. Structural lines are Stone at full strength (the instrument scale, the rule above the three steps); dividers between rows are Stone at 40 per cent; outlines of small pale surfaces are Stone at 60 per cent. Icons are drawn for the site with one stroke of 1.5 on a 16px grid, in the colour of the text around them.

The instrument scale is the recurring geometry: a ruled line with ticks 0.3125rem long hanging from it, one every 3.75rem, and a longer first tick of 0.5rem. Where it stands above columns, the distance from tick to tick is set to the column, so each column hangs from a tick.

## Components

### Buttons

Plain and exact: a rounded rectangle with a medium-weight label, and no shadow.

- **Shape:** control radius (0.625rem). The usual size is at least 2.75rem tall with 1.25rem at the sides and a label at the control size. The small size is 2.25rem tall with 1rem at the sides and a 0.875rem label, with its target extended to 2.75rem.
- **Filled:** Signal Amber with a Basalt label. This is Install, the prominent call to action, and nothing else.
- **Solid:** Basalt with a Mist label. This is the first action of a place where that action is not Install.
- **Outlined:** a 1px Basalt outline and a Basalt label on no fill. This is the second action.
- **Hover / Focus:** filled turns Bright Amber and then Pressed Amber while pressed. Solid turns Ocean under the pointer and while pressed. Outlined inverts to Basalt with a Mist label, and to Ocean while pressed. Text, background and border colours change over 150ms, and nothing else is in the transition. The focus mark is a 2px Basalt ring at a 3px offset, and a Mist ring on Ocean and Basalt.
- **Copy button:** a small outlined control (2rem tall, Stone outline at 60 per cent, white fill) beside a command; it inverts to Basalt under the pointer.

### Chips

- **Style:** an outlined pill, 1.5rem tall, with a 1px Stone outline, no fill and Basalt text at 0.75rem. It names a platform a program runs on.
- **State:** none. A chip is not a control.

### Cards / Containers

- **Corner Style:** card radius (1.25rem).
- **Background:** card glass, as in Elevation & Depth.
- **Shadow Strategy:** the glass shadow at rest, the window shadow under the pointer.
- **Border:** a 1px light edge (white at 90 per cent), which turns Stone under the pointer.
- **Internal Padding:** 1.5rem, and 2rem for the wide card on a desktop screen.
- **Project card:** the name, one line in Ocean, the platform chips, and "Explore" with an arrow in Deep Amber at the foot. The whole card is one link, and the arrow moves when the card is under the pointer or holds the focus. The wide card also shows the program at work: its screenshot as a window that runs off the card's edge.

### Navigation

One rounded glass panel (bar glass, panel radius, 3.5rem tall) at the top left, fixed while the page scrolls. It holds the name in spaced capitals, the entries in Basalt at 0.875rem, and the small filled Install button. An entry is underlined in Stone under the pointer, and the entry of the open page is underlined in Basalt. Below 1024px the entries are in a second glass panel under the bar, opened by a menu control; each entry there is 3rem tall and inverts to Basalt under the pointer. The menu fades in over 500ms and closes on Escape.

### Instrument scale

The signature. A ruled line with tick marks in Stone, 0.5rem tall, which says nothing to assistive technology. It stands between the text and the calls to action (22.5rem wide), above a row of columns with one tick for each column, and at the end of the opening of a project page. On Ocean and Basalt it is drawn in Fog at 55 per cent. On the first screen it draws itself in from the left.

### Badge

Drawn by the site, not loaded from a badge service. Two cells in one outline (Stone at 60 per cent, radius 0.375rem, at least 1.75rem tall): what is measured on the left in Ocean on a pale surface, and its value on the right in Basalt mono, with a small icon where it helps.

### Rows and columns on hairlines

Lists are rows between hairlines (Stone at 40 per cent), not cards. A release row holds the project, the version and the date in mono, and an arrow in Deep Amber; under the pointer the row turns pale white and the arrow moves. Features, team members and install steps stand under a hairline in the same way. The three steps of how the work is done hang from one full-strength rule, each under a tick 0.75rem long.

### Sample note

A quiet note beside data that is a sample and not yet read from its source: the sans at 0.75rem in Ocean. It shows only while the data beside it carries the placeholder marker, and disappears with it.

### Command block

A command is text in the page: Basalt mono at 0.875rem on white, in a Stone outline at 60 per cent with the control radius, with its copy button at the right.

### Footer

Every page ends at the shore and then the water: the shore image edge to edge on Haze, then a band of Ocean with two thin horizontal lines in Fog. The name stands in spaced capitals in Mist, the line under it in Fog, and the links in Mist, underlined in Fog under the pointer.

## Do's and Don'ts

### Do:

- **Do** keep amber for actions and small signals: Signal Amber for fills, Deep Amber for small text.
- **Do** set secondary text in Ocean on the light ground and in Fog on Ocean and Basalt.
- **Do** put a Basalt label on an amber fill.
- **Do** use the solid Basalt button for a first action that is not Install.
- **Do** show the focus mark on every link, button and control: a 2px Basalt ring at a 3px offset, Mist on dark grounds.
- **Do** divide with the instrument scale, hairlines and space before reaching for a box.
- **Do** take every colour, type size and shadow from the theme tokens, and every radius from the three radius tokens unless it is a window corner or a badge.
- **Do** record every image with its source, author and licence before it is used.
- **Do** write everything that moves inside the block for visitors who accept motion, with the exponential ease-out.

### Don't:

- **Don't** add a second accent hue, for any state.
- **Don't** give an amber fill to any action other than Install.
- **Don't** set running text in amber, or fill a large surface with it.
- **Don't** set text in Stone at body sizes, or in Signal Amber at any size.
- **Don't** use green or turquoise in imagery.
- **Don't** use stills from films.
- **Don't** let the page turn heavy or dark. Basalt and Ocean surfaces stay small against the Mist.
- **Don't** build a generic SaaS landing page: no centred headline over a gradient, no grid of icon cards, no wall of claims.
- **Don't** put a small amber label above any heading other than the two the mood board shows.
- **Don't** lay text directly over the landscape. Only a glass card overlaps it.
- **Don't** stack shadows or lift flat content. The glass shadow and the window shadow are the whole vocabulary.
