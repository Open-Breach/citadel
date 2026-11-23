import type { FrontPage as FrontPageContent } from "@/content/site";
import type { Project, Release, TeamMember } from "@/content/types";
import { BuiltWithClaude } from "./built-with-claude";
import { Closing } from "./closing";
import { Hero } from "./hero";
import { LatestReleases } from "./latest-releases";
import { Mission } from "./mission";
import { Projects } from "./projects";
import { Team } from "./team";

/** The front page, in the order of design D9. The footer follows in the layout. */
export function FrontPage({
  content,
  projects,
  releases,
  team,
}: {
  content: FrontPageContent;
  projects: Project[];
  /** The releases to show: sorted newest first, five at most. */
  releases: Release[];
  team: TeamMember[];
}) {
  const featured =
    projects.find((project) => project.slug === content.hero.featuredProject) ?? projects[0];

  return (
    <main id="content">
      <Hero content={content.hero} featured={featured} />
      <Mission content={content.mission} />
      <Projects content={content.projects} projects={projects} />
      <BuiltWithClaude content={content.claude} />
      <LatestReleases content={content.releases} releases={releases} projects={projects} />
      <Team content={content.team} team={team} />
      <Closing content={content.closing} />
    </main>
  );
}
