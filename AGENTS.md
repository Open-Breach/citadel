# Citadel

The website of Open-Breach. Read `README.md` first, then the change you were asked to work on under `openspec/changes/`.

## Rules

- **This repository is public.** Never commit a secret, a certificate, a private key, or the name of a vault or of a certificate in it. They belong in `.env.local`, which git ignores, and in the deployment.
- **One round at a time.** The site is built in rounds, one OpenSpec change per round. Work only on the change Serge asked for, and stop when its tasks are done. He looks at each round running before the next one starts.
- **Decided and proposed.** In the design documents, "decided" marks a decision of Serge's. Do not reopen it; if it causes a problem, say so and wait. "Proposed" marks a suggestion that waits for his yes: follow it unless you find a reason not to, and say so where you depart from it.
- **Design goes through Impeccable.** Use the skill in `.claude/skills/impeccable` for design work. The design documents and the mood board in `docs/design/` are the brief, and the brief wins over the skill's own taste.
- **OpenSpec.** Use the OpenSpec skills to apply, update and archive changes. Tick a task only when its verification has passed.
