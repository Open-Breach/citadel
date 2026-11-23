import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** The heading of a section, with an optional line under it. */
export function SectionHeading({
  id,
  children,
  intro,
  className,
}: {
  id: string;
  children: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 id={id} className="text-title text-basalt">
        {children}
      </h2>
      {intro ? <p className={cn("text-ocean mt-4 max-w-[34rem] text-lead")}>{intro}</p> : null}
    </div>
  );
}
