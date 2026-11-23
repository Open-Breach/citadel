import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowOutIcon, CheckIcon, CloseIcon, StarIcon } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { image } from "@/content/images";
import { calls, projectPage, ui } from "@/content/site";
import type { Project, ProjectPage } from "@/content/types";
import { formatCount } from "@/lib/format";

/**
 * The top of a project page: what the project is, its four badges, the way
 * to its install steps and to its source, and the project at work.
 */
export function Opening({ project, page }: { project: Project; page: ProjectPage }) {
  const lead = page.screenshots[0];
  const shot = lead ? image(lead.image) : null;
  const { badges } = page;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="from-mist to-haze bg-linear-to-b from-20%"
    >
      <Container className="grid items-center gap-x-8 gap-y-12 pt-28 pb-16 sm:pt-36 lg:grid-cols-12 lg:pt-44 lg:pb-24">
        <div className="lg:col-span-5">
          <Label className="rise">{ui.projectLabel.text}</Label>
          <h1 id="about-heading" className="rise text-display text-basalt mt-5 [--rise-step:1]">
            {project.name}
          </h1>
          <p className="rise text-ocean mt-6 max-w-[34rem] text-lead [--rise-step:2]">
            {page.what.text}
          </p>
          {page.status ? (
            <p className="rise text-basalt mt-4 max-w-[34rem] text-[0.9375rem] [--rise-step:2]">
              {page.status.text}
            </p>
          ) : null}
          <ul className="rise mt-7 flex flex-wrap gap-2 [--rise-step:3]">
            <li className="flex">
              <Badge label={projectPage.badges.version.text} value={`v${badges.version}`} />
            </li>
            <li className="flex">
              <Badge
                label={projectPage.badges.build.text}
                value={badges.build}
                icon={badges.build === "passing" ? <CheckIcon /> : <CloseIcon />}
              />
            </li>
            <li className="flex">
              <Badge label={projectPage.badges.licence.text} value={badges.licence} />
            </li>
            <li className="flex">
              <Badge
                label={projectPage.badges.stars.text}
                value={formatCount(badges.stars)}
                icon={<StarIcon />}
              />
            </li>
          </ul>
          <div className="rise mt-8 flex flex-wrap gap-3 [--rise-step:4]">
            <Button href="#install">{calls.install.label}</Button>
            <Button href={project.repository} variant="outlined">
              {ui.sourceLink.text}
              <ArrowOutIcon />
            </Button>
          </div>
        </div>
        {shot ? (
          <div className="rise [--rise-step:3] lg:col-span-7">
            <Image
              src={shot.src}
              alt={shot.description}
              width={shot.width}
              height={shot.height}
              priority
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="border-stone/40 shadow-window h-auto w-full rounded-xl border"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
