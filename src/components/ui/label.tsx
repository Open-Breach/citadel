import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** A small signal in spaced capitals, set in the darker amber. */
export function Label({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-label text-amber-deep uppercase", className)} {...props} />;
}
