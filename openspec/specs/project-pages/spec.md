# project-pages Specification

## Purpose

Defines how an Open-Breach project is presented as a product on a page of its own, so that a visitor understands what it is, sees it, and can install it.

## Requirements

### Requirement: A page for a project
The site SHALL serve a project's page at `/projects/<name>`, where the name is the project's name in lower case. A project whose page is not built yet SHALL get the still-to-come page. A name that is no project SHALL get the not-found page.

#### Scenario: Rick
- **WHEN** `/projects/rick` is requested
- **THEN** the Rick page is returned with the status 200

#### Scenario: A project without a page yet
- **WHEN** `/projects/gossip` is requested before the Gossip page is built
- **THEN** the still-to-come page is returned with the status 200

#### Scenario: No such project
- **WHEN** `/projects/no-such-project` is requested
- **THEN** the not-found page is returned with the status 404

### Requirement: What it is and why it exists
A project page SHALL open with what the project is and SHALL say why it exists. Both SHALL be written for someone who might use the project, in the spirit of the project's README.

#### Scenario: Top of the Rick page
- **WHEN** a visitor opens the Rick page
- **THEN** the first screen says what Rick is

#### Scenario: Why
- **WHEN** the visitor reads on
- **THEN** a part of the page says why Rick exists

### Requirement: Screenshots
A project page SHALL show several screenshots of the project, each with a text alternative that says what it shows. A screenshot SHALL be viewable larger than it is shown in the page. The larger view SHALL fit the screen at every width, so that nothing has to be moved sideways.

#### Scenario: Gallery
- **WHEN** the visitor reaches the screenshots on the Rick page
- **THEN** at least three screenshots are shown

#### Scenario: Text alternative
- **WHEN** the page is read with a screen reader
- **THEN** each screenshot is announced with what it shows

#### Scenario: Larger view
- **WHEN** the visitor activates a screenshot
- **THEN** it is shown larger, and the larger view can be closed with the keyboard

#### Scenario: Larger view on a phone
- **WHEN** the visitor activates a screenshot on a screen 390 pixels wide
- **THEN** the whole screenshot is shown within the width of the screen, and nothing scrolls sideways

### Requirement: Top features
A project page SHALL list the project's top features, each with a name and one or two sentences. The list SHALL be a selection, not everything the project can do.

#### Scenario: Feature list
- **WHEN** the visitor reaches the features on the Rick page
- **THEN** between three and eight features are shown, each with a name and a short description

### Requirement: Install instructions
A project page SHALL say how to install the project, for each platform the project runs on. A command to run SHALL be shown as text that can be selected and copied. A command or a download SHALL be shown only for a way of installing that works on the day the page is released. A way that is announced but not published SHALL be named as still to come, without a command.

#### Scenario: A platform's instructions
- **WHEN** the visitor reaches the install part of the Rick page
- **THEN** the steps for each platform Rick runs on are shown

#### Scenario: Copying a command
- **WHEN** an install step is a command
- **THEN** the command is text in the page, not an image, and can be copied

#### Scenario: A way that is not published yet
- **WHEN** the package repository of Open-Breach is not published
- **THEN** the Rick page shows no command for it and says that this way of installing is still to come

#### Scenario: Downloads
- **WHEN** a download is shown for a platform
- **THEN** it leads to a file of the project's latest release

### Requirement: Badges drawn by the site
A project page SHALL show the project's version, build status, licence and number of stars as badges. The site SHALL draw the badges itself, in its own style. A badge SHALL NOT be an image loaded from another host.

#### Scenario: Four badges
- **WHEN** the Rick page is shown
- **THEN** it shows a badge each for version, build status, licence and stars

#### Scenario: No badge service
- **WHEN** the Rick page is loaded with the network recorded
- **THEN** no badge is requested from another host

### Requirement: Link to the source
A project page SHALL link to the project's repository on GitHub.

#### Scenario: Repository link
- **WHEN** the visitor activates the link to the source on the Rick page
- **THEN** Rick's repository on GitHub opens

### Requirement: One template for every project
Every project page SHALL have the same parts in the same order. Giving a project a page SHALL need the project's texts, screenshots and facts only, and no layout made for that project.

#### Scenario: A second project
- **WHEN** the content of a second project is added
- **THEN** its page has the same parts in the same order as the Rick page, with no change to the layout code

### Requirement: Opening photograph
The opening of a project page SHALL end on the photograph of the sea stack, which fades in from the pale background below the opening's text and screenshot. No text SHALL lie over the picture. Every project page SHALL show the same photograph in the same place.

#### Scenario: Rick page
- **WHEN** the Rick page is opened 1440 pixels wide
- **THEN** below the opening's text and screenshot the sea stack spans the page from edge to edge, and its sky passes into the pale background without an edge

#### Scenario: One template
- **WHEN** a second project page is built from the template
- **THEN** it shows the same photograph in the same place
