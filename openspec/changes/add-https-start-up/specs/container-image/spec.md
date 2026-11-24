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
The container SHALL run as a user that is not root. It SHALL need to write only to its certificate folder and to the folder in which it keeps resized pictures.

#### Scenario: User
- **WHEN** the container is started with its default settings
- **THEN** the site's process has a user id that is not 0

#### Scenario: Ports
- **WHEN** the container runs as that user
- **THEN** it listens on 3000 and 3080, which need no privilege

#### Scenario: Read-only root file system
- **WHEN** the container is started with a read-only root file system and those two folders writable
- **THEN** the site starts and serves its pages and photographs

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

### Requirement: Photographs are resized in the container
The running container SHALL deliver the site's photographs resized for the screen that asks, as AVIF and as WebP, on both platforms and without a service beside it. It SHALL keep a resized picture and deliver it again without resizing it a second time.

#### Scenario: AVIF
- **WHEN** a browser that accepts AVIF asks the running container for the photograph of the first screen
- **THEN** the photograph is delivered as AVIF in the width that was asked for

#### Scenario: WebP
- **WHEN** a browser that accepts WebP and not AVIF asks for the same photograph
- **THEN** the photograph is delivered as WebP

#### Scenario: Asked for again
- **WHEN** the same photograph is asked for a second time in the same size and format
- **THEN** it is delivered from what the container kept

### Requirement: The image is published
Every push to `main` SHALL build the image for both platforms, after the project's checks have passed, and publish it to the configured registry under a name that holds the commit. The registry's address and its login SHALL come from the settings of the repository. They SHALL NOT be in the repository, in a log or in the image.

#### Scenario: Push to main
- **WHEN** a commit is pushed to `main` and the checks pass
- **THEN** the image for that commit is in the registry for both platforms, under a tag made from the commit and under the tag `main`, and the run names the image with its digest

#### Scenario: Checks fail
- **WHEN** a commit is pushed to `main` and a check fails
- **THEN** nothing is published

#### Scenario: Pull request
- **WHEN** a pull request is opened or updated
- **THEN** the checks run and the image is built for both platforms, and nothing is published

#### Scenario: Registry not configured
- **WHEN** the workflow runs where the registry's address or its login is not set
- **THEN** it builds the image, publishes nothing, and says so
