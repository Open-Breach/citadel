# Spec Delta

## Purpose

Defines how the site listens for requests: HTTPS for the pages, plain HTTP only to redirect to HTTPS, and the same answer under every host name.

## ADDED Requirements

### Requirement: Pages are served over HTTPS by the site itself
The production start SHALL serve the built site over HTTPS on its HTTPS port, 3000 unless configured otherwise, terminating TLS itself. It SHALL NOT depend on a proxy or an ingress in front of it for TLS.

#### Scenario: A page
- **WHEN** a client requests `/` over HTTPS on the HTTPS port
- **THEN** the front page is returned with the status 200

#### Scenario: A static file
- **WHEN** a client requests a stylesheet or a font that a page refers to
- **THEN** it is returned with the status 200

#### Scenario: Unknown path
- **WHEN** a client requests a path that is no page
- **THEN** the not-found page is returned with the status 404

### Requirement: Plain HTTP only redirects
The production start SHALL listen for plain HTTP on a second port, 3080 unless configured otherwise. It SHALL answer every request there with a permanent redirect to `https://` with the same host name, path and query, on the site's public HTTPS port, and SHALL serve no content over plain HTTP.

#### Scenario: A page over HTTP
- **WHEN** a client requests `http://open-breach.org/projects/rick?ref=x`
- **THEN** the answer is a permanent redirect to `https://open-breach.org/projects/rick?ref=x`

#### Scenario: Any method
- **WHEN** a client sends a POST over plain HTTP
- **THEN** the answer is the same redirect, and nothing is processed

#### Scenario: A local run
- **WHEN** the public HTTPS port is configured as 14443 and a client requests `http://local.openbreach.dev:14080/`
- **THEN** the answer is a permanent redirect to `https://local.openbreach.dev:14443/`

#### Scenario: No host name
- **WHEN** a request over plain HTTP names no host, or a host that is not a valid host name
- **THEN** the answer has the status 400 and no redirect

### Requirement: Every host name is accepted
The site SHALL answer every request with the same pages whatever host name it was sent to. It SHALL NOT redirect from one host name to another.

#### Scenario: Another domain
- **WHEN** a client requests `/` with the host `open-breach.com`
- **THEN** the front page is returned with the status 200, the same as under `openbreach.dev`

#### Scenario: With and without www
- **WHEN** a client requests `/` with the host `www.openbreach.dev`
- **THEN** the front page is returned and the client is not redirected to `openbreach.dev`

### Requirement: Listening address
Both listeners SHALL accept connections on every address of the machine, IPv4 and IPv6, unless one address is configured. On a machine without IPv6 they SHALL listen on IPv4 alone and say so at start. The address SHALL NOT be taken from the `HOSTNAME` variable, which a container runtime sets to the container's name.

#### Scenario: IPv4 and IPv6
- **WHEN** the site starts on a machine with IPv6 and no address configured
- **THEN** it answers on `127.0.0.1` and on `::1`

#### Scenario: One address configured
- **WHEN** the address `127.0.0.1` is configured
- **THEN** the site answers on `127.0.0.1` and refuses connections on `::1`

#### Scenario: Started in a pod
- **WHEN** the runtime has set `HOSTNAME` to the pod's name
- **THEN** the site still listens on every address

### Requirement: Stop on request
On a termination signal the production start SHALL stop accepting connections, let the requests in progress finish, and exit with success within five seconds.

#### Scenario: Stopped by the cluster
- **WHEN** the process receives the termination signal while idle
- **THEN** it exits with the status 0

#### Scenario: A request in progress
- **WHEN** the process receives the termination signal while it answers a request that finishes within five seconds
- **THEN** that request is answered before the process exits

### Requirement: Health path
The site SHALL answer `GET /healthz` over HTTPS with the status 200 and a short text, without rendering a page and without reaching the vault. Over plain HTTP the path SHALL be redirected like every other path.

#### Scenario: Probe
- **WHEN** a cluster requests `/healthz` over HTTPS on the HTTPS port, without checking the name on the certificate
- **THEN** the answer has the status 200

#### Scenario: Over plain HTTP
- **WHEN** `/healthz` is requested over plain HTTP
- **THEN** the answer is the redirect to HTTPS
