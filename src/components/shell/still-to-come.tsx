import type { Metadata } from "next";
import { ArrowOutIcon } from "@/components/ui/icons";
import { stillToCome, ui } from "@/content/site";
import type { Project } from "@/content/types";
import { SimplePage } from "./simple-page";
import { Text } from "@/components/ui/text";

/**
 * The page behind a link whose own page is not built yet. It says so and
 * leads back to the front page, so that no link of the site is dead. For a
 * project it also says what the project is and where its source is.
 */
export function StillToCome({ name, project }: { name: string; project?: Project }) {
  return (
    <SimplePage
      heading={`${name} ${stillToCome.headingAfterName.text}`}
      aside={
        project ? (
          <p className="text-basalt mt-8 max-w-[34rem]">
            <Text>{project.tagline.text}</Text>{" "}
            <a
              href={project.repository}
              className="decoration-stone inline-flex items-center gap-1 rounded-sm font-medium underline underline-offset-[0.3em] hover:decoration-basalt"
            >
              {project.name} {ui.onGithub.text}
              <ArrowOutIcon />
            </a>
          </p>
        ) : null
      }
    >
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
