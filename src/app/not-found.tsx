import type { Metadata } from "next";
import { SimplePage } from "@/components/shell/simple-page";
import { notFound } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: notFound.text.text,
  // An address that is no page has no canonical address.
  alternates: { canonical: null },
};

export default function NotFound() {
  return <SimplePage heading={notFound.heading.text}>{notFound.text.text}</SimplePage>;
}
