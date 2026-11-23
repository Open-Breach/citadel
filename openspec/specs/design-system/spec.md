# design-system Specification

## Purpose

Defines the visual language of the site: its colours, surfaces, imagery and type, and how they behave across screen sizes and user settings.

## Requirements

### Requirement: Light scheme with one accent
The site SHALL use a light scheme: pale backgrounds, near-black text and greys between them. It SHALL use exactly one accent colour, signal amber. No second accent hue SHALL mark interactive or highlighted elements.

#### Scenario: Front page at first sight
- **WHEN** the front page is opened
- **THEN** the background is pale, the headline is near-black, and the only saturated colour is amber

#### Scenario: Other states
- **WHEN** a link, a button or a card is hovered, focused or pressed
- **THEN** its change of state uses the greys or amber, and no other hue

### Requirement: Amber marks actions
Amber SHALL be kept for the calls to action and for small signals such as a label above a heading or a link that leads on. Amber SHALL NOT be the colour of running text or of large surfaces.

#### Scenario: First screen of the front page
- **WHEN** the first screen of the front page is shown
- **THEN** the Install call to action is the largest amber element on it

#### Scenario: Running text
- **WHEN** a paragraph of text is shown
- **THEN** it is not amber

### Requirement: Glass panels and thin lines
The navigation and the cards SHALL be translucent panels that let what lies behind them show through softened, edged with thin lines. Where the browser cannot soften what lies behind, a panel SHALL fall back to a pale surface on which its text stays readable.

#### Scenario: Navigation over the landscape
- **WHEN** the page is scrolled so that the navigation lies over imagery
- **THEN** the imagery shows through the navigation softened, and the entries stay readable

#### Scenario: No backdrop filter
- **WHEN** the browser does not support backdrop filters
- **THEN** the navigation and the cards have a pale surface and their text meets the contrast requirement

### Requirement: Landscape imagery
The imagery of the site SHALL show sparse terrain: black stone, grey stone and ocean water. It SHALL contain no green and no turquoise. The finished site SHALL use photographs. Until photographs are chosen, a drawn stand-in in the same tones and proportions SHALL take their place.

#### Scenario: Stand-in
- **WHEN** no photograph has been chosen for the front page's landscape
- **THEN** a drawn landscape in greys, near-black and dark ocean blue-grey fills the same space

#### Scenario: Replacing the stand-in
- **WHEN** a photograph replaces the stand-in
- **THEN** the layout around it does not change

### Requirement: Every photograph is recorded
A photograph SHALL be used on the site only when its source, its author and its licence are recorded in the repository. Stills from films SHALL NOT be used.

#### Scenario: Photograph without a record
- **WHEN** an image file for the site has no record of source, author and licence
- **THEN** the project's checks fail and name the file

#### Scenario: Drawn stand-in
- **WHEN** an image is a stand-in drawn for this site
- **THEN** its record says so, and the checks pass

### Requirement: Readable contrast
Text SHALL meet the contrast of WCAG 2.1 level AA against what is behind it: 4.5 to 1, and 3 to 1 for large text. This holds for text on panels, on amber and over imagery.

#### Scenario: Secondary text
- **WHEN** secondary text is shown on the pale background
- **THEN** its contrast is at least 4.5 to 1

#### Scenario: Label on amber
- **WHEN** a call to action has an amber fill
- **THEN** its label has a contrast of at least 4.5 to 1 against the fill

#### Scenario: Text over the landscape
- **WHEN** text lies over imagery
- **THEN** a panel or a tone behind the text keeps its contrast at 4.5 to 1 or more wherever the image is light or dark

### Requirement: Layout adapts to the screen
Every page SHALL be usable from 360 pixels wide to a wide desktop screen: no horizontal scrolling of the page, no overlapping content, and no text cut off.

#### Scenario: Phone
- **WHEN** a page is shown 390 pixels wide
- **THEN** its content is in one column and the page does not scroll sideways

#### Scenario: Desktop
- **WHEN** a page is shown 1440 pixels wide
- **THEN** its content uses the width in several columns where the content has several items

### Requirement: Visible keyboard focus
Every link, button and control SHALL show a clearly visible focus mark when it is reached with the keyboard.

#### Scenario: Tabbing to a call to action
- **WHEN** the visitor moves the focus to the Install call to action with the Tab key
- **THEN** a focus mark is visible around it, with a contrast of at least 3 to 1 against what is next to it

### Requirement: Reduced motion
Where the visitor's system asks for reduced motion, the site SHALL show no movement beyond short fades.

#### Scenario: Reduced motion requested
- **WHEN** the system setting for reduced motion is on
- **THEN** nothing slides, scales, drifts or moves with scrolling
