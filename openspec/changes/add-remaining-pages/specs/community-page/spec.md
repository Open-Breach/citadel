# Spec Delta

## Purpose

Defines the page that leads a visitor to the Open-Breach community, which lives in GitHub Discussions, and says how to take part.

## ADDED Requirements

### Requirement: The way to the community
The site SHALL serve a Community page at `/community`. The page SHALL say that the community meets in GitHub Discussions and what it is for: questions, ideas and feedback. It SHALL lead there with one clearly marked link.

#### Scenario: Opening the page
- **WHEN** a visitor activates Community in the navigation or Join the discussion on the front page
- **THEN** the Community page opens with the status 200

#### Scenario: Going to the discussions
- **WHEN** the visitor activates the link to the discussions
- **THEN** Open-Breach's discussions on GitHub open

### Requirement: Ways to take part
The Community page SHALL say how to report a bug in a project and how to contribute to one, and SHALL lead to the place for each.

#### Scenario: Reporting a bug in Rick
- **WHEN** a visitor looks for how to report a bug in Rick
- **THEN** the page leads to Rick's issues on GitHub

#### Scenario: Contributing
- **WHEN** a visitor looks for how to contribute
- **THEN** the page says how and leads to the projects' repositories
