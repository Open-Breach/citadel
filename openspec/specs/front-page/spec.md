# front-page Specification

## Purpose

Defines what a visitor finds on the front page: what Open-Breach is, its projects, who is behind them, and what to do next.

## Requirements

### Requirement: Introduction and mission
The front page SHALL open with what Open-Breach is and what it is about, and SHALL carry a mission statement for Open-Breach as an organisation.

#### Scenario: First screen
- **WHEN** a visitor opens the front page
- **THEN** the first screen says what Open-Breach is in a headline and a sentence or two, without scrolling

#### Scenario: Mission
- **WHEN** the visitor reads on
- **THEN** a mission statement says what Open-Breach is for

### Requirement: Two calls to action
The front page SHALL offer two calls to action: Install, and Join the discussion, which asks for feedback. Both SHALL be on the first screen. Install SHALL be the more prominent of the two.

#### Scenario: First screen
- **WHEN** the front page is opened
- **THEN** Install and Join the discussion are both visible without scrolling

#### Scenario: Install
- **WHEN** the visitor activates Install
- **THEN** they arrive where the projects and their install instructions are reached

#### Scenario: Join the discussion
- **WHEN** the visitor activates Join the discussion
- **THEN** they arrive at the community

### Requirement: A card for each project
The front page SHALL show one card for each of the five projects, in this order: Rick, Meeseeks, Gossip, Trebuchet, Butterbot. A card SHALL show the project's name and one line on what it is, and for a program the platforms it runs on. A card SHALL lead to the project's page.

#### Scenario: Five cards
- **WHEN** the visitor reaches the projects section
- **THEN** five cards are shown, for Rick, Meeseeks, Gossip, Trebuchet and Butterbot in that order

#### Scenario: Rick's card
- **WHEN** the visitor activates Rick's card
- **THEN** the Rick page opens

#### Scenario: The whole card is the link
- **WHEN** the visitor activates any part of a card
- **THEN** the project's page opens, and a keyboard user reaches the card as one link

### Requirement: Built with Claude
The front page SHALL say that the projects of Open-Breach are built with Claude.

#### Scenario: Statement present
- **WHEN** the visitor reads the front page
- **THEN** a statement says that the work is done with Claude

### Requirement: Latest releases
The front page SHALL list the most recent releases across the five projects, newest first. An entry SHALL show the project, the version and the date, and SHALL lead to that release. The list SHALL hold at most five entries.

#### Scenario: Several releases
- **WHEN** the projects have more than five releases between them
- **THEN** the five newest are listed, the newest at the top

#### Scenario: No releases known
- **WHEN** no release is known
- **THEN** the section is left out, and the page shows no empty list

### Requirement: The team
The front page SHALL have a section about the team that lists people only, each with a name, a role and one line. It SHALL NOT list an AI as a member of the team.

#### Scenario: Two people
- **WHEN** the team has two people
- **THEN** the section shows both, each with name, role and one line

#### Scenario: Reached from the navigation
- **WHEN** the visitor activates Team in the navigation
- **THEN** the page shows the team section
