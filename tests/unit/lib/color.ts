// WCAG 2.1 contrast, and the tokens of the global stylesheet.
import { readFileSync } from "node:fs";

export type Rgb = [number, number, number];

export function parseHex(hex: string): Rgb {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Not a six-digit hex colour: ${hex}`);
  const value = match[1];
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** A colour at the given opacity over a background. */
export function over(top: Rgb, opacity: number, background: Rgb): Rgb {
  return top.map((c, i) => c * opacity + background[i] * (1 - opacity)) as Rgb;
}

export const stylesheetPath = "src/app/globals.css";

/** The colour tokens of the theme, by name: { mist: [245, 247, 248], ... }. */
export function readColorTokens(css = readFileSync(stylesheetPath, "utf8")) {
  const tokens: Record<string, Rgb> = {};
  for (const [, name, hex] of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)) {
    tokens[name] = parseHex(hex);
  }
  return tokens;
}

/**
 * The share of white in a glass surface, read from the rule that turns the
 * surface translucent where backdrop filters work.
 */
export function readGlassOpacity(
  selector: ".glass" | ".glass-card",
  css = readFileSync(stylesheetPath, "utf8"),
): number {
  const supports = css.slice(css.indexOf("@supports ((backdrop-filter"));
  const rule = new RegExp(
    `\\${selector} \\{\\s*background-color: color-mix\\(in srgb, var\\(--color-white\\) (\\d+)%, transparent\\)`,
  ).exec(supports);
  if (!rule) throw new Error(`No translucent background found for ${selector}`);
  return Number(rule[1]) / 100;
}
