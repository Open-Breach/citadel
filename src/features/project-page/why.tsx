import { Container } from "@/components/ui/container";
import type { ProjectPage } from "@/content/types";
import { Text } from "@/components/ui/text";

/** Why the project exists. The first paragraph is set larger. */
export function Why({ page }: { page: ProjectPage }) {
  const [first, ...rest] = page.why.paragraphs;

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="from-haze to-mist bg-linear-to-b to-[14rem] py-20 lg:py-32"
    >
      <Container className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-12">
        <h2 id="why-heading" className="text-basalt text-xl font-semibold tracking-[-0.01em] lg:pt-2 lg:col-span-4">
          {page.why.heading.text}
        </h2>
        <div className="lg:col-span-8">
          {first ? (
            <p className="text-statement text-basalt max-w-[44rem]">
              <Text>{first.text}</Text>
            </p>
          ) : null}
          <div className="text-ocean mt-8 max-w-[40rem] space-y-5 text-reading leading-relaxed">
            {rest.map((paragraph) => (
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
