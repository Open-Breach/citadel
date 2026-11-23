"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Entry = { label: string; href: string };

const entryClasses =
  "text-basalt decoration-stone rounded-sm text-sm underline-offset-[0.4em] hover:underline";

/**
 * The navigation as one glass panel. On a wide screen the entries stand in
 * the panel. On a narrow one they are behind the menu control, while the
 * name and Install stay visible.
 */
export function NavigationBar({
  name,
  entries,
  install,
  support,
  labels,
}: {
  name: string;
  entries: Entry[];
  install: Entry;
  /** The support link. Left out, with no gap, while it has no target. */
  support: Entry | null;
  labels: { navigation: string; menu: string; closeMenu: string };
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const control = useRef<HTMLButtonElement>(null);
  const allEntries = support ? [...entries, support] : entries;

  return (
    <nav
      aria-label={labels.navigation}
      className="pointer-events-auto relative w-full lg:w-auto"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          control.current?.focus();
        }
      }}
    >
      <div className="glass rounded-panel flex h-14 items-center justify-between gap-2 pr-2.5 pl-5 lg:justify-start lg:gap-9 lg:pl-7">
        <Link
          href="/"
          className="text-basalt rounded-sm text-[0.8125rem] font-semibold tracking-[0.16em] uppercase"
        >
          {name}
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {allEntries.map((entry) => (
            <li key={entry.href}>
              <NavLink entry={entry} />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <Link href={install.href} className={buttonClasses("filled", "sm")}>
            {install.label}
          </Link>
          <button
            ref={control}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(!open)}
            className="text-basalt rounded-control hover:bg-basalt hover:text-mist flex size-9 items-center justify-center transition-colors duration-150 lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? labels.closeMenu : labels.menu}</span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="glass rounded-panel animate-fade-in absolute inset-x-0 top-full mt-2 p-2 lg:hidden"
      >
        <ul>
          {allEntries.map((entry) => (
            <li key={entry.href}>
              <NavLink
                entry={entry}
                onClick={() => setOpen(false)}
                className="rounded-control hover:bg-basalt hover:text-mist flex h-12 items-center px-3 text-base transition-colors duration-150 hover:no-underline"
              />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function NavLink({
  entry,
  onClick,
  className,
}: {
  entry: Entry;
  onClick?: () => void;
  className?: string;
}) {
  const classes = cn(entryClasses, className);
  if (entry.href.startsWith("/")) {
    return (
      <Link href={entry.href} onClick={onClick} className={classes}>
        {entry.label}
      </Link>
    );
  }
  return (
    <a href={entry.href} onClick={onClick} className={classes}>
      {entry.label}
    </a>
  );
}
