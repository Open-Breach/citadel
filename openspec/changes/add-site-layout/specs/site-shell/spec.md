# Spec Delta

## Purpose

Defines what every page of the site shares: the navigation, the footer, the routes that exist, the page metadata and the not-found page.

## ADDED Requirements

### Requirement: Shared navigation
Every page SHALL show the same navigation. It SHALL hold the name Open-Breach as a link to the front page, the entries Projects, Community, Charter and Team, and the Install call to action.

#### Scenario: On the front page
- **WHEN** a visitor opens the front page
- **THEN** the navigation shows Open-Breach, Projects, Community, Charter, Team and Install

#### Scenario: Back to the front page
- **WHEN** a visitor on the Rick page activates the name Open-Breach
- **THEN** the front page opens

#### Scenario: Section of the front page
- **WHEN** a visitor on the Rick page activates Team
- **THEN** the front page opens at its team section

### Requirement: Navigation on small screens
On a narrow screen the navigation entries SHALL be reachable through a menu control that opens and closes them. The name Open-Breach and the Install call to action SHALL stay visible without opening the menu.

#### Scenario: Phone width
- **WHEN** the front page is shown 390 pixels wide
- **THEN** the entries are behind a menu control, and Open-Breach and Install are visible

#### Scenario: Opening the menu
- **WHEN** the visitor activates the menu control
- **THEN** Projects, Community, Charter and Team are shown and each can be activated

#### Scenario: Keyboard
- **WHEN** the visitor uses only the keyboard
- **THEN** the menu control can be focused, opened and closed, and each entry can be reached

### Requirement: Footer
Every page SHALL end with a footer that links to the Open-Breach organisation on GitHub and to the community.

#### Scenario: On the Rick page
- **WHEN** a visitor reaches the end of the Rick page
- **THEN** the footer shows a link to Open-Breach on GitHub and a link to the community

### Requirement: Room for a support link
The navigation and the footer SHALL each have a place for a support link. The link SHALL be shown only when a target for it is configured, and its absence SHALL leave no gap.

#### Scenario: No support target
- **WHEN** no support target is configured
- **THEN** neither the navigation nor the footer shows a support link or an empty space where it would be

#### Scenario: Support target configured
- **WHEN** a support target is configured
- **THEN** the navigation and the footer each show a support link that leads to it

### Requirement: Routes
The site SHALL serve the front page at `/` and a project's page at `/projects/<name>`. A path that is no page of the site SHALL get the not-found page with the status 404.

#### Scenario: Front page
- **WHEN** `/` is requested
- **THEN** the front page is returned with the status 200

#### Scenario: Unknown path
- **WHEN** `/no-such-page` is requested
- **THEN** the not-found page is returned with the status 404, with the navigation and a link to the front page

### Requirement: No dead links to pages that are not built
A link inside the site SHALL never lead to a missing page. Where the page behind a navigation entry or a project card is not built yet, the link SHALL lead to a page that says the page is still to come and links back to the front page.

#### Scenario: Community before it is built
- **WHEN** a visitor activates Community while the Community page does not exist
- **THEN** a page opens that says the page is still to come, with the status 200

#### Scenario: Kept out of search engines
- **WHEN** a still-to-come page is requested
- **THEN** it asks search engines not to index it

### Requirement: Page metadata
Each page SHALL have a title that names the page and Open-Breach, a description, and the language English. The front page's title SHALL name Open-Breach alone.

#### Scenario: Rick page
- **WHEN** the Rick page is requested
- **THEN** its title contains both Rick and Open-Breach, and it has a description of Rick

#### Scenario: Front page
- **WHEN** the front page is requested
- **THEN** its title names Open-Breach, and it has a description of Open-Breach

### Requirement: Nothing is loaded from other hosts
A page SHALL load its fonts, styles, scripts and images from the site itself. Showing a page SHALL cause no request to another host. Links that a visitor follows to another site are not such requests.

#### Scenario: Front page loaded
- **WHEN** the front page is loaded in a browser with the network recorded
- **THEN** every request goes to the site's own host

#### Scenario: Link to GitHub
- **WHEN** the page holds a link to a repository on GitHub
- **THEN** nothing is requested from GitHub until the visitor follows the link
