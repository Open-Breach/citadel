import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { FrontPage } from "@/content/site";
import type { TeamMember } from "@/content/types";
import { Text } from "@/components/ui/text";

/** The people behind Open-Breach: a name, a role and one line each. */
export function Team({ content, team }: { content: FrontPage["team"]; team: TeamMember[] }) {
  return (
    <section id="team" aria-labelledby="team-heading" className="pb-20 lg:pb-32">
      <Container className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
        <SectionHeading id="team-heading" intro={content.intro.text} className="lg:col-span-4">
          {content.heading.text}
        </SectionHeading>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-8">
          {team.map((member) => (
            <li key={member.name.text} className="border-stone/40 border-t pt-5">
              <h3 className="text-basalt text-xl font-semibold tracking-[-0.01em]">
                {member.name.text}
              </h3>
              <p className="text-basalt mt-1 text-sm">{member.role.text}</p>
              <p className="text-ocean mt-3 leading-relaxed"><Text>{member.line.text}</Text></p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
