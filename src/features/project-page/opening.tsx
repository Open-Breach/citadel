import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowOutIcon, CheckIcon, CloseIcon, StarIcon } from "@/components/ui/icons";
import { SampleNote } from "@/components/ui/sample-note";
import { Photograph } from "@/components/ui/photograph";
import { image } from "@/content/images";
import { calls, projectPage, ui } from "@/content/site";
import type { Project, ProjectPage } from "@/content/types";
import { formatCount } from "@/lib/format";
import { Text } from "@/components/ui/text";

/**
 * The top of a project page: what the project is, its four badges, the way
 * to its install steps and to its source, the project at work, and the
 * photograph of the sea stack that ends the opening.
 */
export function Opening({ project, page }: { project: Project; page: ProjectPage }) {
  const lead = page.screenshots[0];
  const shot = lead ? image(lead.image) : null;
  const { badges } = page;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="from-mist to-haze bg-linear-to-b from-20% to-70%"
    >
      <Container className="grid grid-cols-1 items-center gap-x-8 gap-y-12 pt-28 pb-16 sm:pt-36 lg:grid-cols-12 lg:pt-[clamp(7.5rem,18.3svh,11rem)] lg:pb-24">
        <div className="lg:col-span-5">
          <h1 id="about-heading" className="rise text-display text-basalt">
            {project.name}
          </h1>
          <p className="rise text-ocean mt-6 max-w-[34rem] text-lead [--rise-step:2]">
            <Text>{page.what.text}</Text>
          </p>
          {page.status ? (
            <p className="rise text-basalt mt-4 max-w-[34rem] text-control [--rise-step:2]">
              {page.status.text}
            </p>
          ) : null}
          <ul className="rise mt-7 flex max-w-[22rem] flex-wrap gap-2 [--rise-step:3]">
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
          <SampleNote show={badges.placeholder === true} className="rise mt-3 [--rise-step:3]" />
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
              preload
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="border-stone/40 shadow-window h-auto w-full rounded-xl border"
            />
          </div>
        ) : null}
      </Container>
      {/*
        The opening ends on the sea stack, on every project page. It fades in
        from the pale ground, the stack stands right of the middle with its
        base and the waterline in view, and no text lies over it.
      */}
      <Photograph
        id="seaStack"
        fadeIn
        sizes="(max-width: 640px) 170vw, 100vw"
        className="relative h-[max(41.7vw,17rem)] [--fade-end:42%]"
        // The frame shows the picture from 14 to 69 per cent of its height: the stack
        // with its base and the waterline, and the cliff on the left where there is room.
        boxClassName="absolute inset-x-0 top-[-25.6%] h-[183%]"
        imageClassName="object-[82%_50%]"
      />
    </section>
  );
}
