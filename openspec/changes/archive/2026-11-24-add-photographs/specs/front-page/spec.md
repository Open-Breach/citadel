# Spec Delta

## MODIFIED Requirements

### Requirement: Introduction and mission
The front page SHALL open with what Open-Breach is and what it is about, set over the photograph of the basalt columns, which fills the first screen. It SHALL carry a mission statement for Open-Breach as an organisation, with the photograph of the rocks in fog behind it.

#### Scenario: First screen
- **WHEN** a visitor opens the front page
- **THEN** the first screen says what Open-Breach is in a headline and a sentence or two, without scrolling

#### Scenario: Photograph of the first screen
- **WHEN** the front page is opened 1440 pixels wide
- **THEN** the photograph fills the first screen from edge to edge behind the navigation, the text and the project card, and the headline and the lines under it lie on the dark rock in light text

#### Scenario: First screen on a phone
- **WHEN** the front page is opened 390 pixels wide
- **THEN** the photograph fills the first screen, and it is placed so that all of the text lies on the rock

#### Scenario: Mission
- **WHEN** the visitor reads on
- **THEN** a mission statement says what Open-Breach is for, the fog of the photograph behind it passes into the pale background above it without an edge, and the rocks of the photograph close the section

## ADDED Requirements

### Requirement: One project on the first screen
The first screen of the front page SHALL show a glass card for one project, Rick, with its name, its one line, the platforms it runs on and a link to its page. The card SHALL lie over the photograph.

#### Scenario: The card
- **WHEN** the front page is opened 1440 pixels wide
- **THEN** a glass card for Rick lies over the photograph, and its text meets the contrast requirement

#### Scenario: To the Rick page
- **WHEN** the visitor activates the link on the card
- **THEN** the Rick page opens
