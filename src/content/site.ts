import { draft, final, type Copy } from "./types.ts";

/**
 * What every page shares, and what the front page says.
 * The entries of the navigation and the two calls to action are decided
 * (design D4, board B). The other texts are drafts.
 */

export const site = {
  name: "Open-Breach",
  /** For the metadata of the front page. */
  description: draft(
    "Open-Breach builds open source tools in the open: Rick, Meeseeks, Gossip, Trebuchet and Butterbot.",
  ),
  /** The Open-Breach organisation on GitHub. */
  githubUrl: "https://github.com/Open-Breach",
  /**
   * The target of the support link. While it is null, the navigation and
   * the footer show no support link and leave no gap for one.
   */
  supportUrl: null as string | null,
};

/** The two calls to action (design D4). */
export const calls = {
  install: { label: "Install", href: "/#projects" },
  discuss: { label: "Join the discussion", href: "/community" },
};

/** The entries of the navigation, in order (design D4). */
export const navigation = [
  { label: "Projects", href: "/#projects" },
  { label: "Community", href: "/community" },
  { label: "Charter", href: "/charter" },
  { label: "Team", href: "/#team" },
];

/** Short labels of the interface. */
export const ui = {
  support: final("Support"),
  menu: final("Menu"),
  closeMenu: final("Close menu"),
  explore: final("Explore"),
  projectLabel: final("Project"),
  copy: final("Copy"),
  copied: final("Copied"),
  close: final("Close"),
  viewLarger: final("View larger"),
  frontPageLink: final("Back to the front page"),
  githubLink: final("Open-Breach on GitHub"),
  communityLink: final("Community"),
  charterLink: final("Charter"),
  sourceLink: final("Source on GitHub"),
  mainNavigation: final("Main"),
  footerNavigation: final("Footer"),
  runsOn: final("Runs on"),
  download: final("Download"),
};

/**
 * The texts that every project page shares. `{name}` and `{licence}` stand
 * for the project's name and licence.
 */
export const projectPage = {
  screenshotsHeading: draft("Screenshots"),
  featuresHeading: draft("Top features"),
  installHeading: draft("Install"),
  installIntro: draft("{name} runs on these platforms. Pick yours."),
  sourceHeading: draft("Read the source"),
  sourceText: draft(
    "{name} is open source under the {licence} licence. The code, the issues and the releases are on GitHub.",
  ),
  badges: {
    version: final("Version"),
    build: final("Build"),
    licence: final("Licence"),
    stars: final("Stars"),
  },
};

export const footer = {
  line: draft("Open tools, built in the open."),
};

export const notFound = {
  heading: draft("This page does not exist."),
  text: draft("The address may be mistyped, or the page may have moved."),
};

/** The page shown in place of a page that is not built yet. */
export const stillToCome = {
  /** The heading names the page: "Community is still to come." */
  headingAfterName: draft("is still to come."),
  text: draft(
    "This page is not built yet. The site is growing in rounds, and this is one of the next.",
  ),
};

export type FrontPage = typeof frontPage;

export const frontPage = {
  hero: {
    label: draft("Open-Breach · Open source tools"),
    /** One entry per line of the headline. */
    headline: [draft("Open tools,"), draft("built in the open.")],
    intro: draft(
      "Open-Breach builds the next generation of tools as free software. Rick, Meeseeks, Gossip, Trebuchet and Butterbot.",
    ),
    /** The project shown in the card of the first screen, as on board B. */
    featuredProject: "rick" as const,
  },
  mission: {
    heading: draft("What Open-Breach is for"),
    statement: draft(
      "Open-Breach exists so that the next generation of tools is open source, and nobody has to wait for a big company to build it.",
    ),
    paragraphs: [
      draft(
        "Open source always carried one handicap: it could never put the resources behind a project that a big company can. AI changes that. A small team can now build, in the open, what used to need a company.",
      ),
      draft(
        "So Open-Breach builds tools by people for people, tools they really love to use, with no other interest behind them. The plan is for Open-Breach to become a non-profit organisation.",
      ),
    ],
  },
  projects: {
    heading: draft("Five projects"),
    intro: draft("Each one is free software, developed in public on GitHub."),
  },
  claude: {
    heading: draft("Built with Claude"),
    statement: draft(
      "The projects of Open-Breach are built with Claude, the AI model made by Anthropic. People decide what gets built, and people answer for it.",
    ),
    steps: [
      {
        name: draft("Specified by people"),
        description: draft(
          "Each project has a written specification. It is the source of truth for what the project does.",
        ),
      },
      {
        name: draft("Written with Claude"),
        description: draft(
          "Claude writes most of the code from that specification, which makes a project fast to build and easy to audit.",
        ),
      },
      {
        name: draft("Reviewed and tested"),
        description: draft(
          "People review the changes, and every change has to pass the tests before it is merged.",
        ),
      },
    ] as { name: Copy; description: Copy }[],
  },
  releases: {
    heading: draft("Latest releases"),
    intro: draft("The newest releases across the five projects."),
  },
  team: {
    heading: draft("The team"),
    intro: draft("The people behind Open-Breach."),
  },
  closing: {
    heading: draft("Try a tool. Tell us what breaks."),
    text: draft(
      "Everything here is young software. An honest report of what you saw is the most useful thing you can give.",
    ),
  },
};
