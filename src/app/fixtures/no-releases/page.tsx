import { projects } from "@/content/projects";
import { frontPage } from "@/content/site";
import { team } from "@/content/team";
import { FrontPage } from "@/features/front-page/front-page";

/** The front page while no release is known. */
export default function NoReleasesFixture() {
  return <FrontPage content={frontPage} projects={projects} releases={[]} team={team} />;
}
