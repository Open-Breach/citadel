import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { latestReleases, releases } from "@/content/releases";
import { frontPage, site } from "@/content/site";
import { team } from "@/content/team";
import { FrontPage } from "@/features/front-page/front-page";

export const metadata: Metadata = {
  // The front page's title names Open-Breach alone.
  title: { absolute: site.name },
  description: site.description.text,
};

export default function Page() {
  return (
    <FrontPage
      content={frontPage}
      projects={projects}
      releases={latestReleases(releases)}
      team={team}
    />
  );
}
