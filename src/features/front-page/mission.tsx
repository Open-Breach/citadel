import { Container } from "@/components/ui/container";
import type { FrontPage } from "@/content/site";

/** What Open-Breach is for. */
export function Mission({ content }: { content: FrontPage["mission"] }) {
  return (
    <section id="mission" aria-labelledby="mission-heading" className="py-20 lg:py-32">
      <Container className="grid gap-x-8 gap-y-8 lg:grid-cols-12">
        <h2 id="mission-heading" className="text-title text-basalt lg:col-span-4">
          {content.heading.text}
        </h2>
        <div className="lg:col-span-8">
          <p className="text-statement text-basalt max-w-[44rem]">{content.statement.text}</p>
          <div className="text-ocean mt-10 grid gap-x-10 gap-y-5 text-[1.0625rem] leading-relaxed md:grid-cols-2">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph.text}>{paragraph.text}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
