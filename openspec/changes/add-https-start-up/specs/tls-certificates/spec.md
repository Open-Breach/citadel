# Spec Delta

## Purpose

Defines where the site's TLS certificates come from, how they are kept on disk, and which certificate the site presents for a host name.

## ADDED Requirements

### Requirement: Certificates come from the vault at every start
At every start the site SHALL download each configured certificate, with its private key, from the configured Azure Key Vault. It SHALL authenticate with the identity of the place it runs in: the developer's Azure login on a developer machine, the pod's workload identity in a cluster. It SHALL hold no credential of its own.

#### Scenario: Start in a cluster
- **WHEN** the site starts in a pod whose identity may read the configured certificates
- **THEN** it downloads each one and serves TLS with them

#### Scenario: Start on a developer machine
- **WHEN** a developer who is logged in to Azure starts the site
- **THEN** the certificates are downloaded with that login, and no secret is asked for or stored

### Requirement: Stored formats
The site SHALL accept a certificate that the vault stores as PEM and one that it stores as PKCS#12 without a password. In both cases it SHALL serve the leaf certificate first, followed by the rest of its chain.

#### Scenario: PEM
- **WHEN** a configured certificate is stored as PEM with its key and chain
- **THEN** the site serves TLS with that key and chain

#### Scenario: PKCS#12
- **WHEN** a configured certificate is stored as PKCS#12 without a password
- **THEN** the site serves TLS with the key and chain it holds, the leaf first

### Requirement: Private keys are protected
A private key that the site writes to disk SHALL be readable by the user the site runs as and by no one else. The place it is written to SHALL be ignored by git. The site SHALL never write a private key or any part of one to its log.

#### Scenario: File permissions
- **WHEN** the site has written a certificate's key to disk
- **THEN** the key file and its folder are accessible to their owner only

#### Scenario: Log
- **WHEN** a certificate has been downloaded
- **THEN** the log names the certificate, its version and its expiry date, and holds no key material

### Requirement: The certificate matches the host name asked for
With several certificates configured, the site SHALL present the one whose names cover the host name the client asks for: an exact name, or a wildcard that covers exactly one further label. With no match, or when the client names no host, it SHALL present the first configured certificate.

#### Scenario: Subdomain under a wildcard
- **WHEN** a client asks for `www.openbreach.dev` and a configured certificate holds `*.openbreach.dev`
- **THEN** that certificate is presented

#### Scenario: Another domain
- **WHEN** a client asks for `open-breach.com` and a configured certificate holds `open-breach.com`
- **THEN** that certificate is presented, not the first one

#### Scenario: Bare domain
- **WHEN** a client asks for `openbreach.dev` and a certificate holds only `*.openbreach.dev`
- **THEN** that certificate does not count as a match for the bare name

#### Scenario: Unknown name
- **WHEN** a client asks for a name that no configured certificate covers
- **THEN** the first configured certificate is presented

#### Scenario: No name
- **WHEN** a client names no host in its TLS greeting
- **THEN** the first configured certificate is presented

### Requirement: No start without the certificates
When a configured certificate cannot be downloaded or read, the site SHALL NOT start. It SHALL say which certificate failed and why. It SHALL NOT start with only some of the configured certificates.

#### Scenario: Name not in the vault
- **WHEN** one of three configured certificate names does not exist in the vault
- **THEN** the start ends with an error that names that certificate, and nothing listens

#### Scenario: No login
- **WHEN** the site is started on a developer machine with no Azure login
- **THEN** the start ends with an error that says how to log in

### Requirement: Rollover by restart
The site SHALL read the certificates at start only. A new version of a certificate in the vault SHALL be served from the next start on.

#### Scenario: Renewed certificate
- **WHEN** a certificate has been renewed in the vault and the site is restarted
- **THEN** the site presents the renewed certificate

#### Scenario: No restart
- **WHEN** a certificate has been renewed in the vault and the site has not been restarted
- **THEN** the site still presents the certificate it started with

### Requirement: Certificates already on disk
When no vault is configured and the certificate folder already holds a key and a certificate, the production start SHALL serve TLS with that pair. When no vault is configured and there is no such pair, it SHALL NOT start.

#### Scenario: Pair mounted into a container
- **WHEN** the container starts with no vault configured and a key and certificate mounted into its certificate folder
- **THEN** the site serves TLS with that pair

#### Scenario: Nothing to serve with
- **WHEN** the site starts with no vault configured and an empty certificate folder
- **THEN** the start ends with an error that says a certificate is missing
