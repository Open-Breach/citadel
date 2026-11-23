# Spec Delta

## Purpose

Defines the container image through which the site runs in a cluster, so that a deployment needs to supply only configuration and an identity.

## ADDED Requirements

### Requirement: Default command serves the site
The container image SHALL start the production start when it is run without arguments: HTTPS on port 3000 and the HTTP redirect on port 3080.

#### Scenario: Started without arguments
- **WHEN** the image is started with a vault and its certificates configured and reachable
- **THEN** the site answers over HTTPS on port 3000 and redirects on port 3080

### Requirement: Configuration comes from outside
The image SHALL take the vault, the certificate names and the site's main address from its environment. It SHALL contain no certificate, no private key, and no name of a vault or of a certificate.

#### Scenario: Image inspected
- **WHEN** the files and the environment of the image are inspected
- **THEN** no certificate, key, vault name or certificate name is found

#### Scenario: Two environments
- **WHEN** the same image is started with the configuration of staging and with that of production
- **THEN** each serves with its own certificates, and the image is the same

### Requirement: Unprivileged
The container SHALL run as a user that is not root. It SHALL need to write only to its certificate folder.

#### Scenario: User
- **WHEN** the container is started with its default settings
- **THEN** the site's process has a user id that is not 0

#### Scenario: Ports
- **WHEN** the container runs as that user
- **THEN** it listens on 3000 and 3080, which need no privilege

### Requirement: Supported platforms
The image SHALL build and run on `linux/amd64` and on `linux/arm64`, without one being emulated on the other.

#### Scenario: Arm64
- **WHEN** the image is built on an arm64 machine and started there
- **THEN** the site answers as it does on amd64

### Requirement: The termination signal reaches the site
The container SHALL deliver the termination signal to the site's process, so that the stop defined by the `http-serving` capability takes place when the container is stopped.

#### Scenario: Container stopped
- **WHEN** the container is stopped
- **THEN** the site's process exits with the status 0 within five seconds
