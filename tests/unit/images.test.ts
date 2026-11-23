import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, test } from "node:test";
import { checkImageRecords, images } from "../../src/content/images.ts";
import type { ImageRecord } from "../../src/content/types.ts";

const imageFolder = "public/images";

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [relative(imageFolder, path)];
  });
}

const records: ImageRecord[] = Object.values(images);

describe("every image is recorded", () => {
  test("every file under public/images has a record of source, author and licence", () => {
    const result = checkImageRecords(filesUnder(imageFolder), records);
    assert.deepEqual(result.withoutRecord, [], "image files without a record");
    assert.deepEqual(result.withoutFile, [], "records whose file is missing");
    assert.deepEqual(result.incomplete, [], "records without source, author or licence");
  });

  test("a file without a record fails the check, and the check names the file", () => {
    const result = checkImageRecords([...filesUnder(imageFolder), "film-still.jpg"], records);
    assert.deepEqual(result.withoutRecord, ["film-still.jpg"]);
  });

  test("a record without a licence fails the check", () => {
    const incomplete: ImageRecord = { ...records[0], licence: " " };
    const result = checkImageRecords([incomplete.file], [incomplete]);
    assert.deepEqual(result.incomplete, [incomplete.file]);
  });

  test("the record of a drawn stand-in says that it is one", () => {
    const standIns = records.filter((record) => record.kind === "stand-in");
    assert.ok(standIns.length > 0);
    for (const record of standIns) {
      assert.match(record.source, /stand-in/);
      assert.equal(record.placeholder, true);
    }
  });

  test("no photograph is in use yet, and no still from a film", () => {
    assert.deepEqual(
      records.filter((record) => record.kind === "photograph"),
      [],
    );
  });
});
