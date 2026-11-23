import { ProjectCard } from "@/components/project-card";
import { Container } from "@/components/ui/container";
import { ScaleRule } from "@/components/ui/scale-rule";
import { SectionHeading } from "@/components/ui/section-heading";
import type { FrontPage } from "@/content/site";
import type { Project } from "@/content/types";

/** A card for each project, in the order the content gives them. */
export function Projects({
  content,
  projects,
}: {
  content: FrontPage["projects"];
  projects: Project[];
}) {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="from-mist via-haze/70 to-mist bg-linear-to-b py-24 lg:py-32"
    >
      <Container>
        <SectionHeading id="projects-heading" intro={content.intro.text}>
          {content.heading.text}
        </SectionHeading>
        <ScaleRule className="mt-10" />
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {projects.map((project, index) => (
            <li key={project.slug} className={index === 0 ? "md:col-span-2 xl:col-span-1" : ""}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
