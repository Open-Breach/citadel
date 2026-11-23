import type { Release } from "./types.ts";

/**
 * Sample release entries, in the shape the data from GitHub will have.
 * Rick's versions and dates follow its changelog; Gossip's date is a sample.
 * A later round replaces this list with data read from GitHub.
 */
export const releases: Release[] = [
  release("rick", "0.4.0", "2026-11-11"),
  release("rick", "0.6.0", "2026-11-20"),
  release("gossip", "0.1.0", "2026-11-19"),
  release("rick", "0.3.0", "2026-11-10"),
  release("rick", "0.5.0", "2026-11-15"),
  release("rick", "0.4.1", "2026-11-14"),
  release("rick", "0.2.0", "2026-11-08"),
];

function release(project: Release["project"], version: string, date: string): Release {
  return {
    project,
    version,
    date,
    url: `https://github.com/Open-Breach/${project}/releases/tag/v${version}`,
    placeholder: true,
  };
}

/** The most recent releases, newest first, at most `limit` of them. */
export function latestReleases(all: Release[], limit = 5): Release[] {
  return [...all].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
