/**
 * The shapes of everything a page says.
 *
 * The files in this folder are read by the site and by Node directly (the
 * tests and `npm run placeholders`), so they import each other with the
 * `.ts` ending and use no path alias.
 */

/**
 * A piece of text. A text that is a draft carries the placeholder marker
 * until Serge has approved it; `npm run placeholders` lists every one.
 */
export type Copy = {
  text: string;
  placeholder?: true;
};

/** A text that is still a draft. */
export function draft(text: string): Copy {
  return { text, placeholder: true };
}

/** A text that is decided. */
export function final(text: string): Copy {
  return { text };
}

export type ProjectSlug = "rick" | "meeseeks" | "gossip" | "trebuchet" | "butterbot";

export type Platform = "Linux" | "macOS" | "Windows";

export type ImageId = string;

export type Screenshot = {
  image: ImageId;
  caption: Copy;
};

export type Feature = {
  name: Copy;
  description: Copy;
};

export type Download = {
  label: string;
  url: string;
};

export type InstallStep = {
  text: Copy;
  /** A command to run, shown as text that can be selected and copied. */
  command?: string;
  downloads?: Download[];
};

export type InstallInstructions = {
  platform: Platform;
  /** Which systems of the platform the steps are for. */
  note?: Copy;
  steps: InstallStep[];
};

/** The facts behind the four badges, in the shape the data from GitHub will have. */
export type Badges = {
  version: string;
  build: "passing" | "failing";
  licence: string;
  stars: number;
  /** Set while the values are sample data and not read from GitHub. */
  placeholder?: true;
};

/** Everything a project's page says. Every project page has these parts, in this order. */
export type ProjectPage = {
  /** For the page's metadata. */
  description: Copy;
  /** What the project is: the opening of the page. */
  what: Copy;
  /** How far along the project is, said plainly. */
  status?: Copy;
  why: {
    heading: Copy;
    paragraphs: Copy[];
  };
  screenshots: Screenshot[];
  features: Feature[];
  install: InstallInstructions[];
  /** A word of caution shown with the install steps. */
  installNote?: Copy;
  badges: Badges;
};

export type Project = {
  slug: ProjectSlug;
  name: string;
  /** One line on what the project is. */
  tagline: Copy;
  /** The platforms a program runs on. Empty for a project that is not a program. */
  platforms: {
    list: Platform[];
    /** Set while the platforms are not known. */
    placeholder?: true;
  };
  /** The project's repository on GitHub. */
  repository: string;
  /** The project's page. A project without one gets the still-to-come page. */
  page?: ProjectPage;
};

export type Release = {
  project: ProjectSlug;
  version: string;
  /** The day of the release, as YYYY-MM-DD. */
  date: string;
  url: string;
  /** Set while the entry is sample data and not read from GitHub. */
  placeholder?: true;
};

export type TeamMember = {
  name: Copy;
  role: Copy;
  line: Copy;
};

export type ImageRecord = {
  /** The file, relative to `public/images`. */
  file: string;
  width: number;
  height: number;
  /** What the image shows. The text alternative where the image carries meaning. */
  description: string;
  kind: "stand-in" | "screenshot" | "photograph";
  /** Where the image comes from. */
  source: string;
  author: string;
  licence: string;
  /** The pages that use the image. */
  usedOn: string[];
  /** Set while the image stands in for one that is still to be chosen. */
  placeholder?: true;
};
