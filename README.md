# Citadel

Citadel is the website of [Open-Breach](https://github.com/Open-Breach), at openbreach.dev. It presents Open-Breach and its five projects, Rick, Meeseeks, Gossip, Trebuchet and Butterbot, as products: what each one is, why it exists, what it looks like and how to install it.

## Status

Design stage. There is no code yet. The site is specified as [OpenSpec](https://github.com/Fission-AI/OpenSpec) changes and is built in rounds, one change per round. Serge looks at each round running before the next one starts.

| Change | What it is | State |
| --- | --- | --- |
| [add-site-layout](openspec/changes/add-site-layout/) | Round one: the project's frame, the design system, the front page and the Rick page, over plain HTTP on localhost | Ready to build |
| [add-https-start-up](openspec/changes/add-https-start-up/) | The switch to HTTPS: certificates from Azure Key Vault picked by host name, the HTTP to HTTPS redirect, the container image | Waits for the certificates |
| [add-remaining-pages](openspec/changes/add-remaining-pages/) | The other four project pages, Community, Charter, data from GitHub, the real photographs | Provisional, revised after the review of round one |

Each change has a proposal (what and why), a design (how, and what is still open), specs (the behaviour, one file per capability) and tasks (the plan).

## Design

The look is decided: light, modern and technical, set against sparse landscape, with signal amber as the one accent. The chosen mood board is [docs/design/mood-board-b.png](docs/design/mood-board-b.png), and the design decisions are in the [design of round one](openspec/changes/add-site-layout/design.md).

## Tools in this repository

- **OpenSpec**: the `openspec/` folder and the OpenSpec skills for Claude Code.
- **Impeccable**: the design skill and its subagents for Claude Code. Its design hook is not installed.

[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) says where each comes from and under which licence.
