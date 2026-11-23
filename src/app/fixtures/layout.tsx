import type { Metadata } from "next";
import { notFound } from "next/navigation";

/*
 * Test pages. They exist while the site runs in development and in the
 * build for the browser tests, which sets CITADEL_FIXTURES. In a normal
 * production build every page under /fixtures is the not-found page.
 */
const enabled =
  process.env.CITADEL_FIXTURES === "1" || process.env.NODE_ENV === "development";

export const metadata: Metadata = {
  title: "Test page",
  robots: { index: false, follow: false },
};

export default function FixturesLayout({ children }: LayoutProps<"/fixtures">) {
  if (!enabled) notFound();
  return children;
}
