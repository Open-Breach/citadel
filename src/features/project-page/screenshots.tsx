import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { image } from "@/content/images";
import { projectPage, ui } from "@/content/site";
import type { ProjectPage } from "@/content/types";
import { ScreenshotGallery } from "./screenshot-gallery";

/** The project's screenshots, each with a text alternative and a larger view. */
export function Screenshots({ page }: { page: ProjectPage }) {
  const items = page.screenshots.map((screenshot) => {
    const record = image(screenshot.image);
    return {
      src: record.src,
      width: record.width,
      height: record.height,
      description: record.description,
      caption: screenshot.caption.text,
    };
  });

  return (
    <section id="screenshots" aria-labelledby="screenshots-heading" className="pb-20 lg:pb-32">
      <Container>
        <SectionHeading id="screenshots-heading">
          {projectPage.screenshotsHeading.text}
        </SectionHeading>
        <div className="mt-10">
          <ScreenshotGallery
            items={items}
            labels={{ viewLarger: ui.viewLarger.text, close: ui.close.text }}
          />
        </div>
      </Container>
    </section>
  );
}
