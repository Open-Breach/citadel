import Link from "next/link";
import { Fragment } from "react";
import { Container } from "@/components/ui/container";
import { ArrowOutIcon } from "@/components/ui/icons";
import { Photograph } from "@/components/ui/photograph";
import { Text } from "@/components/ui/text";
import { photographs } from "@/content/images";
import { footer, site, ui } from "@/content/site";

const linkClasses =
  "text-mist decoration-fog inline-flex min-h-11 items-center gap-1.5 rounded-sm underline-offset-[0.4em] hover:underline";

/**
 * How every page ends: the stacks under the amber sky, then the footer.
 *
 * The sky of the photograph passes into the pale ground above it with no
 * edge, the tips of the stacks are in full view, and below the horizon the
 * sea passes into the Ocean of the footer. No text lies over the picture.
 *
 * The footer links to the Open-Breach organisation on GitHub and to the
 * community, to support once that has a target, and credits the
 * photographers, each name leading to the page the photograph comes from.
 */
export function Footer({ supportUrl = site.supportUrl }: { supportUrl?: string | null }) {
  const credited = photographs();

  return (
    <footer className="on-dark mt-auto">
      <div className="bg-haze relative h-[max(43vw,17rem)]">
        <Photograph
          id="stacksAmberSky"
          fadeIn
          sizes="(max-width: 640px) 160vw, 100vw"
          className="absolute inset-0 [--fade-end:30%]"
          // The frame shows the picture from 10 to 78 per cent of its height: the tips of
          // the stacks below the fade, and the horizon in the lower third.
          boxClassName="absolute inset-x-0 top-[-14.7%] h-[147%]"
          imageClassName="object-[58%_50%]"
        />
        {/* Below the horizon the sea passes into the footer's Ocean. */}
        <div
          aria-hidden="true"
          className="to-ocean absolute inset-x-0 bottom-0 h-[14%] bg-linear-to-b from-transparent"
        />
      </div>
      <div className="bg-ocean text-mist">
        <Container className="pt-12 pb-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-fine font-semibold tracking-[0.16em] uppercase">{site.name}</p>
              <p className="text-fog mt-3 text-control">
                <Text>{footer.line.text}</Text>
              </p>
            </div>
            <nav aria-label={ui.footerNavigation.text}>
              <ul className="flex flex-col gap-x-9 text-control sm:flex-row sm:items-center">
                <li>
                  <a href={site.githubUrl} className={linkClasses}>
                    {ui.githubLink.text}
                    <ArrowOutIcon />
                  </a>
                </li>
                <li>
                  <Link href="/community" className={linkClasses}>
                    {ui.communityLink.text}
                  </Link>
                </li>
                <li>
                  <Link href="/charter" className={linkClasses}>
                    {ui.charterLink.text}
                  </Link>
                </li>
                {supportUrl ? (
                  <li>
                    <a href={supportUrl} className={linkClasses}>
                      {ui.support.text}
                      <ArrowOutIcon />
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
          <p data-credits className="border-fog/30 text-fog mt-8 border-t pt-5 text-fine leading-loose">
            {footer.credits.text}{" "}
            {credited.map((photograph, index) => (
              <Fragment key={photograph.file}>
                {index > 0 ? (index === credited.length - 1 ? ` ${footer.creditsAnd.text} ` : ", ") : null}
                <a
                  href={photograph.source}
                  className="text-mist decoration-fog relative rounded-sm underline underline-offset-[0.3em] after:absolute after:inset-x-0 after:-inset-y-3.5 hover:decoration-mist"
                >
                  {photograph.author}
                </a>
              </Fragment>
            ))}
            .
          </p>
        </Container>
      </div>
    </footer>
  );
}
