import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** An outlined pill, as the platform chips of board B. */
export function Chip({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "border-stone text-basalt inline-flex h-6 items-center rounded-full border px-2.5 text-xs leading-none",
        className,
      )}
      {...props}
    />
  );
}
