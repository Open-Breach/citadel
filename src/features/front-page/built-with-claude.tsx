import { Container } from "@/components/ui/container";
import type { FrontPage } from "@/content/site";

/** The statement that the work is done with Claude, and how. */
export function BuiltWithClaude({ content }: { content: FrontPage["claude"] }) {
  return (
    <section id="built-with-claude" aria-labelledby="claude-heading" className="py-20 lg:py-32">
      <Container className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="claude-heading" className="text-title text-basalt">
            {content.heading.text}
          </h2>
          <p className="text-ocean mt-5 max-w-[30rem] text-lead">{content.statement.text}</p>
        </div>
        <dl className="border-stone/40 border-b lg:col-span-6 lg:col-start-7">
          {content.steps.map((step) => (
            <div
              key={step.name.text}
              className="border-stone/40 grid gap-x-6 gap-y-1.5 border-t py-5 sm:grid-cols-[11rem_1fr]"
            >
              <dt className="text-basalt font-medium">{step.name.text}</dt>
              <dd className="text-ocean leading-relaxed">{step.description.text}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
