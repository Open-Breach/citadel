# design-system Specification

## Purpose

Defines the visual language of the site: its colours, surfaces, imagery and type, and how they behave across screen sizes and user settings.

## Requirements

### Requirement: Light scheme with one accent
The site SHALL use a light scheme: pale backgrounds, near-black text and greys between them, with photographs of dark stone and grey water set into it. It SHALL use exactly one accent colour, signal amber. No second accent hue SHALL mark interactive or highlighted elements.

#### Scenario: Front page at first sight
- **WHEN** the front page is opened
- **THEN** the first screen is the photograph of the basalt columns under a pale sky, and the only saturated colour of the interface is amber

#### Scenario: Below the first screen
- **WHEN** the visitor scrolls past the first screen
- **THEN** the background is pale and running text is near-black

#### Scenario: Other states
- **WHEN** a link, a button or a card is hovered, focused or pressed
- **THEN** its change of state uses the greys or amber, and no other hue

### Requirement: Amber marks actions
Amber SHALL be kept for the calls to action and for small signals such as a label above a heading or a link that leads on. Amber SHALL NOT be the colour of running text or of large surfaces. A label that lies over a photograph SHALL be set in the colour of the text beside it and SHALL carry a small amber mark, because small amber text does not hold its contrast on a photograph.

#### Scenario: First screen of the front page
- **WHEN** the first screen of the front page is shown
- **THEN** the Install call to action is the largest amber element on it

#### Scenario: Running text
- **WHEN** a paragraph of text is shown
- **THEN** it is not amber

#### Scenario: Label over a photograph
- **WHEN** the label above the headline of the first screen is shown
- **THEN** its text has the colour of the headline, and a small amber mark stands before it

### Requirement: Glass panels and thin lines
The navigation and the cards SHALL be translucent panels that let what lies behind them show through softened, edged with thin lines. Where the browser cannot soften what lies behind, a panel SHALL fall back to a pale surface on which its text stays readable.

#### Scenario: Navigation over the landscape
- **WHEN** the page is scrolled so that the navigation lies over imagery
- **THEN** the imagery shows through the navigation softened, and the entries stay readable

#### Scenario: No backdrop filter
- **WHEN** the browser does not support backdrop filters
- **THEN** the navigation and the cards have a pale surface and their text meets the contrast requirement

### Requirement: Landscape imagery
The imagery of the site SHALL be photographs of sparse terrain: black stone, grey stone and ocean water. It SHALL show no turquoise and nothing that reads as green. The site SHALL use the four photographs Serge chose and no other: the basalt columns, the rocks in fog, the stacks under an amber sky and the sea stack. No drawn landscape SHALL remain.

#### Scenario: The chosen photographs
- **WHEN** the landscape images of the site are listed
- **THEN** they are the four chosen photographs and nothing else

#### Scenario: Stand-in
- **WHEN** any page of the site is opened
- **THEN** no drawn landscape is shown

#### Scenario: Replacing the stand-in
- **WHEN** the four photographs are in the site
- **THEN** the two drawn landscapes of round one are gone, with their files and their records

#### Scenario: Moss on the sea stack
- **WHEN** the photograph of the sea stack is shown
- **THEN** the patch of moss on the stack does not read as green

### Requirement: Every photograph is recorded
A photograph SHALL be used on the site only when its source, its author, its licence and the changes made to it are recorded in the repository. The record SHALL say that the photograph is not covered by the repository's own licence. Stills from films SHALL NOT be used.

#### Scenario: Photograph without a record
- **WHEN** an image file for the site has no record of source, author and licence
- **THEN** the project's checks fail and name the file

#### Scenario: Changes are recorded
- **WHEN** a photograph was cropped, resized or toned before it was added
- **THEN** its record says so

#### Scenario: Third-party notice
- **WHEN** `THIRD-PARTY-NOTICES.md` is read
- **THEN** it lists each photograph with its source, its author and its licence

#### Scenario: Drawn stand-in
- **WHEN** an image is a stand-in drawn for this site
- **THEN** its record says so, and the checks pass

### Requirement: Readable contrast
Text SHALL meet the contrast of WCAG 2.1 level AA against what is behind it: 4.5 to 1, and 3 to 1 for large text. This holds on panels, on amber and over photographs. Over a photograph it SHALL hold against the picture itself at every screen width, through where the picture is placed and which text colour is used. A veil over the picture SHALL be the last means and SHALL NOT grey the picture out.

#### Scenario: Secondary text
- **WHEN** secondary text is shown on the pale background
- **THEN** its contrast is at least 4.5 to 1

#### Scenario: Label on amber
- **WHEN** a call to action has an amber fill
- **THEN** its label has a contrast of at least 4.5 to 1 against the fill

#### Scenario: Text over the landscape
- **WHEN** text lies over a photograph, at 390, 768, 1440 and 1920 pixels wide
- **THEN** every line of it has at least 4.5 to 1 against the part of the picture it lies over, or 3 to 1 where the text is large

#### Scenario: The contrast is measured
- **WHEN** the project's browser checks run
- **THEN** they measure the contrast of each line of text over a photograph on the rendered page, and fail when a line falls below the requirement

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

### Requirement: Photographs are shown sharp
A photograph SHALL be delivered at the resolution of the screen it is shown on, up to the size of its file, in a current image format with a fallback. Nothing SHALL blur or soften a photograph, except a glass panel that lies over it. The page SHALL keep its layout while a photograph loads.

#### Scenario: Screen with two device pixels per pixel
- **WHEN** the front page is shown 1440 pixels wide on a screen with two device pixels per pixel
- **THEN** the photograph of the first screen is delivered at least 2880 pixels wide

#### Scenario: Phone
- **WHEN** the front page is shown 390 pixels wide
- **THEN** the photograph of the first screen is delivered as a smaller file than at 1440 pixels

#### Scenario: Loading
- **WHEN** a photograph arrives after the text of the page
- **THEN** nothing on the page moves, and no blurred preview of the photograph is shown in its place

#### Scenario: What loads first
- **WHEN** the front page is loaded
- **THEN** the photograph of the first screen is requested with priority, and the photographs further down only as they come near the screen
