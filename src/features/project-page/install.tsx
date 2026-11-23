import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { DownloadIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { projectPage, ui } from "@/content/site";
import type { Project, ProjectPage } from "@/content/types";
import { CopyButton } from "./copy-button";

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
                  <p className="text-ocean mt-1.5 text-[0.9375rem]">{instructions.note.text}</p>
                ) : null}
              </div>
              <ol className="min-w-0 space-y-8 lg:col-span-8">
                {instructions.steps.map((step) => (
                  <li key={step.text.text}>
                    <p className="text-basalt max-w-[40rem] leading-relaxed">{step.text.text}</p>
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
                      <div className="border-stone/60 bg-white rounded-control mt-4 flex items-start gap-3 border py-2 pr-2 pl-4">
                        <pre className="text-basalt min-w-0 flex-1 overflow-x-auto py-1.5 font-mono text-sm leading-relaxed">
                          <code>{step.command}</code>
                        </pre>
                        <CopyButton
                          text={step.command}
                          labels={{ copy: ui.copy.text, copied: ui.copied.text }}
                        />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {page.installNote ? (
          <p className="text-ocean mt-8 max-w-[40rem] leading-relaxed">{page.installNote.text}</p>
        ) : null}
      </Container>
    </section>
  );
}
