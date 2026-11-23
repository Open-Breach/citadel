import type { Metadata } from "next";
import { stillToCome } from "@/content/site";
import { SimplePage } from "./simple-page";

/**
 * The page behind a link whose own page is not built yet. It says so and
 * leads back to the front page, so that no link of the site is dead.
 */
export function StillToCome({ name }: { name: string }) {
  return (
    <SimplePage heading={`${name} ${stillToCome.headingAfterName.text}`}>
      {stillToCome.text.text}
    </SimplePage>
  );
}

/** The metadata of a still-to-come page. It asks search engines not to index it. */
export function stillToComeMetadata(name: string): Metadata {
  return {
    title: name,
    description: `${name} ${stillToCome.headingAfterName.text} ${stillToCome.text.text}`,
    robots: { index: false, follow: true },
  };
}
