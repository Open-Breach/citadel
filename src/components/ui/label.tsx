import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * A small label in spaced capitals. Its text has the colour of the text
 * beside it, and a small amber square stands before it: small amber text
 * does not hold its contrast over a photograph, so the mark carries the
 * amber and the text stays readable.
 */
export function Label({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-label flex items-center gap-2.5 uppercase", className)} {...props}>
      <span aria-hidden="true" data-label-mark className="bg-amber size-2 shrink-0" />
      {children}
    </p>
  );
}
