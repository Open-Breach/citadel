import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DownloadIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { projectPage, ui } from "@/content/site";
import type { Project, ProjectPage } from "@/content/types";
import { CopyButton } from "./copy-button";
import { Text } from "@/components/ui/text";

/**
 * How to install the project, for each platform it runs on. A command is
 * text in the page: it can be selected, and copied with its button.
 */
export function Install({ project, page }: { project: Project; page: ProjectPage }) {
  return (
    <section id="install" aria-labelledby="install-heading" className="pb-20 lg:pb-32">
      <Container>
        <SectionHeading
          id="install-heading"
          intro={projectPage.installIntro.text.replace("{name}", project.name)}
        >
          {projectPage.installHeading.text}
        </SectionHeading>

        {page.installNote ? (
          // Said before the commands, where everyone who installs reads it.
          <p className="border-stone/60 text-basalt rounded-control mt-8 max-w-[44rem] border bg-white/70 px-5 py-4 leading-relaxed">
            <Text>{page.installNote.text}</Text>
          </p>
        ) : null}

        <div className="border-stone/40 mt-10 border-b">
          {page.install.map((instructions) => (
            <div
              key={instructions.platform}
              data-platform={instructions.platform}
              className="border-stone/40 grid grid-cols-1 gap-x-8 gap-y-5 border-t py-8 lg:grid-cols-12 lg:py-10"
            >
              <div className="lg:col-span-4">
                <h3 className="text-basalt text-2xl font-semibold tracking-[-0.02em]">
                  {instructions.platform}
                </h3>
                {instructions.note ? (
                  <p className="text-ocean mt-1.5 text-control">{instructions.note.text}</p>
                ) : null}
              </div>
              <ul className="min-w-0 space-y-8 lg:col-span-8">
                {instructions.steps.map((step) => (
                  <li key={step.text.text} data-step>
                    <p className="text-basalt max-w-[40rem] leading-relaxed">
                      <Text>{step.text.text}</Text>
                    </p>
                    {step.downloads ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {step.downloads.map((download) => (
                          <li key={download.url} className="flex">
                            <a href={download.url} className={buttonClasses("outlined", "sm")}>
                              <DownloadIcon />
                              <span className="sr-only">{ui.download.text}</span>
                              {download.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {step.command ? (
                      // On a narrow screen the command wraps, so that all of it shows.
                      <div className="border-stone/60 bg-white rounded-control mt-4 flex flex-col items-end gap-2 border p-2 pl-4 sm:flex-row sm:items-start sm:gap-3">
                        <pre className="text-basalt w-full min-w-0 flex-1 py-1.5 font-mono text-sm leading-relaxed break-all whitespace-pre-wrap sm:overflow-x-auto sm:break-normal sm:whitespace-pre">
                          <code>{step.command.text}</code>
                        </pre>
                        <CopyButton
                          text={step.command.text}
                          labels={{ copy: ui.copy.text, copied: ui.copied.text }}
                        />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
