# Third-party notices

Some files in this repository come from other projects and stay under those projects' licences.

| What | Where | From | Licence |
| --- | --- | --- | --- |
| OpenSpec skills | `.agents/skills/openspec-*`, linked from `.claude/skills/` | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) 2.1.1, written by `openspec init` | MIT, [licenses/openspec/LICENSE](licenses/openspec/LICENSE) |
| Impeccable skill and subagents | `.claude/skills/impeccable/`, `.claude/agents/impeccable-*.md` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) 4.10.0, the Claude Code build at tag `skill-v4.10.0` (commit `b49177d32788f2dc585c42831d845dacf1ebed2c`), copied unchanged | Apache-2.0, [licenses/impeccable/LICENSE](licenses/impeccable/LICENSE) with [NOTICE.md](licenses/impeccable/NOTICE.md) |

To update either, use the project's own tool (`openspec update`, `npx impeccable update`) and change the version in this table.

## Photographs

The landscape photographs of the site are the work of their photographers. They are used under the Unsplash License, which allows using, copying, changing and distributing them without permission and without credit, and forbids selling them unchanged. **They are not covered by the licence of this repository.**

| Photograph | File | Photographer | Source | Licence | Changes |
| --- | --- | --- | --- | --- | --- |
| Basalt columns | `public/images/photographs/basalt-columns.jpg` | Sebastian Spindler | https://unsplash.com/photos/gray-rock-formation-on-gray-sand-during-daytime-ycA729rLQKw | Unsplash License | Resized from 5717 by 3811 to 3840 by 2560 pixels |
| Rocks in fog | `public/images/photographs/rocks-in-fog.jpg` | Mads Eneqvist | https://unsplash.com/photos/a-body-of-water-w2VxnoRrsjE | Unsplash License | None |
| Stacks under an amber sky | `public/images/photographs/stacks-amber-sky.jpg` | Leo_Visions | https://unsplash.com/photos/a-group-of-large-rocks-in-the-ocean-oJX5gsIBOag | Unsplash License | Resized from 8369 by 5448 to 3840 by 2500 pixels |
| Sea stack | `public/images/photographs/sea-stack.jpg` | Joseph Corl | https://unsplash.com/photos/black-sand-beach-with-rock-formations-FV7NJ-bSH6o | Unsplash License | Resized from 4436 by 3378 to 3840 by 2924 pixels; the green and ochre of the moss on the dark rock toned down to grey |

The same facts are in `src/content/images.ts`, which the site reads, and the footer of every page credits the four photographers. Two more of the photographs appear in the reference images under `docs/design/round-two/`.

The screenshots of Rick under `public/images/projects/rick/` come from [Open-Breach/rick](https://github.com/Open-Breach/rick) and are under Apache-2.0.
