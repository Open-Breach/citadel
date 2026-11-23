import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { projectPage } from "@/content/site";
import type { ProjectPage } from "@/content/types";
import { Text } from "@/components/ui/text";

/** The project's top features: a name and a sentence or two each. */
export function Features({ page }: { page: ProjectPage }) {
  return (
    <section id="features" aria-labelledby="features-heading" className="pb-20 lg:pb-32">
      <Container className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <SectionHeading id="features-heading" className="lg:col-span-4">
          {projectPage.featuresHeading.text}
        </SectionHeading>
        <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {page.features.map((feature) => (
            <div key={feature.name.text} className="border-stone/40 border-t pt-5 pb-9">
              <dt className="text-basalt text-lg font-semibold tracking-[-0.01em]">
                {feature.name.text}
              </dt>
              <dd className="text-ocean mt-2 leading-relaxed"><Text>{feature.description.text}</Text></dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
