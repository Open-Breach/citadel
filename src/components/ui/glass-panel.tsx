import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * A translucent panel that softens what lies behind it. Without backdrop
 * filters it is a pale surface (see the glass utilities in globals.css).
 *
 * "bar" carries Basalt text only, as the navigation does. "card" also
 * carries secondary and amber text and is milkier for it.
 */
export function GlassPanel({
  variant = "card",
  className,
  ...props
}: ComponentProps<"div"> & { variant?: "bar" | "card" }) {
  return (
    <div
      className={cn(
        variant === "bar" ? "glass rounded-panel" : "glass-card rounded-card",
        className,
      )}
      {...props}
    />
  );
}
