import type { ReactNode } from "react";

/**
 * A badge drawn by the site: what is measured on the left, its value on the
 * right. Nothing is loaded from a badge service.
 */
export function Badge({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <span className="border-stone/60 inline-flex h-7 items-stretch overflow-hidden rounded-md border text-[0.8125rem] leading-none">
      <span className="text-ocean flex items-center bg-white/70 px-2.5">{label}</span>
      <span className="border-stone/60 text-basalt flex items-center gap-1.5 border-l px-2.5 font-mono">
        {icon}
        {value}
      </span>
    </span>
  );
}
