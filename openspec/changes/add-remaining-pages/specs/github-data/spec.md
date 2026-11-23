# Spec Delta

## Purpose

Defines how the site gets the latest releases and the facts on the badges from GitHub without making its pages depend on GitHub being reachable.

## ADDED Requirements

### Requirement: Read by the server
The releases and the facts on the badges (version, build status, licence and stars) SHALL be read from GitHub by the site's server. A visitor's browser SHALL make no request to GitHub.

#### Scenario: A new release
- **WHEN** a project publishes a release on GitHub
- **THEN** the front page lists it and the project's version badge shows it, without a change to the site

#### Scenario: Browser stays on the site
- **WHEN** a page with releases and badges is loaded with the network recorded
- **THEN** every request goes to the site's own host

### Requirement: Kept for a while
The site SHALL keep what it has read and SHALL ask GitHub again for the same facts at most once an hour.

#### Scenario: Many visitors
- **WHEN** a page is requested a hundred times within a minute
- **THEN** GitHub is asked at most once for each fact

#### Scenario: After an hour
- **WHEN** more than an hour has passed since a fact was read
- **THEN** the next request for the page leads to a fresh read, and the visitor does not wait for it

### Requirement: GitHub out of reach
When GitHub cannot be reached or refuses, every page SHALL still be served. The site SHALL show the last facts it read, and where it has none it SHALL leave the affected badge or the releases section out.

#### Scenario: GitHub fails after a successful read
- **WHEN** GitHub cannot be reached and the facts were read earlier
- **THEN** the pages show the earlier facts with the status 200

#### Scenario: GitHub has never answered
- **WHEN** GitHub cannot be reached and nothing was read before
- **THEN** the pages are served with the status 200, without the releases section and without the badges that have no value

### Requirement: Public data only
The site SHALL read only what GitHub publishes about the public repositories of Open-Breach, and SHALL need no credential for it.

#### Scenario: No credential configured
- **WHEN** the site runs with no credential for GitHub
- **THEN** the releases and the badges are shown
