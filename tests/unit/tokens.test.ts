import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import {
  contrast,
  over,
  readColorTokens,
  readGlassOpacity,
  type Rgb,
} from "./lib/color.ts";

const t = readColorTokens();

describe("tokens of design D7", () => {
  test("the five colours of board B have the values of the board", () => {
    const hex = (rgb: Rgb) =>
      "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
    assert.equal(hex(t.mist), "#F5F7F8");
    assert.equal(hex(t.stone), "#8A9096");
    assert.equal(hex(t.basalt), "#1E2124");
    assert.equal(hex(t.ocean), "#3E4A55");
    assert.equal(hex(t.amber), "#FF8A1F");
  });

  test("there is a darker amber for text", () => {
    assert.ok(t["amber-deep"], "amber-deep is defined");
  });
});

describe("readable contrast", () => {
  // Glass over the darkest part of the landscape, which is Basalt.
  const glass = over(t.white, readGlassOpacity(".glass"), t.basalt);
  const glassCard = over(t.white, readGlassOpacity(".glass-card"), t.basalt);
  // The surface a glass panel falls back to without backdrop filters.
  const fallback = over(t.white, 0.94, t.mist);

  // Every pair of text colour and background that the site uses.
  const textPairs: [string, Rgb, string, Rgb][] = [
    ["basalt", t.basalt, "mist", t.mist],
    ["basalt", t.basalt, "haze", t.haze],
    ["ocean", t.ocean, "mist", t.mist],
    ["ocean", t.ocean, "haze", t.haze],
    ["amber-deep", t["amber-deep"], "mist", t.mist],
    ["amber-deep", t["amber-deep"], "haze", t.haze],
    ["basalt", t.basalt, "amber", t.amber],
    ["basalt", t.basalt, "amber-bright", t["amber-bright"]],
    ["basalt", t.basalt, "amber-pressed", t["amber-pressed"]],
    ["mist", t.mist, "ocean", t.ocean],
    ["fog", t.fog, "ocean", t.ocean],
    ["mist", t.mist, "basalt", t.basalt],
    ["fog", t.fog, "basalt", t.basalt],
    ["basalt", t.basalt, "white", t.white],
    ["ocean", t.ocean, "white", t.white],
    ["amber-deep", t["amber-deep"], "white", t.white],
    ["basalt", t.basalt, "glass over the darkest image", glass],
    ["basalt", t.basalt, "glass card over the darkest image", glassCard],
    ["ocean", t.ocean, "glass card over the darkest image", glassCard],
    ["amber-deep", t["amber-deep"], "glass card over the darkest image", glassCard],
    ["basalt", t.basalt, "glass fallback", fallback],
    ["ocean", t.ocean, "glass fallback", fallback],
    ["amber-deep", t["amber-deep"], "glass fallback", fallback],
  ];

  for (const [fgName, fg, bgName, bg] of textPairs) {
    test(`${fgName} on ${bgName} is at least 4.5 to 1`, () => {
      const ratio = contrast(fg, bg);
      assert.ok(ratio >= 4.5, `${ratio.toFixed(2)} to 1`);
    });
  }

  test("stone on mist is enough for lines and large text only", () => {
    const ratio = contrast(t.stone, t.mist);
    assert.ok(ratio >= 3, `${ratio.toFixed(2)} to 1`);
    assert.ok(ratio < 4.5, "stone is not a colour for running text");
  });

  test("amber on mist is too low for text, so the darker amber exists", () => {
    assert.ok(contrast(t.amber, t.mist) < 3);
  });
});

/** Colour values that only the stylesheet may hold. */
export function findColorValues(source: string): string[] {
  const found: string[] = [];
  const patterns = [
    /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi,
    /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(/gi,
    /\b(?:fill|stroke|stop-color|flood-color)=["'](?!none|currentColor|url\()[^"']+["']/gi,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) found.push(match[0]);
  }
  return found;
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

describe("colours live in the stylesheet only", () => {
  test("no source file holds a colour value of its own", () => {
    const offenders = sourceFiles("src").flatMap((file) =>
      findColorValues(readFileSync(file, "utf8")).map((value) => `${file}: ${value}`),
    );
    assert.deepEqual(offenders, []);
  });

  test("the check finds a colour value when there is one", () => {
    assert.deepEqual(findColorValues('<p className="text-[#ff0000]">'), ["#ff0000"]);
    assert.deepEqual(findColorValues("style={{ color: 'rgb(1 2 3)' }}"), ["rgb("]);
    assert.deepEqual(findColorValues('<path fill="red" />'), ['fill="red"']);
    assert.deepEqual(findColorValues('<a href="/#team"><path fill="currentColor" />'), []);
  });
});
