import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
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
    assert.deepEqual(
      standIns.map((record) => record.file),
      ["projects/rick/screenshot-frame.svg"],
      "no drawn landscape remains",
    );
    for (const record of standIns) {
      assert.match(record.source, /stand-in/);
      assert.equal(record.placeholder, true);
    }
  });

  test("the photographs are the four Serge chose, each with its facts", () => {
    const photographs = records.filter((record) => record.kind === "photograph");
    assert.deepEqual(
      photographs.map((record) => [record.file, record.author]),
      [
        ["photographs/basalt-columns.jpg", "Sebastian Spindler"],
        ["photographs/rocks-in-fog.jpg", "Mads Eneqvist"],
        ["photographs/stacks-amber-sky.jpg", "Leo_Visions"],
        ["photographs/sea-stack.jpg", "Joseph Corl"],
      ],
    );
    for (const record of photographs) {
      assert.match(record.source, /^https:\/\/unsplash\.com\/photos\//);
      assert.equal(record.licence, "Unsplash License");
      assert.equal(record.coveredByRepositoryLicence, false);
      assert.ok(record.changes.trim().length > 0);
      assert.ok(record.width <= 3840, "at most 3840 pixels wide");
      assert.notEqual(record.placeholder, true, "a chosen photograph is no placeholder");
    }
    assert.match(photographs[3].changes, /moss.*toned down to grey/);
    assert.match(photographs[0].changes, /^Resized/);
  });

  test("a photograph without a source, an author, a licence or its changes fails the check", () => {
    const photograph = records.find((record) => record.kind === "photograph")!;
    for (const field of ["source", "author", "licence", "changes"] as const) {
      const incomplete: ImageRecord = { ...photograph, [field]: "" };
      const result = checkImageRecords([incomplete.file], [incomplete]);
      assert.deepEqual(result.incomplete, [incomplete.file], `without ${field}`);
    }
    const unmarked: ImageRecord = { ...photograph, coveredByRepositoryLicence: undefined };
    assert.deepEqual(checkImageRecords([unmarked.file], [unmarked]).incomplete, [unmarked.file]);
    assert.deepEqual(checkImageRecords([photograph.file], [photograph]).incomplete, []);
  });

  test("the files are what their records say", () => {
    for (const record of records.filter((r) => r.kind === "photograph")) {
      // A JPEG starts with FF D8 and carries its size in a start-of-frame marker.
      const bytes = readFileSync(join(imageFolder, record.file));
      assert.equal(bytes[0], 0xff);
      assert.equal(bytes[1], 0xd8);
      let at = 2;
      let size: [number, number] | undefined;
      while (at < bytes.length && !size) {
        const marker = bytes[at + 1];
        const length = bytes.readUInt16BE(at + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          size = [bytes.readUInt16BE(at + 7), bytes.readUInt16BE(at + 5)];
        }
        at += 2 + length;
      }
      assert.deepEqual(size, [record.width, record.height], record.file);
    }
  });

  test("no still from a film is in use", () => {
    assert.ok(records.every((record) => !/film|movie/i.test(record.source)));
  });
});
