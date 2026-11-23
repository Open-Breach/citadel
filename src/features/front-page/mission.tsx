import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import type { FrontPage } from "@/content/site";

/** What Open-Breach is for. */
export function Mission({ content }: { content: FrontPage["mission"] }) {
  return (
    <section id="mission" aria-labelledby="mission-heading" className="py-20 lg:py-32">
      <Container className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
        <h2 id="mission-heading" className="text-basalt text-xl font-semibold tracking-[-0.01em] lg:pt-2 lg:col-span-4">
          <Text>{content.heading.text}</Text>
        </h2>
        <div className="lg:col-span-8">
          <p className="text-statement text-basalt max-w-[44rem]"><Text>{content.statement.text}</Text></p>
          <div className="text-ocean mt-10 grid grid-cols-1 gap-x-10 gap-y-5 text-reading leading-relaxed md:grid-cols-2">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph.text}>
                <Text>{paragraph.text}</Text>
              </p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
