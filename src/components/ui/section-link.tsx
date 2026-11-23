"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

/**
 * A link inside the site. Where it leads to a part of the page that is
 * already open, it moves there itself, every time it is activated: the
 * browser does nothing when the address already ends in that part's name,
 * and a call to action must never be dead on its second use.
 */
export function SectionLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  function move(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    const [path, id] = href.split("#");
    if (!id || (path !== "" && path !== window.location.pathname)) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
    target.scrollIntoView();
    // The focus follows, so that the keyboard goes on from there.
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  return <Link href={href} onClick={move} {...props} />;
}
