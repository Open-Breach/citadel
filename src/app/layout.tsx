import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Footer } from "@/components/shell/footer";
import { Navigation } from "@/components/shell/navigation";
import { site, ui } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
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
