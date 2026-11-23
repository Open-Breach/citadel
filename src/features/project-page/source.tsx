import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowOutIcon } from "@/components/ui/icons";
import { ScaleRule } from "@/components/ui/scale-rule";
import { calls, projectPage, ui } from "@/content/site";
import type { Project, ProjectPage } from "@/content/types";

/** The link to the project's repository on GitHub, and the way to the discussion. */
export function Source({ project, page }: { project: Project; page: ProjectPage }) {
  const text = projectPage.sourceText.text
    .replace("{name}", project.name)
    .replace("{licence}", page.badges.licence);

  return (
    <section
      id="source"
      aria-labelledby="source-heading"
      className="from-mist to-haze bg-linear-to-b pt-20 pb-16 lg:pt-28 lg:pb-24"
    >
      <Container>
        <h2 id="source-heading" className="text-title text-basalt">
          {projectPage.sourceHeading.text}
        </h2>
        <p className="text-ocean mt-5 max-w-[34rem] text-lead">{text}</p>
        <ScaleRule className="mt-7 max-w-[22.5rem]" />
        <div className="mt-3 flex flex-wrap gap-3">
          <Button href={project.repository}>
            {ui.sourceLink.text}
            <ArrowOutIcon />
          </Button>
          <Button href={calls.discuss.href} variant="outlined">
            {calls.discuss.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
