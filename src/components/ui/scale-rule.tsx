import { cn } from "@/lib/cn";

/**
 * The instrument scale: a ruled line with tick marks. It divides and
 * measures, and says nothing, so assistive technology skips it.
 */
export function ScaleRule({
  draw = false,
  onDark = false,
  className,
}: {
  /** Draws itself in from the left when the page loads. */
  draw?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "scale-rule",
        onDark && "scale-rule-on-dark",
        draw && "scale-rule-draw",
        className,
      )}
    />
  );
}
