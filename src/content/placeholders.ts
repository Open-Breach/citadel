import type { ContentSource } from "./index.ts";
import type { ImageRecord } from "./types.ts";

export type Placeholder = {
  /** The page that shows it. */
  page: string;
  /** Where it is defined: the file and the path inside it. */
  where: string;
  kind: "text" | "data" | "image";
  /** The text itself, or a description of the data or image. */
  what: string;
};

function describe(value: Record<string, unknown>): Pick<Placeholder, "kind" | "what"> {
  if (typeof value.text === "string") return { kind: "text", what: value.text };
  const facts = Object.entries(value)
    .filter(([key, v]) => key !== "placeholder" && typeof v !== "object")
    .map(([key, v]) => `${key}: ${String(v)}`);
  return { kind: "data", what: facts.length > 0 ? facts.join(", ") : "still to be supplied" };
}

function walk(value: unknown, path: string, found: (path: string, value: Record<string, unknown>) => void) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, found));
    return;
  }
  if (value === null || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  if (record.placeholder === true) {
    found(path, record);
    return;
  }
  for (const [key, child] of Object.entries(record)) walk(child, `${path}.${key}`, found);
}

/** Every placeholder marker in the content and the image records. */
export function listPlaceholders(
  sources: ContentSource[],
  imageRecords: Record<string, ImageRecord>,
): Placeholder[] {
  const list: Placeholder[] = [];
  for (const source of sources) {
    walk(source.data, source.name, (path, value) => {
      list.push({ page: source.page, where: `${source.file} › ${path}`, ...describe(value) });
    });
  }
  for (const [id, record] of Object.entries(imageRecords)) {
    if (record.placeholder !== true) continue;
    for (const page of record.usedOn) {
      list.push({
        page,
        where: `src/content/images.ts › ${id}`,
        kind: "image",
        what: `public/images/${record.file}: ${record.description}`,
      });
    }
  }
  return list;
}

/** The listing as `npm run placeholders` prints it. */
export function formatPlaceholders(list: Placeholder[]): string {
  if (list.length === 0) return "Placeholders: none. Every text and image is final.";

  const pages = [...new Set(list.map((item) => item.page))];
  const lines: string[] = [];
  for (const page of pages) {
    const items = list.filter((item) => item.page === page);
    lines.push(`${page}: ${items.length}`);
    for (const item of items) {
      lines.push(`  [${item.kind}] ${item.what}`);
      lines.push(`          ${item.where}`);
    }
    lines.push("");
  }
  const count = (kind: Placeholder["kind"]) => list.filter((item) => item.kind === kind).length;
  lines.push(
    `Placeholders: ${list.length} (${count("text")} texts, ${count("data")} data entries, ${count("image")} images) on ${pages.length} pages.`,
  );
  return lines.join("\n");
}
