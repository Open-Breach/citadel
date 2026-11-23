import Link from "next/link";
import { Chip } from "@/components/ui/chip";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { ui } from "@/content/site";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * The card of a project, as on board B: the name, one line, the platforms
 * of a program, and the link that leads on. The whole card is the link, and
 * a keyboard user reaches it as one link, named after the project.
 */
export function ProjectCard({
  project,
  showLabel = false,
  heading: Heading = "h3",
  className,
}: {
  project: Project;
  /** The small "Project" label, where the card stands alone. */
  showLabel?: boolean;
  heading?: "h2" | "h3";
  className?: string;
}) {
  return (
    <article
      className={cn(
        "glass-card rounded-card lead-on has-[a:focus-visible]:outline-basalt relative flex h-full flex-col p-6 transition-[border-color] duration-200 hover:border-stone has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3",
        className,
      )}
    >
      {showLabel ? <Label className="mb-4">{ui.projectLabel.text}</Label> : null}
      <Heading className="text-basalt text-[1.75rem] leading-none font-semibold tracking-[-0.02em]">
        <Link
          href={`/projects/${project.slug}`}
          className="after:rounded-card outline-none after:absolute after:inset-0"
        >
          {project.name}
        </Link>
      </Heading>
      <p className="text-ocean mt-3.5 text-[0.9375rem] leading-snug">{project.tagline.text}</p>
      {project.platforms.list.length > 0 ? (
        <ul aria-label={ui.runsOn.text} className="mt-4 flex flex-wrap gap-1.5">
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
    </article>
  );
}
