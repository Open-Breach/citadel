import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StillToCome, stillToComeMetadata } from "@/components/shell/still-to-come";
import { findProject, projects } from "@/content/projects";
import { ProjectPage } from "@/features/project-page/project-page";

/*
 * A name that is no project has to be answered with the status 404, and the
 * status is sent before the page. So this route is static as a whole: the
 * five pages are built ahead of time, and a request for any other name
 * waits for its result instead of streaming a shell with the status 200.
 */
export const ensureStatic = "navigation";

// The route waits for its name on purpose, so the check for instant navigation is off for it.
export const instant = false;

/** The five projects. Any other name under /projects/ is not found. */
export function generateStaticParams() {
  return projects.map((project) => ({ name: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[name]">): Promise<Metadata> {
  const { name } = await params;
  const project = findProject(name);
  if (!project) return {};
  if (!project.page) return stillToComeMetadata(project.name);
  return { title: project.name, description: project.page.description.text };
}

export default async function Page({ params }: PageProps<"/projects/[name]">) {
  const { name } = await params;
  const project = findProject(name);
  if (!project) notFound();
  // A project whose page is not built yet gets the still-to-come page.
  if (!project.page) return <StillToCome name={project.name} project={project} />;
  return <ProjectPage project={project} page={project.page} />;
}
