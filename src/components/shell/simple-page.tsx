import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ScaleRule } from "@/components/ui/scale-rule";
import { ui } from "@/content/site";

/**
 * A page that says one thing and leads back to the front page: the
 * not-found page and the still-to-come page.
 */
export function SimplePage({
  heading,
  children,
  aside,
}: {
  heading: ReactNode;
  children: ReactNode;
  /** Something more to say, between the text and the way back. */
  aside?: ReactNode;
}) {
  return (
    <main id="content" className="from-mist to-haze flex flex-1 flex-col bg-linear-to-b">
      <Container className="pt-36 pb-20 lg:pt-52 lg:pb-28">
        <h1 className="text-title text-basalt max-w-[40rem]">{heading}</h1>
        <p className="text-ocean mt-5 max-w-[34rem] text-lead">{children}</p>
        {aside}
        <ScaleRule className="mt-8 max-w-[22.5rem]" />
        <p className="mt-5">
          <Link
            href="/"
            className="lead-on text-amber-deep inline-flex items-center gap-1.5 rounded-sm font-medium"
          >
            {ui.frontPageLink.text}
            <ArrowRightIcon className="lead-on-arrow" />
          </Link>
        </p>
      </Container>
    </main>
  );
}
