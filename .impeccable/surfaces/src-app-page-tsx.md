---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/projects/[name]/page.tsx"]
---

# Front page and project page

Scope: the front page (`/`) and the project page (`/projects/<name>`, built first for Rick). Visitor mode: Persuade.

## Audience and job

People who might install an Open-Breach tool. On the front page they learn what Open-Breach is and find a project. On a project page they see the project, learn why it exists, and install it.

- Primary action: Install. Second action: Join the discussion.
- Proof on hand: the projects themselves, Rick's screenshots and README, the statement that the work is done with Claude.
- Would feel wrong (Serge, 2026-11-23): heavy or dark; a generic SaaS landing page.
- Texts, landscape, releases, badge values and the team entries are placeholders in round one.

## Direction contract

THESIS: Precise, light technology standing in raw terrain. The page is a pale instrument panel laid over a coastline of black and grey stone, and the tools are shown as themselves. It refuses the start-up hero: no centred headline over a gradient, no grid of icon cards, no wall of claims.

OWN-WORLD (round two: photographs replace the drawn landscape): four photographs of black stone and grey water set into a pale page; each fades in from the ground with no edge, except the first, which is the first screen. Mist ground that darkens towards the land. Basalt type, heavy and tight for display. Stone hairlines. Glass panels: milky, softened backdrop, thin light edge, soft offset shadow. The instrument scale, a ruled line with tick marks, is the system's divider and measure. Signal amber only on actions and small signals. Labels in spaced capitals; versions, dates and commands in mono. The photographs are shown sharp and are never blurred or veiled. No green, no turquoise.

STORY: The visitor understands that Open-Breach makes open tools, in the open, with Claude, with no commercial interest. They see the five projects, pick one, see it at work, read why it exists, and install it or join the discussion.

FIRST VIEWPORT: As on `docs/design/round-two/first-screen.jpg` at 1440 by 900 (round two, decided). The photograph of the basalt columns fills the screen from edge to edge, about 1600 pixels wide, anchored left and centred vertically, behind everything. Top left, the navigation as one rounded glass panel. On the rock: a small label in Mist with an amber square before it, the two-line headline at about 84px in Mist, two lines in Mist, the instrument scale in Mist, then Install (filled amber, dark label) and Join the discussion (outlined in Mist). On the right, over the wave, the glass card for Rick. No veil over the photograph. At 390 wide the same order in one column over rock and sand, the card under the buttons.

FORM: seed: none (pinned). "Board B and design.md are the brief. Do not pick another direction." Built code-led. In round two the reference for the first screen is `docs/design/round-two/first-screen.jpg`, and `photograph-fading-in.jpg` shows how a photograph fades in. Both are previews made by a script and are not measured comps. Signature interaction: the instrument scale draws itself in on load, ticks in sequence. Motion grammar: short exponential ease-out, fades and small lifts only; with reduced motion, fades only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Answered in round two: the Rick card stays on the first screen, and the label above the headline stays (decided, although Impeccable bans such a label). Over a photograph the label has the colour of the text beside it and a small amber square.
- Text over a photograph is decided for the first screen and the mission statement. Its contrast is measured by the browser checks at 390, 768, 1440 and 1920 pixels wide.
