import { ProjectPage } from "@/features/project-page/project-page";
import { secondProject } from "./second-project";

/** A second project through the one project page template. */
export default function ProjectFixture() {
  return <ProjectPage project={secondProject} page={secondProject.page!} />;
}
