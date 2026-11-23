import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowOutIcon } from "@/components/ui/icons";
import { image } from "@/content/images";
import { footer, site, ui } from "@/content/site";
import { Text } from "@/components/ui/text";

const linkClasses =
  "text-mist decoration-fog inline-flex min-h-11 items-center gap-1.5 rounded-sm underline-offset-[0.4em] hover:underline";

/**
 * The footer every page ends with: the shore, then the water. It links to
 * the Open-Breach organisation on GitHub and to the community, and to
 * support once that has a target.
 */
export function Footer({ supportUrl = site.supportUrl }: { supportUrl?: string | null }) {
  const shore = image("shore");

  return (
    <footer className="on-dark mt-auto">
      <div className="bg-haze relative h-[max(9rem,15.3vw)] overflow-hidden">
        <Image
          src={shore.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
      <div className="bg-ocean text-mist water-lines">
        <Container className="flex flex-col gap-10 pt-20 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-fine font-semibold tracking-[0.16em] uppercase">
              {site.name}
            </p>
            <p className="text-fog mt-3 text-control"><Text>{footer.line.text}</Text></p>
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
        </Container>
      </div>
    </footer>
  );
}
