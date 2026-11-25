import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Footer } from "@/components/shell/footer";
import { Navigation } from "@/components/shell/navigation";
import { site, ui } from "@/content/site";
import "./globals.css";

/*
 * The site answers under several host names, and every page names its own
 * address under the main one as its canonical address, so that search
 * engines count the names as one site.
 *
 * The main address is read when the site is built, not when it starts: the
 * pages are built ahead of time, and their head is part of what is built.
 * next.config.ts takes it from PUBLIC_BASE_URL.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_BASE_URL!),
  // Relative to the page that is shown: each page names itself.
  alternates: { canonical: "./" },
  title: {
    default: site.name,
    // Every other page names itself and Open-Breach.
    template: `%s · ${site.name}`,
  },
  description: site.description.text,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#content"
          className="text-basalt rounded-control border-basalt sr-only z-50 border bg-white px-4 py-3 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3"
        >
          {ui.skipToContent.text}
        </a>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
