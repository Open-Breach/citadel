import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import type { FrontPage } from "@/content/site";

/**
 * The statement that the work is done with Claude, and how: three steps in
 * their order, each hanging from a tick of one ruled line.
 */
export function BuiltWithClaude({ content }: { content: FrontPage["claude"] }) {
  return (
    <section id="built-with-claude" aria-labelledby="claude-heading" className="py-20 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-12">
          <h2 id="claude-heading" className="text-basalt text-xl font-semibold tracking-[-0.01em] lg:pt-2 lg:col-span-4">
            {content.heading.text}
          </h2>
          <p className="text-statement text-basalt max-w-[44rem] lg:col-span-8">
            <Text>{content.statement.text}</Text>
          </p>
        </div>
        <ol className="border-stone mt-12 grid grid-cols-1 border-t md:grid-cols-3 lg:mt-16">
          {content.steps.map((step) => (
            <li
              key={step.name.text}
              className="before:bg-stone border-stone/40 relative border-b py-6 before:absolute before:top-0 before:left-0 before:h-3 before:w-px md:border-b-0 md:pt-8 md:pr-10 md:pb-0"
            >
              <h3 className="text-basalt text-lg font-semibold tracking-[-0.01em]">
                {step.name.text}
              </h3>
              <p className="text-ocean mt-2 max-w-[26rem] leading-relaxed"><Text>{step.description.text}</Text></p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
