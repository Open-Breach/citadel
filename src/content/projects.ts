import { draft, type Project, type ProjectSlug } from "./types.ts";

/**
 * The five projects, in the order the site always shows them.
 *
 * A project with a `page` gets its own page at /projects/<slug>, made from
 * the one template in src/features/project-page. Giving a project a page
 * means filling in `page` here, and nothing else.
 *
 * The texts are drafts. Rick's follow the README of Open-Breach/rick; the
 * one-liners of the others follow their READMEs.
 *
 * Rick's downloads were checked on 23 November 2026: v0.6.0 is the latest
 * release and each file is there. A way of installing that is announced
 * but not published is named as still to come and shows no command.
 */

const rickRelease = "https://github.com/Open-Breach/rick/releases/download/v0.6.0";

export const projects: Project[] = [
  {
    slug: "rick",
    name: "Rick",
    tagline: draft("A file manager written in Rust."),
    platforms: { list: ["Linux", "macOS", "Windows"] },
    repository: "https://github.com/Open-Breach/rick",
    page: {
      description: draft(
        "Rick is a fast, lean file manager for Linux, macOS and Windows, with previews for 87 file types and an extensible plugin ecosystem.",
      ),
      what: draft(
        "Rick is a fast, lean file manager for professionals. It runs on Linux, macOS and Windows from a single codebase and behaves the same on all three. A small core does the basics, and everything else comes from plugins.",
      ),
      status: draft("Rick is early and not fully tested yet, so expect bugs."),
      why: {
        heading: draft("Why Rick exists"),
        paragraphs: [
          draft(
            "Open source always carried one handicap: it could never throw the resources at a project that a big company can. AI is changing that, and Rick is built on that bet.",
          ),
          draft(
            "Linux today is a polished system that simply works. What it was missing is a file manager as capable as Windows Explorer, and with room to be better. Finder on macOS leaves the same gap.",
          ),
          draft(
            "More and more people will move to Linux. Those who come from Windows are used to the mouse and a graphical interface, not only the console, and they need a powerful file manager. Rick is built for them, and it is the same program on all three systems.",
          ),
        ],
      },
      screenshots: [
        {
          image: "rickLight",
          caption: draft("Two panes side by side, with a 3D model in the preview pane."),
        },
        {
          image: "rickDark",
          caption: draft("The same view in the dark theme."),
        },
        {
          image: "rickFrame",
          caption: draft("A third screenshot is still to be chosen."),
        },
      ],
      features: [
        {
          name: draft("Previews 87 file types"),
          description: draft(
            "Images, audio and video, documents, 3D models, source code, archives and disk images, without opening another program.",
          ),
        },
        {
          name: draft("Panes and tabs"),
          description: draft(
            "Split panes side by side, drag them around, and keep as many tabs as you like.",
          ),
        },
        {
          name: draft("Local, remote and cloud"),
          description: draft(
            "Browses local disks, archives, SSH, ZFS and cloud storage such as S3, Azure Blob and Google Cloud Storage. Searches through the index your system already keeps.",
          ),
        },
        {
          name: draft("Works with Git and SVN"),
          description: draft(
            "Status badges in the file list, and the actions you need in the context menu.",
          ),
        },
        {
          name: draft("Manages tarballs and AppImages"),
          description: draft(
            "A tar.gz or AppImage download becomes a managed install instead of a folder you forget about. On Linux only.",
          ),
        },
        {
          name: draft("Small things done right"),
          description: draft("Such as computing the hash of a file from the context menu."),
        },
      ],
      install: [
        {
          platform: "Linux",
          note: draft("Debian, Ubuntu, Fedora and the distributions based on them"),
          steps: [
            {
              text: draft(
                "Run Rick from the archive, with nothing installed. It needs glibc 2.36 or later, which Debian 12 and Ubuntu 24.04 have.",
              ),
              downloads: [
                { label: "Linux x64", url: `${rickRelease}/rick-0.6.0-linux-x64.tar.gz` },
                { label: "Linux arm64", url: `${rickRelease}/rick-0.6.0-linux-arm64.tar.gz` },
              ],
              command: draft("tar xzf rick-0.6.0-linux-x64.tar.gz && ./rick-0.6.0-linux-x64/rick"),
            },
            {
              // Announced, not published: named without a command (design D11 of add-photographs).
              text: draft(
                "Installing Rick from the Open-Breach package repository, with apt or dnf, so that updates arrive with those of your system.",
              ),
              stillToCome: true,
            },
          ],
        },
        {
          platform: "macOS",
          note: draft("Apple silicon"),
          steps: [
            {
              text: draft(
                "Download the archive, unzip it, drag Rick.app to Applications and open it. The app is not notarised yet: allow it under System Settings, Privacy & Security.",
              ),
              downloads: [{ label: "macOS arm64", url: `${rickRelease}/rick-0.6.0-macos-arm64.zip` }],
            },
          ],
        },
        {
          platform: "Windows",
          note: draft("x64"),
          steps: [
            {
              text: draft(
                "Download the archive, unpack it and run rick.exe. SmartScreen may warn the first time.",
              ),
              downloads: [{ label: "Windows x64", url: `${rickRelease}/rick-0.6.0-windows-x64.zip` }],
            },
          ],
        },
      ],
      installNote: draft(
        "Rick moves, renames and deletes your files, and it is young software. Until 1.0, run it on data you have backed up and treat every release as a preview.",
      ),
      badges: {
        version: "0.6.0",
        build: "passing",
        licence: "Apache-2.0",
        stars: 128,
        placeholder: true,
      },
    },
  },
  {
    slug: "meeseeks",
    name: "Meeseeks",
    tagline: draft("A virtual second monitor for Linux."),
    platforms: { list: ["Linux"] },
    repository: "https://github.com/Open-Breach/meeseeks",
  },
  {
    slug: "gossip",
    name: "Gossip",
    tagline: draft("A terminal tool that follows the logs of Kubernetes workloads."),
    platforms: { list: ["Linux", "macOS", "Windows"] },
    repository: "https://github.com/Open-Breach/gossip",
  },
  {
    slug: "trebuchet",
    name: "Trebuchet",
    tagline: draft("Builds the packages of every Open-Breach project and publishes them."),
    // Trebuchet is not a program that a visitor runs, so it lists no platforms.
    platforms: { list: [] },
    repository: "https://github.com/Open-Breach/trebuchet",
  },
  {
    slug: "butterbot",
    name: "Butterbot",
    tagline: draft("A small program that keeps your certificates renewed."),
    // Butterbot is at its design stage. Its platforms are not known yet.
    platforms: { list: [], placeholder: true },
    repository: "https://github.com/Open-Breach/butterbot",
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function projectBySlug(slug: ProjectSlug): Project {
  const project = findProject(slug);
  if (!project) throw new Error(`No project with the slug "${slug}"`);
  return project;
}
