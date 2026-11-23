import { draft, type Project } from "@/content/types";

/**
 * A second project, made up for the tests. It proves that a project gets a
 * page from its content alone: it goes through the same template as Rick,
 * with different numbers of screenshots, features and platforms.
 */
export const secondProject: Project = {
  slug: "gossip",
  name: "Fixture",
  tagline: draft("A project that exists only in the tests."),
  platforms: { list: ["Linux"] },
  repository: "https://github.com/Open-Breach/fixture",
  page: {
    description: draft("The description of the fixture project."),
    what: draft("Fixture is a project that exists only in the tests."),
    why: {
      heading: draft("Why Fixture exists"),
      paragraphs: [draft("To prove that the project page is a template.")],
    },
    screenshots: [
      { image: "rickFrame", caption: draft("The first stand-in.") },
      { image: "rickDark", caption: draft("The second stand-in.") },
      { image: "rickLight", caption: draft("The third stand-in.") },
      { image: "landscape", caption: draft("The fourth stand-in.") },
    ],
    features: [
      { name: draft("One"), description: draft("The first feature.") },
      { name: draft("Two"), description: draft("The second feature.") },
      { name: draft("Three"), description: draft("The third feature.") },
    ],
    install: [
      {
        platform: "Linux",
        steps: [{ text: draft("Run the command."), command: draft("fixture --install") }],
      },
    ],
    badges: { version: "1.2.3", build: "failing", licence: "MIT", stars: 7, placeholder: true },
  },
};
