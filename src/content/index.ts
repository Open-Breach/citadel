import { images } from "./images.ts";
import { projects } from "./projects.ts";
import { releases } from "./releases.ts";
import {
  calls,
  footer,
  frontPage,
  navigation,
  notFound,
  projectPage,
  site,
  stillToCome,
  ui,
} from "./site.ts";
import { team } from "./team.ts";

export type ContentSource = {
  /** The page that shows the content. */
  page: string;
  /** Where the content is defined. */
  file: string;
  /** The name of the content inside that file. */
  name: string;
  data: unknown;
};

const everyPage = "Every page";
const frontPageName = "Front page (/)";

/** The name of a project's page, as the placeholder listing shows it. */
export function projectPageName(name: string, slug: string): string {
  return `${name} page (/projects/${slug})`;
}

/**
 * All content of the site, with the page that shows it. `npm run
 * placeholders` walks through these and lists every marker it finds.
 * Images name their pages themselves, in their records.
 */
export const contentSources: ContentSource[] = [
  { page: everyPage, file: "src/content/site.ts", name: "site", data: site },
  { page: everyPage, file: "src/content/site.ts", name: "calls", data: calls },
  { page: everyPage, file: "src/content/site.ts", name: "navigation", data: navigation },
  { page: everyPage, file: "src/content/site.ts", name: "ui", data: ui },
  { page: everyPage, file: "src/content/site.ts", name: "footer", data: footer },
  { page: "Not-found page", file: "src/content/site.ts", name: "notFound", data: notFound },
  {
    page: "Still-to-come pages",
    file: "src/content/site.ts",
    name: "stillToCome",
    data: stillToCome,
  },
  { page: frontPageName, file: "src/content/site.ts", name: "frontPage", data: frontPage },
  {
    page: "Every project page",
    file: "src/content/site.ts",
    name: "projectPage",
    data: projectPage,
  },
  ...projects.flatMap((project) => {
    const { page, ...card } = project;
    const sources: ContentSource[] = [
      {
        page: frontPageName,
        file: "src/content/projects.ts",
        name: `projects.${project.slug}`,
        data: card,
      },
    ];
    if (page) {
      sources.push({
        page: projectPageName(project.name, project.slug),
        file: "src/content/projects.ts",
        name: `projects.${project.slug}.page`,
        data: page,
      });
    }
    return sources;
  }),
  { page: frontPageName, file: "src/content/releases.ts", name: "releases", data: releases },
  { page: frontPageName, file: "src/content/team.ts", name: "team", data: team },
];

export { images };
