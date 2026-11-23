import type { ImageId, ImageRecord } from "./types.ts";

/**
 * The record of every image under `public/images`: where it comes from, who
 * made it, under which licence, and what was done to the file. An image
 * without a record fails `npm test`. Stills from films are never used.
 *
 * The landscape imagery of the site is the four photographs Serge chose,
 * and nothing else. They are not covered by the licence of this repository.
 */
export const images = {
  basaltColumns: {
    file: "photographs/basalt-columns.jpg",
    width: 3840,
    height: 2560,
    description:
      "Black basalt columns rising from a beach of black sand, with a wave breaking behind them under a pale sky.",
    kind: "photograph",
    source:
      "https://unsplash.com/photos/gray-rock-formation-on-gray-sand-during-daytime-ycA729rLQKw",
    author: "Sebastian Spindler",
    licence: "Unsplash License",
    changes: "Resized from 5717 by 3811 to 3840 by 2560 pixels.",
    coveredByRepositoryLicence: false,
    tone: "basalt",
    usedOn: ["Front page (/)"],
  },
  rocksInFog: {
    file: "photographs/rocks-in-fog.jpg",
    width: 3479,
    height: 1957,
    description: "Dark wet rocks leading out into still water that dissolves in fog.",
    kind: "photograph",
    source: "https://unsplash.com/photos/a-body-of-water-w2VxnoRrsjE",
    author: "Mads Eneqvist",
    licence: "Unsplash License",
    changes: "None. The file is the original, 3479 by 1957 pixels.",
    coveredByRepositoryLicence: false,
    tone: "haze",
    usedOn: ["Front page (/)"],
  },
  stacksAmberSky: {
    file: "photographs/stacks-amber-sky.jpg",
    width: 3840,
    height: 2500,
    description: "Three black sea stacks in a rough blue-grey sea under an amber sky.",
    kind: "photograph",
    source: "https://unsplash.com/photos/a-group-of-large-rocks-in-the-ocean-oJX5gsIBOag",
    author: "Leo_Visions",
    licence: "Unsplash License",
    changes: "Resized from 8369 by 5448 to 3840 by 2500 pixels.",
    coveredByRepositoryLicence: false,
    tone: "haze",
    usedOn: ["Every page"],
  },
  seaStack: {
    file: "photographs/sea-stack.jpg",
    width: 3840,
    height: 2924,
    description:
      "A pointed black sea stack standing in smooth grey water off a beach of black sand, with a dark cliff on the left.",
    kind: "photograph",
    source: "https://unsplash.com/photos/black-sand-beach-with-rock-formations-FV7NJ-bSH6o",
    author: "Joseph Corl",
    licence: "Unsplash License",
    changes:
      "Resized from 4436 by 3378 to 3840 by 2924 pixels. The green of the moss on the stack and on the cliff is toned down to grey.",
    coveredByRepositoryLicence: false,
    tone: "haze",
    usedOn: ["Every project page"],
  },
  rickLight: {
    file: "projects/rick/readme-light.png",
    width: 2520,
    height: 1380,
    description:
      "Rick with two panes side by side and the preview pane showing a 3D model of a pig.",
    kind: "screenshot",
    source:
      "https://github.com/Open-Breach/rick/blob/f28c813446ad30799727a822af5f26c965977e20/docs/screenshots/readme-light.png, copied unchanged.",
    author: "The Rick contributors",
    licence: "Apache-2.0",
    changes: "None. Copied unchanged.",
    usedOn: ["Rick page (/projects/rick)"],
    placeholder: true,
  },
  rickDark: {
    file: "projects/rick/readme-dark.png",
    width: 2520,
    height: 1380,
    description:
      "Rick in its dark theme, with two panes side by side and the preview pane showing a 3D model of a pig.",
    kind: "screenshot",
    source:
      "https://github.com/Open-Breach/rick/blob/f28c813446ad30799727a822af5f26c965977e20/docs/screenshots/readme-dark.png, copied unchanged.",
    author: "The Rick contributors",
    licence: "Apache-2.0",
    changes: "None. Copied unchanged.",
    usedOn: ["Rick page (/projects/rick)"],
    placeholder: true,
  },
  rickFrame: {
    file: "projects/rick/screenshot-frame.svg",
    width: 2520,
    height: 1380,
    description: "An empty window frame, standing in for a screenshot of Rick that is still to be chosen.",
    kind: "stand-in",
    source: "Drawn for this site as a stand-in for a screenshot that is still to be chosen.",
    author: "Open-Breach",
    licence: "None yet. The licence of this repository is still to be chosen.",
    changes: "None. Drawn for this site.",
    usedOn: ["Rick page (/projects/rick)"],
    placeholder: true,
  },
} satisfies Record<ImageId, ImageRecord>;

export function image(id: ImageId): ImageRecord & { src: string } {
  const record = (images as Record<ImageId, ImageRecord>)[id];
  if (!record) throw new Error(`No image record with the id "${id}"`);
  return { ...record, src: `/images/${record.file}` };
}

/** The image files that have no record, and the records whose file is missing. */
export function checkImageRecords(files: string[], records: ImageRecord[]) {
  const recorded = new Set(records.map((record) => record.file));
  const present = new Set(files);
  return {
    withoutRecord: files.filter((file) => !recorded.has(file)),
    withoutFile: records.map((record) => record.file).filter((file) => !present.has(file)),
    incomplete: records
      .filter(
        (record) =>
          !record.source.trim() ||
          !record.author.trim() ||
          !record.licence.trim() ||
          !record.changes?.trim() ||
          // A photograph also says that the repository's licence does not cover it.
          (record.kind === "photograph" && record.coveredByRepositoryLicence !== false),
      )
      .map((record) => record.file),
  };
}

/** The photographs of the site, in the order the footer credits them. */
export function photographs(): ImageRecord[] {
  return (Object.values(images) as ImageRecord[]).filter((record) => record.kind === "photograph");
}
