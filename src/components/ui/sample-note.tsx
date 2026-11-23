import { ui } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * A quiet mark beside data that is a sample and not yet read from its
 * source. It shows only while the data carries the placeholder marker.
 */
export function SampleNote({ show, className }: { show: boolean; className?: string }) {
  if (!show) return null;
  return (
    <p className={cn("text-ocean text-xs", className)} data-sample-note>
      {ui.sampleData.text}
    </p>
  );
}
