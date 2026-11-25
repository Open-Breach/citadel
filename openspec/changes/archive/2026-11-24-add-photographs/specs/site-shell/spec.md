# Spec Delta

## MODIFIED Requirements

### Requirement: Shared navigation
Every page SHALL show the same navigation. It SHALL hold the name Open-Breach as a link to the front page, the entries Projects, Community, Charter and Team, and the Install call to action. Install SHALL lead to the projects section of the front page, except on a project page, where it SHALL lead to that page's install instructions.

#### Scenario: On the front page
- **WHEN** a visitor opens the front page
- **THEN** the navigation shows Open-Breach, Projects, Community, Charter, Team and Install

#### Scenario: Back to the front page
- **WHEN** a visitor on the Rick page activates the name Open-Breach
- **THEN** the front page opens

#### Scenario: Section of the front page
- **WHEN** a visitor on the Rick page activates Team
- **THEN** the front page opens at its team section

#### Scenario: Install on the front page
- **WHEN** a visitor on the front page activates Install in the navigation
- **THEN** the page moves to its projects section

#### Scenario: Install on a project page
- **WHEN** a visitor on the Rick page activates Install in the navigation
- **THEN** the page moves to Rick's install instructions, and the visitor stays on the Rick page

### Requirement: Footer
Every page SHALL end with a footer that links to the Open-Breach organisation on GitHub and to the community. The footer SHALL credit the photographers of the site's photographs by name, each name linking to the source of the photograph.

#### Scenario: On the Rick page
- **WHEN** a visitor reaches the end of the Rick page
- **THEN** the footer shows a link to Open-Breach on GitHub and a link to the community

#### Scenario: Credits
- **WHEN** the footer is read
- **THEN** it names the four photographers, and each name leads to the page the photograph comes from

## ADDED Requirements

### Requirement: Closing photograph
Every page SHALL end, above the footer, with a band that shows the photograph of the stacks under the amber sky. Its sky SHALL pass into the pale background above it without an edge. No text SHALL lie over the band.

#### Scenario: On the front page
- **WHEN** a visitor reaches the end of the front page
- **THEN** the stacks under the amber sky span the page from edge to edge above the footer

#### Scenario: On every page
- **WHEN** a visitor reaches the end of the Rick page or of the not-found page
- **THEN** the same band is shown there

#### Scenario: No text on it
- **WHEN** the band is shown at any width
- **THEN** no text lies over the photograph

### Requirement: Sample data is marked
Where a page shows data that carries the placeholder marker, such as release entries or badge values, a visible note with the words "Sample data" SHALL stand beside it. The note SHALL NOT be shown beside data that is real.

#### Scenario: Sample releases
- **WHEN** the release entries of the front page carry the placeholder marker
- **THEN** the note "Sample data" is shown beside the list

#### Scenario: Real data
- **WHEN** the data of a list or of a badge carries no placeholder marker
- **THEN** no such note is shown beside it
