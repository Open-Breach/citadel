import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Label } from "@/components/ui/label";
import { Photograph } from "@/components/ui/photograph";
import { ScaleRule } from "@/components/ui/scale-rule";
import { Text } from "@/components/ui/text";
import { calls, type FrontPage } from "@/content/site";
import type { Project } from "@/content/types";

/**
 * The first screen: the basalt columns fill it from edge to edge, behind
 * the navigation, the text and the card for one project.
 *
 * The text is light and lies on the dark rock. No veil lies over the
 * photograph: the contrast comes from where the picture is placed. It is
 * anchored to the left edge and centred vertically, and a little wider
 * than the screen, so that the columns lie under the whole text block and
 * the wave lies under the card. On a narrow screen it is as tall as the
 * screen and shows mostly rock and sand. The browser checks measure the
 * contrast of every line at four widths.
 */
export function Hero({ content, featured }: { content: FrontPage["hero"]; featured: Project }) {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate flex min-h-svh flex-col">
      <Photograph
        id="basaltColumns"
        first
        sizes="(max-width: 640px) 330vw, (max-width: 1024px) 200vw, 112vw"
        className="absolute inset-0 -z-10"
        boxClassName="hero-photograph absolute inset-y-0 left-0"
        imageClassName="object-left"
      />

      <Container className="on-dark text-mist pt-28 pb-10 sm:pt-36 lg:pt-[clamp(7.5rem,18.3svh,11rem)]">
        <Label className="rise">{content.label.text}</Label>
        <h1 id="hero-heading" className="rise text-display mt-5 [--rise-step:1]">
          {content.headline.map((line) => (
            <span key={line.text} className="block">
              {line.text}
            </span>
          ))}
        </h1>
        <p className="rise mt-5 max-w-[40rem] text-lead [--rise-step:2]">
          <Text>{content.intro.text}</Text>
        </p>
        <ScaleRule draw onDark className="mt-6 max-w-[22.5rem]" />
        <div className="rise mt-3 flex flex-wrap gap-3 [--rise-step:3]">
          <Button href={calls.install.href}>{calls.install.label}</Button>
          <Button href={calls.discuss.href} variant="outlined-light">
            {calls.discuss.label}
          </Button>
        </div>
      </Container>

      {/* The card for one project, over the wave on a wide screen and under the buttons on a narrow one. */}
      <Container className="relative mt-auto pb-10 lg:static lg:pb-0">
        <div className="rise [--rise-step:4] lg:absolute lg:right-[max(4.5rem,calc((100vw-90rem)/2+4.5rem))] lg:bottom-[23.8%] lg:w-[16.25rem]">
          <ProjectCard project={featured} showLabel heading="h2" />
        </div>
      </Container>
    </section>
  );
}
