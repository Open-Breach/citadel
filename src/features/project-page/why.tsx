import { Container } from "@/components/ui/container";
import type { ProjectPage } from "@/content/types";

/** Why the project exists. The first paragraph is set larger. */
export function Why({ page }: { page: ProjectPage }) {
  const [first, ...rest] = page.why.paragraphs;

  return (
    <section id="why" aria-labelledby="why-heading" className="py-20 lg:py-32">
      <Container className="grid gap-x-8 gap-y-8 lg:grid-cols-12">
        <h2 id="why-heading" className="text-title text-basalt lg:col-span-4">
          {page.why.heading.text}
        </h2>
        <div className="lg:col-span-7 lg:col-start-6">
          {first ? <p className="text-statement text-basalt">{first.text}</p> : null}
          <div className="text-ocean mt-8 max-w-[40rem] space-y-5 text-[1.0625rem] leading-relaxed">
            {rest.map((paragraph) => (
              <p key={paragraph.text}>{paragraph.text}</p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
