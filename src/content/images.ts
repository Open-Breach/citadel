import type { ImageId, ImageRecord } from "./types.ts";

/**
 * The record of every image under `public/images`: where it comes from, who
 * made it and under which licence. An image without a record fails
 * `npm test`. Stills from films are never used.
 */
export const images = {
  landscape: {
    file: "landscape-stand-in.svg",
    width: 1440,
    height: 340,
    description:
      "A drawn landscape: three ridges in light grey, mid grey and near-black over a band of dark ocean.",
    kind: "stand-in",
    source: "Drawn for this site as a stand-in for a photograph that is still to be found.",
    author: "Open-Breach",
    licence: "None yet. The licence of this repository is still to be chosen.",
    usedOn: ["Front page (/)"],
    placeholder: true,
  },
  shore: {
    file: "shore-stand-in.svg",
    width: 1440,
    height: 220,
    description: "A drawn shore: low black rocks and a grey headland at the edge of dark ocean.",
    kind: "stand-in",
    source: "Drawn for this site as a stand-in for a photograph that is still to be found.",
    author: "Open-Breach",
    licence: "None yet. The licence of this repository is still to be chosen.",
    usedOn: ["Every page"],
    placeholder: true,
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
      .filter((record) => !record.source.trim() || !record.author.trim() || !record.licence.trim())
      .map((record) => record.file),
  };
}
