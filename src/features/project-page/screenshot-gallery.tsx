"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CloseIcon, ExpandIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type GalleryItem = {
  src: string;
  width: number;
  height: number;
  /** What the screenshot shows: its text alternative. */
  description: string;
  caption: string;
};

/**
 * The screenshots of a project. Each one opens a larger view, which fits
 * the screen at every width and closes with the Escape key, with its Close
 * button or with a click beside it.
 */
export function ScreenshotGallery({
  items,
  labels,
}: {
  items: GalleryItem[];
  labels: { viewLarger: string; close: string };
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  // The screenshot in the larger view. It stays set after the view closes:
  // the close event arrives late, and clearing it then could empty a view
  // that was opened again in the meantime.
  const [current, setCurrent] = useState<GalleryItem | null>(null);

  function open(item: GalleryItem) {
    // The view is filled before it opens, and the focus goes to Close every time.
    flushSync(() => setCurrent(item));
    dialog.current?.showModal();
    closeButton.current?.focus();
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={`${index}-${item.src}`} className={cn(index === 0 && "lg:col-span-2 lg:row-span-2")}>
            <figure className="flex h-full flex-col">
              <button
                type="button"
                onClick={() => open(item)}
                className="group border-stone/40 hover:border-stone relative block cursor-zoom-in overflow-hidden rounded-xl border transition-[color,background-color,border-color] duration-200"
              >
                <Image
                  src={item.src}
                  alt={item.description}
                  width={item.width}
                  height={item.height}
                  sizes={index === 0 ? "(min-width: 1024px) 62vw, 100vw" : "(min-width: 1024px) 31vw, 100vw"}
                  className="h-auto w-full"
                />
                <span className="bg-basalt text-mist rounded-control absolute right-3 bottom-3 flex size-8 items-center justify-center opacity-80 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ExpandIcon />
                </span>
                <span className="sr-only">{labels.viewLarger}</span>
              </button>
              <figcaption className="text-ocean mt-3 text-sm">{item.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={current?.description}
        onClick={(event) => {
          // A click on the dimmed area beside the image closes the view.
          if (event.target === dialog.current) dialog.current?.close();
        }}
        // As wide as the screen allows while the whole image still fits its height.
        style={
          current
            ? {
                width: `min(100vw - 2rem, 100rem, (100dvh - 8rem) * ${current.width / current.height})`,
              }
            : undefined
        }
        className="backdrop:bg-basalt/80 m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:backdrop-blur-sm"
      >
        {current ? (
          <figure className="bg-mist rounded-xl p-2 sm:p-3">
            {/* The whole screenshot, within the screen at every width. */}
            <Image
              src={current.src}
              alt={current.description}
              width={current.width}
              height={current.height}
              sizes="100vw"
              className="border-stone/40 h-auto w-full rounded-lg border"
            />
            <div className="flex items-center justify-between gap-4 px-1 pt-2 sm:pt-3">
              <figcaption className="text-ocean text-sm">{current.caption}</figcaption>
              <form method="dialog">
                <button
                  ref={closeButton}
                  className="border-basalt text-basalt hover:bg-basalt hover:text-mist rounded-control inline-flex h-9 items-center gap-2 border px-3 text-sm font-medium transition-[color,background-color,border-color] duration-150"
                >
                  <CloseIcon />
                  {labels.close}
                </button>
              </form>
            </div>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
