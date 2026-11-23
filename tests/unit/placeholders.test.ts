import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, test } from "node:test";
import { contentSources, images } from "../../src/content/index.ts";
import { formatPlaceholders, listPlaceholders } from "../../src/content/placeholders.ts";
import { projects } from "../../src/content/projects.ts";

const list = listPlaceholders(contentSources, images);
const rickPage = "Rick page (/projects/rick)";

/** Counts the placeholder markers in a value, without the listing's own code. */
function countMarkers(value: unknown): number {
  if (Array.isArray(value)) return value.reduce((sum: number, item) => sum + countMarkers(item), 0);
  if (value === null || typeof value !== "object") return 0;
  const record = value as Record<string, unknown>;
  if (record.placeholder === true) return 1;
  return Object.values(record).reduce((sum: number, item) => sum + countMarkers(item), 0);
}

describe("npm run placeholders", () => {
  test("lists Rick's texts and names the Rick page", () => {
    const rick = projects[0].page!;
    for (const text of [rick.what.text, rick.why.paragraphs[0].text, rick.features[0].name.text]) {
      const entry = list.find((item) => item.what === text);
      assert.ok(entry, `listed: ${text}`);
      assert.equal(entry.page, rickPage);
      assert.match(entry.where, /^src\/content\/projects\.ts › projects\.rick\.page\./);
    }
  });

  test("lists every marker in the content", () => {
    const inContent = contentSources.reduce((sum, source) => sum + countMarkers(source.data), 0);
    const listed = list.filter((item) => item.kind !== "image").length;
    assert.equal(listed, inContent);
    assert.ok(inContent > 0);
  });

  test("lists every placeholder image with the pages that use it", () => {
    const listed = list.filter((item) => item.kind === "image");
    const expected = Object.values(images)
      .filter((record) => record.placeholder)
      .reduce((sum, record) => sum + record.usedOn.length, 0);
    assert.equal(listed.length, expected);
    assert.ok(listed.some((item) => item.page === rickPage && /readme-light\.png/.test(item.what)));
    assert.ok(listed.some((item) => /landscape-stand-in\.svg/.test(item.what)));
  });

  test("lists sample data: the releases and the badge values", () => {
    assert.ok(list.some((item) => item.kind === "data" && /version: 0\.6\.0/.test(item.what)));
    assert.ok(list.some((item) => item.kind === "data" && /stars:/.test(item.what)));
  });

  test("lists the install commands and the download links, which nobody has run yet", () => {
    assert.ok(list.some((item) => item.what.startsWith("curl -fsSL https://get.openbreach.dev/install.sh")));
    assert.ok(list.some((item) => item.kind === "data" && /label: Windows x64/.test(item.what)));
  });

  test("says so when no placeholder is left", () => {
    const none = listPlaceholders(
      [{ page: "Front page (/)", file: "x.ts", name: "x", data: { heading: { text: "Final" } } }],
      {},
    );
    assert.deepEqual(none, []);
    assert.match(formatPlaceholders(none), /^Placeholders: none\./);
  });

  test("the command succeeds and prints the listing", () => {
    const output = execFileSync(process.execPath, ["scripts/placeholders.ts"], {
      encoding: "utf8",
    });
    assert.match(output, new RegExp(rickPage.replace(/[()/]/g, "\\$&")));
    assert.match(output, new RegExp(`Placeholders: ${list.length} \\(`));
  });
});
