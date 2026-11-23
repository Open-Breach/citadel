# Third-party notices

Some files in this repository come from other projects and stay under those projects' licences.

| What | Where | From | Licence |
| --- | --- | --- | --- |
| OpenSpec skills | `.agents/skills/openspec-*`, linked from `.claude/skills/` | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) 2.1.1, written by `openspec init` | MIT, [licenses/openspec/LICENSE](licenses/openspec/LICENSE) |
| Impeccable skill and subagents | `.claude/skills/impeccable/`, `.claude/agents/impeccable-*.md` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) 4.10.0, the Claude Code build at tag `skill-v4.10.0` (commit `b49177d32788f2dc585c42831d845dacf1ebed2c`), copied unchanged | Apache-2.0, [licenses/impeccable/LICENSE](licenses/impeccable/LICENSE) with [NOTICE.md](licenses/impeccable/NOTICE.md) |

To update either, use the project's own tool (`openspec update`, `npx impeccable update`) and change the version in this table.
