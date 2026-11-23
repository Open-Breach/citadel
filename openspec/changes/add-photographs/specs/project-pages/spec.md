# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Opening photograph
The opening of a project page SHALL end on the photograph of the sea stack, which fades in from the pale background below the opening's text and screenshot. No text SHALL lie over the picture. Every project page SHALL show the same photograph in the same place.

#### Scenario: Rick page
- **WHEN** the Rick page is opened 1440 pixels wide
- **THEN** below the opening's text and screenshot the sea stack spans the page from edge to edge, and its sky passes into the pale background without an edge

#### Scenario: One template
- **WHEN** a second project page is built from the template
- **THEN** it shows the same photograph in the same place
