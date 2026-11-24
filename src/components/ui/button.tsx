import { SectionLink } from "@/components/ui/section-link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "filled" | "solid" | "outlined" | "outlined-light";
type Size = "md" | "sm";

/** The classes of a call to action, for elements that are not links. */
export function buttonClasses(variant: Variant = "filled", size: Size = "md", className?: string) {
  return cn(
    "rounded-control inline-flex items-center justify-center gap-2 text-center font-medium transition-[color,background-color,border-color] duration-150 select-none",
    size === "md"
      ? "min-h-11 px-5 py-2 text-control"
      : "relative h-9 px-4 text-sm after:absolute after:inset-x-0 after:-inset-y-1",
    variant === "filled" && "bg-amber text-basalt hover:bg-amber-bright active:bg-amber-pressed",
    variant === "solid" && "bg-basalt text-mist hover:bg-ocean active:bg-ocean",
    variant === "outlined" &&
      "border-basalt text-basalt hover:bg-basalt hover:text-mist active:bg-ocean active:text-mist border",
    variant === "outlined-light" &&
      "border-mist text-mist hover:bg-mist hover:text-basalt active:bg-fog active:text-basalt border",
    className,
  );
}

/**
 * A call to action. Filled amber is Install, the prominent one, and nothing
 * else. Solid Basalt is the first action of a place where that action is
 * not Install. Outlined is the second action, and outlined-light is the
 * same over the dark rock of a photograph.
 * A target on this site becomes a client-side link; any other target is a
 * plain link that the visitor follows.
 */
export function Button({
  href,
  variant = "filled",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  const classes = buttonClasses(variant, size, className);
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <SectionLink href={href} className={classes}>
        {children}
      </SectionLink>
    );
  }
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
