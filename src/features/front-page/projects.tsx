import { ProjectCard } from "@/components/project-card";
import { Container } from "@/components/ui/container";
import { ScaleRule } from "@/components/ui/scale-rule";
import { SectionHeading } from "@/components/ui/section-heading";
import type { FrontPage } from "@/content/site";
import type { Project } from "@/content/types";

/**
 * A card for each project, in the order the content gives them. The first
 * one spans the row and shows the project at work; the others stand under
 * it, each under a tick of the ruled line.
 */
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
      className="from-mist via-haze/70 to-mist bg-linear-to-b py-20 lg:py-28"
    >
      <Container>
        <SectionHeading id="projects-heading" intro={content.intro.text}>
          {content.heading.text}
        </SectionHeading>
        {/* One tick for each column of cards. */}
        <ScaleRule className="mt-10 md:[--scale-step:calc((100%_+_1rem)/2)] xl:[--scale-step:calc((100%_+_1rem)/4)]" />
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projects.map((project, index) => (
            <li key={project.slug} className={index === 0 ? "md:col-span-2 xl:col-span-4" : ""}>
              <ProjectCard project={project} wide={index === 0} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
