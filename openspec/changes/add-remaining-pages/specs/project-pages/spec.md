# Spec Delta

## ADDED Requirements

### Requirement: A page for each of the five projects
Rick, Meeseeks, Gossip, Trebuchet and Butterbot SHALL each have a project page with every part the project-page template defines.

#### Scenario: Gossip
- **WHEN** `/projects/gossip` is requested
- **THEN** Gossip's page is returned with the status 200, with what it is, why it exists, screenshots, top features, install instructions, badges and the link to its repository

#### Scenario: From the front page
- **WHEN** a visitor activates any of the five cards on the front page
- **THEN** that project's own page opens, and none of them leads to a still-to-come page

### Requirement: Install page of its own
A project whose install instructions are too long for its project page SHALL have them on a page of its own at `/projects/<name>/install`. The project page SHALL then show the shortest way to install and lead to that page for the rest.

#### Scenario: Project with an install page
- **WHEN** a project has an install page and a visitor reaches the install part of its project page
- **THEN** the shortest way to install is shown with a link to the full instructions

#### Scenario: Project without one
- **WHEN** a project has no install page and `/projects/<name>/install` is requested
- **THEN** the not-found page is returned with the status 404
