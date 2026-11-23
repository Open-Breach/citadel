# Spec Delta

## ADDED Requirements

### Requirement: Canonical address
Every page SHALL name its own address under the site's main address as its canonical address, whatever host name the request was sent to.

#### Scenario: Reached under another domain
- **WHEN** the Rick page is requested with the host `open-breach.com`
- **THEN** the page names `/projects/rick` under the main address as its canonical address

#### Scenario: Reached under the main address
- **WHEN** the Rick page is requested under the main address
- **THEN** the page names that same address as its canonical address
