# Spec Delta

## MODIFIED Requirements

### Requirement: Dev start
`npm run dev` SHALL download the certificate for openbreach.dev from the configured vault and start the site for development over HTTPS at `https://local.openbreach.dev:14443`. It SHALL show changes to the source without a restart. It SHALL NOT start over plain HTTP: without a certificate it does not start.

#### Scenario: Logged in and configured
- **WHEN** a developer who is logged in to Azure and has the vault and the certificate named in `.env.local` runs `npm run dev`
- **THEN** the front page answers at `https://local.openbreach.dev:14443` with the status 200, with a certificate the browser accepts

#### Scenario: Editing a page
- **WHEN** the developer changes a text in the source while the dev server runs
- **THEN** the browser shows the change without the server being restarted

#### Scenario: Nothing configured
- **WHEN** `npm run dev` runs with no vault named
- **THEN** it does not start, and says which settings are missing and where they are set

#### Scenario: Another address
- **WHEN** the developer sets another host name or port for the dev server
- **THEN** the dev server answers there instead
