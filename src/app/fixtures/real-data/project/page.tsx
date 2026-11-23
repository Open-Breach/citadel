import { ProjectPage } from "@/features/project-page/project-page";
import { secondProject } from "../../project/second-project";

/** A project page while its badge values are real data: they carry no placeholder marker. */
export default function RealDataProjectFixture() {
  const page = { ...secondProject.page!, badges: { ...secondProject.page!.badges, placeholder: undefined } };
  return <ProjectPage project={secondProject} page={page} />;
}
