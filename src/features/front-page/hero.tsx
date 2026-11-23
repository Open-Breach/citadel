import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { ScaleRule } from "@/components/ui/scale-rule";
import { image } from "@/content/images";
import { calls, type FrontPage } from "@/content/site";
import type { Project } from "@/content/types";
import { Text } from "@/components/ui/text";

/**
 * The first screen, as on board B: label, headline, two lines, the
 * instrument scale, the two calls to action, a glass card for one project,
 * and the landscape edge to edge.
 *
 * The text stands above the landscape and never over it. Only the card
 * overlaps the image, and its glass keeps the text on it readable. On a
 * desktop screen of the usual height the screen ends on the ocean band.
 */
export function Hero({ content, featured }: { content: FrontPage["hero"]; featured: Project }) {
  const landscape = image("landscape");

  return (
    <section
      aria-labelledby="hero-heading"
      className="from-mist to-haze flex min-h-svh flex-col bg-linear-to-b to-60%"
    >
      <Container className="pt-28 pb-24 sm:pt-36 lg:pt-[clamp(7.5rem,18.3svh,11rem)] lg:pb-6">
        <Label className="rise">{content.label.text}</Label>
        <h1
          id="hero-heading"
          className="rise text-display text-basalt mt-5 [--rise-step:1]"
        >
          {content.headline.map((line) => (
            <span key={line.text} className="block">
              {line.text}
            </span>
          ))}
        </h1>
        <p className="rise text-ocean mt-5 max-w-[40rem] text-lead [--rise-step:2]">
          <Text>{content.intro.text}</Text>
        </p>
        <ScaleRule draw className="mt-6 max-w-[22.5rem]" />
        <div className="rise mt-3 flex flex-wrap gap-3 [--rise-step:3]">
          <Button href={calls.install.href}>{calls.install.label}</Button>
          <Button href={calls.discuss.href} variant="outlined">
            {calls.discuss.label}
          </Button>
        </div>
      </Container>

      <div className="relative min-h-[max(20rem,23.6vw)] flex-1">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={landscape.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="drift object-cover object-bottom"
          />
        </div>
        <Container className="relative">
          <div className="rise -translate-y-[30%] [--rise-step:4] lg:absolute lg:top-0 lg:right-[4.5rem] lg:w-[16.25rem] lg:-translate-y-[46%]">
            <ProjectCard project={featured} showLabel heading="h2" />
          </div>
        </Container>
      </div>
    </section>
  );
}
