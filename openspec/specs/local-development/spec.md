# local-development Specification

## Purpose

Defines how the site is started and checked on a developer machine, so that anyone with the repository can run it and see their changes.

## Requirements

### Requirement: Dev start
`npm run dev` SHALL start the site for development over plain HTTP at `http://localhost:3000` and SHALL show changes to the source without a restart. It SHALL need nothing but the installed packages: no account, no vault, no certificate and no secret.

#### Scenario: Clean checkout
- **WHEN** a developer runs `npm install` and then `npm run dev` on a clean checkout
- **THEN** the front page answers at `http://localhost:3000` with the status 200

#### Scenario: Editing a page
- **WHEN** the developer changes a text in the source while the dev server runs
- **THEN** the browser shows the change without the server being restarted

### Requirement: Checks
`npm run build`, `npm run lint`, `npm run typecheck` and `npm test` SHALL each succeed on a clean checkout. After `npm install`, none of them SHALL need access to the network.

#### Scenario: Build without the network
- **WHEN** `npm run build` runs on a machine that can reach no other host
- **THEN** the build succeeds

#### Scenario: A failing check
- **WHEN** a source file has a type error
- **THEN** `npm run typecheck` fails and names the file

### Requirement: Placeholders are listed
Every placeholder text and placeholder image in the site SHALL be marked as one where it is defined. `npm run placeholders` SHALL list every placeholder with where it is used, so that none is published unnoticed.

#### Scenario: Listing
- **WHEN** `npm run placeholders` runs while the Rick page's texts are placeholders
- **THEN** the output lists those texts and names the Rick page

#### Scenario: Nothing left
- **WHEN** no placeholder is left in the site
- **THEN** the output says so and the command succeeds

### Requirement: Setup is documented
The repository's README SHALL say how to install, start and check the site, and where a page's content is changed.

#### Scenario: Following the README
- **WHEN** someone new to the repository follows the README on a machine with Node.js
- **THEN** the site runs locally without further help
