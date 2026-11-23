import Image from "next/image";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { GlassPanel } from "@/components/ui/glass-panel";
import { CheckIcon, StarIcon } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { ScaleRule } from "@/components/ui/scale-rule";
import { SectionHeading } from "@/components/ui/section-heading";
import { image } from "@/content/images";
import { projectBySlug } from "@/content/projects";

/**
 * The scratch page of the design system: every component once, on the pale
 * ground and over the landscape, to compare with board B.
 */
export default function ComponentsFixture() {
  const landscape = image("landscape");

  return (
    <main id="content" className="from-mist to-haze bg-linear-to-b">
      <Container className="space-y-12 pt-36 pb-16">
        <h1 className="text-title">Components</h1>

        <section aria-label="Label" data-component="label">
          <Label>Open-Breach · Open source tools</Label>
        </section>

        <section aria-label="Type" data-component="type" className="space-y-4">
          <p className="text-display">Open tools,</p>
          <p className="text-title">A section heading</p>
          <p className="text-statement max-w-[40rem]">A statement, set larger than running text.</p>
          <p className="text-ocean max-w-[34rem] text-lead">
            Secondary text is Ocean on Mist. The lead size is used under headings.
          </p>
          <p className="text-ocean max-w-[34rem]">Running text in Ocean, and data in mono:</p>
          <p className="font-mono text-sm">v0.6.0 · 20 Nov 2026</p>
        </section>

        <section aria-label="Scale" data-component="scale-rule">
          <ScaleRule className="max-w-[22.5rem]" />
        </section>

        <section aria-label="Buttons" data-component="buttons" className="flex flex-wrap gap-3">
          <Button href="/">Install</Button>
          <Button href="/" variant="outlined">
            Join the discussion
          </Button>
          <Button href="/" size="sm">
            Install
          </Button>
          <Button href="/" variant="outlined" size="sm">
            Small outlined
          </Button>
        </section>

        <section aria-label="Chips" data-component="chips" className="flex gap-1.5">
          <Chip>Linux</Chip>
          <Chip>macOS</Chip>
          <Chip>Windows</Chip>
        </section>

        <section aria-label="Badges" data-component="badges" className="flex flex-wrap gap-2">
          <Badge label="Version" value="v0.6.0" />
          <Badge label="Build" value="passing" icon={<CheckIcon />} />
          <Badge label="Licence" value="Apache-2.0" />
          <Badge label="Stars" value="128" icon={<StarIcon />} />
        </section>

        <SectionHeading id="fixture-heading" intro="The line under a section heading.">
          Section heading
        </SectionHeading>
      </Container>

      <section
        aria-label="Glass over the landscape"
        data-component="glass"
        className="relative h-[30rem]"
      >
        <Image src={landscape.src} alt="" fill sizes="100vw" className="object-cover object-bottom" />
        <Container className="relative flex flex-wrap items-start gap-6 pt-40">
          <GlassPanel variant="bar" className="flex h-14 items-center px-7 text-sm">
            A glass bar with Basalt text
          </GlassPanel>
          <div className="w-[16.25rem]">
            <ProjectCard project={projectBySlug("rick")} showLabel heading="h2" />
          </div>
        </Container>
      </section>
    </main>
  );
}
