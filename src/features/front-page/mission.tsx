import { Container } from "@/components/ui/container";
import { Photograph } from "@/components/ui/photograph";
import { Text } from "@/components/ui/text";
import type { FrontPage } from "@/content/site";

/**
 * What Open-Breach is for, with the rocks in fog behind it.
 *
 * The photograph spans the section from edge to edge. Its upper part, the
 * fog, passes into the pale ground with no edge, and the text lies there in
 * the dark text colours. The rocks fill the lower part and close the section
 * with a straight edge. The section is as tall as the text and the rocks
 * need.
 */
export function Mission({ content }: { content: FrontPage["mission"] }) {
  return (
    <section
      id="mission"
      aria-labelledby="mission-heading"
      // At least as tall as the photograph, so that its fade starts at the top of the section.
      className="relative isolate min-h-[max(56.25vw,26rem)] overflow-hidden pt-20 lg:pt-32"
    >
      <Photograph
        id="rocksInFog"
        fadeIn
        sizes="(max-width: 640px) 180vw, 100vw"
        className="absolute inset-x-0 bottom-0 -z-10 h-[max(56.25vw,26rem)] [--fade-end:46%]"
        imageClassName="object-bottom"
      />
      {/* The text ends where the rocks begin. */}
      <Container className="grid grid-cols-1 gap-x-8 gap-y-8 pb-[max(31vw,15rem)] lg:grid-cols-12">
        <h2
          id="mission-heading"
          className="text-basalt text-xl font-semibold tracking-[-0.01em] lg:col-span-4 lg:pt-2"
        >
          <Text>{content.heading.text}</Text>
        </h2>
        <div className="lg:col-span-8">
          <p className="text-statement text-basalt max-w-[44rem]">
            <Text>{content.statement.text}</Text>
          </p>
          <div className="text-basalt mt-10 grid grid-cols-1 gap-x-10 gap-y-5 text-reading leading-relaxed md:grid-cols-2">
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
