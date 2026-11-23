import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ScaleRule } from "@/components/ui/scale-rule";
import { calls, type FrontPage } from "@/content/site";

/** The two calls to action again, before the page ends at the shore. */
export function Closing({ content }: { content: FrontPage["closing"] }) {
  return (
    <section
      id="next"
      aria-labelledby="closing-heading"
      className="from-mist to-haze bg-linear-to-b pt-20 pb-16 lg:pt-28 lg:pb-24"
    >
      <Container>
        <h2 id="closing-heading" className="text-title text-basalt">
          {content.heading.text}
        </h2>
        <p className="text-ocean mt-5 max-w-[34rem] text-lead">{content.text.text}</p>
        <ScaleRule className="mt-7 max-w-[22.5rem]" />
        <div className="mt-3 flex flex-wrap gap-3">
          <Button href={calls.install.href}>{calls.install.label}</Button>
          <Button href={calls.discuss.href} variant="outlined">
            {calls.discuss.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
