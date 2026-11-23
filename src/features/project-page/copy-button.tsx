"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

/** Copies a command to the clipboard and says so. */
export function CopyButton({
  text,
  labels,
}: {
  text: string;
  labels: { copy: string; copied: string };
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Without clipboard access the command is still text that can be selected.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="border-stone/60 text-basalt hover:border-basalt hover:bg-basalt hover:text-mist rounded-control bg-white relative inline-flex h-8 shrink-0 items-center gap-1.5 border px-2.5 text-fine font-medium transition-[color,background-color,border-color] duration-150 after:absolute after:-inset-1.5"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
    </button>
  );
}
