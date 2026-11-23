import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "filled" | "outlined";
type Size = "md" | "sm";

/** The classes of a call to action, for elements that are not links. */
export function buttonClasses(variant: Variant = "filled", size: Size = "md", className?: string) {
  return cn(
    "rounded-control inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-150 select-none",
    size === "md" ? "h-11 px-5 text-[0.9375rem]" : "h-9 px-4 text-sm",
    variant === "filled"
      ? "bg-amber text-basalt hover:bg-amber-bright active:bg-amber-pressed"
      : "border-basalt text-basalt hover:bg-basalt hover:text-mist active:bg-ocean active:text-mist border",
    className,
  );
}

/**
 * A call to action. Filled amber is the prominent one, outlined the second.
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
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
