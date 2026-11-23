import { draft, type TeamMember } from "./types.ts";

/**
 * The team: people only. An AI is never listed here.
 * Both entries are placeholders until Serge supplies names, roles and lines
 * (design D5).
 */
export const team: TeamMember[] = [
  {
    name: draft("Serge"),
    role: draft("Founder and maintainer"),
    line: draft("Started Open-Breach to build the tools he was missing."),
  },
  {
    name: draft("A second contributor"),
    role: draft("Contributor"),
    line: draft("The name, the role and this line are still to come."),
  },
];
