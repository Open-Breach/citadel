import { test } from "node:test";
import type { Project } from "../../src/content/types.ts";

/*
 * TypeScript rejects a project record that misses a field. Each record
 * below misses one, and `@ts-expect-error` makes `npm run typecheck` fail
 * if TypeScript ever stops rejecting it.
 */

// @ts-expect-error A project needs its one line.
export const withoutTagline: Project = {
  slug: "rick",
  name: "Rick",
  platforms: { list: ["Linux"] },
  repository: "https://github.com/Open-Breach/rick",
};

// @ts-expect-error A project needs its repository.
export const withoutRepository: Project = {
  slug: "rick",
  name: "Rick",
  tagline: { text: "A file manager." },
  platforms: { list: ["Linux"] },
};

// @ts-expect-error A project needs its platforms, even when the list is empty.
export const withoutPlatforms: Project = {
  slug: "rick",
  name: "Rick",
  tagline: { text: "A file manager." },
  repository: "https://github.com/Open-Breach/rick",
};

export const withUnknownSlug: Project = {
  // @ts-expect-error Only the five projects have a slug.
  slug: "morty",
  name: "Morty",
  tagline: { text: "Not a project." },
  platforms: { list: [] },
  repository: "https://github.com/Open-Breach/morty",
};

test("the records above are checked by `npm run typecheck`", () => {});
