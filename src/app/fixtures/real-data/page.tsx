import { projects } from "@/content/projects";
import { latestReleases, releases } from "@/content/releases";
import { frontPage } from "@/content/site";
import { team } from "@/content/team";
import { FrontPage } from "@/features/front-page/front-page";

/** The front page while its release entries are real data: they carry no placeholder marker. */
export default function RealDataFixture() {
  const real = latestReleases(releases).map((release) => ({ ...release, placeholder: undefined }));
  return <FrontPage content={frontPage} projects={projects} releases={real} team={team} />;
}
