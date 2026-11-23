import type { Project, ProjectPage as ProjectPageContent } from "@/content/types";
import { Features } from "./features";
import { Install } from "./install";
import { Opening } from "./opening";
import { Screenshots } from "./screenshots";
import { Source } from "./source";
import { Why } from "./why";

/**
 * The one template of every project page. It has the same parts in the same
 * order for every project, and takes nothing but the project's content.
 */
export function ProjectPage({ project, page }: { project: Project; page: ProjectPageContent }) {
  return (
    <main>
      <Opening project={project} page={page} />
      <Why page={page} />
      <Screenshots page={page} />
      <Features page={page} />
      <Install project={project} page={page} />
      <Source project={project} page={page} />
    </main>
  );
}
