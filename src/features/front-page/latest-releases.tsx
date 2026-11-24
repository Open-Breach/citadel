import { Container } from "@/components/ui/container";
import { ArrowOutIcon } from "@/components/ui/icons";
import { SampleNote } from "@/components/ui/sample-note";
import { SectionHeading } from "@/components/ui/section-heading";
import type { FrontPage } from "@/content/site";
import type { Project, Release } from "@/content/types";
import { formatDay } from "@/lib/format";

/**
 * The most recent releases, newest first. The caller passes the entries
 * already sorted and cut to five. With no release known, the section is
 * left out and the page shows no empty list.
 */
export function LatestReleases({
  content,
  releases,
  projects,
}: {
  content: FrontPage["releases"];
  releases: Release[];
  projects: Project[];
}) {
  if (releases.length === 0) return null;

  const nameOf = (slug: string) => projects.find((project) => project.slug === slug)?.name ?? slug;

  return (
    <section id="releases" aria-labelledby="releases-heading" className="pb-20 lg:pb-32">
      <Container className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="releases-heading" intro={content.intro.text}>
            {content.heading.text}
          </SectionHeading>
          <SampleNote show={releases.some((release) => release.placeholder)} className="mt-4" />
        </div>
        <ol className="border-stone/40 border-b lg:col-span-8">
          {releases.map((release) => (
            <li key={`${release.project}-${release.version}`} className="border-stone/40 border-t">
              <a
                href={release.url}
                className="lead-on hover:bg-white/70 -mx-3 grid grid-cols-[1fr_auto_auto] items-center gap-x-5 rounded-sm px-3 py-4 transition-[color,background-color,border-color] duration-150 sm:grid-cols-[minmax(0,14rem)_6rem_8rem_1fr]"
              >
                <span className="text-basalt font-medium">{nameOf(release.project)}</span>
                <span className="text-basalt font-mono text-sm">v{release.version}</span>
                <time
                  dateTime={release.date}
                  className="text-ocean col-start-1 row-start-2 font-mono text-sm sm:col-start-auto sm:row-start-auto"
                >
                  {formatDay(release.date)}
                </time>
                <ArrowOutIcon className="text-amber-deep lead-on-arrow justify-self-end" />
              </a>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
