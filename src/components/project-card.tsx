import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/ui/chip";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { image } from "@/content/images";
import { ui } from "@/content/site";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui/text";

/**
 * The card of a project, as on board B: the name, one line, the platforms
 * of a program, and the link that leads on. The whole card is the link, and
 * a keyboard user reaches it as one link, named after the project.
 *
 * A wide card also shows the project at work: its first screenshot, where
 * the project has one.
 */
export function ProjectCard({
  project,
  showLabel = false,
  wide = false,
  heading: Heading = "h3",
  className,
}: {
  project: Project;
  /** The small "Project" label, where the card stands alone. */
  showLabel?: boolean;
  /** Spans the row and makes room for a screenshot. */
  wide?: boolean;
  heading?: "h2" | "h3";
  className?: string;
}) {
  const lead = wide ? project.page?.screenshots[0] : undefined;
  const shot = lead ? image(lead.image) : null;

  return (
    <article
      className={cn(
        "glass-card rounded-card lead-on has-[a:focus-visible]:outline-basalt hover:border-stone relative h-full overflow-hidden transition-[border-color,box-shadow] duration-200 hover:shadow-(--shadow-window) has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3",
        shot && "grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
        className,
      )}
    >
      <div className={cn("flex h-full flex-col p-6", shot && "lg:p-8")}>
        {showLabel ? <Label className="mb-4">{ui.projectLabel.text}</Label> : null}
        <Heading
          className={cn(
            "text-basalt leading-none font-semibold tracking-[-0.02em]",
            shot ? "text-name lg:text-name-wide" : "text-name",
          )}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="after:rounded-card outline-none after:absolute after:inset-0 after:z-10"
          >
            {project.name}
          </Link>
        </Heading>
        <p
          className={cn(
            "text-ocean mt-3.5 leading-snug",
            shot ? "max-w-[24rem] text-control lg:text-lead" : "text-control",
          )}
        >
          <Text>{project.tagline.text}</Text>
        </p>
        {project.platforms.list.length > 0 ? (
          <ul aria-label={ui.runsOn.text} className="mt-4 flex flex-wrap gap-1">
            {project.platforms.list.map((platform) => (
              <li key={platform} className="flex">
                <Chip>{platform}</Chip>
              </li>
            ))}
          </ul>
        ) : null}
        <p
          aria-hidden="true"
          className="text-amber-deep mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium"
        >
          {ui.explore.text}
          <ArrowRightIcon className="lead-on-arrow" />
        </p>
      </div>
      {shot ? (
        // The project at work: the top left of its window, running off the card's edge.
        <div className="relative h-52 sm:h-64 lg:h-auto lg:min-h-72">
          <Image
            src={shot.src}
            alt={shot.description}
            width={shot.width}
            height={shot.height}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="border-stone/40 shadow-window absolute top-0 left-6 h-auto w-[max(100%,44rem)] max-w-none rounded-tl-lg border lg:top-8 lg:left-2"
          />
        </div>
      ) : null}
    </article>
  );
}
