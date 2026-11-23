import { projects } from "@/content/projects";
import { calls, navigation, site, ui } from "@/content/site";
import { NavigationBar } from "./navigation-bar";

/**
 * The navigation every page shows: the name as the link to the front page,
 * the entries of design D4, a support link once it has a target, and the
 * Install call to action, which on a project page leads to that page's
 * install instructions. It stays at the top while the page scrolls under it.
 */
export function Navigation({
  supportUrl = site.supportUrl,
  fixed = true,
}: {
  supportUrl?: string | null;
  /** Off only where a test page shows a second navigation inside the page. */
  fixed?: boolean;
}) {
  const bar = (
    <NavigationBar
      name={site.name}
      entries={navigation}
      install={calls.install}
      support={supportUrl ? { label: ui.support.text, href: supportUrl } : null}
      projectPages={projects
        .filter((project) => project.page)
        .map((project) => `/projects/${project.slug}`)}
      labels={{
        navigation: ui.mainNavigation.text,
        menu: ui.menu.text,
        closeMenu: ui.closeMenu.text,
      }}
    />
  );

  if (!fixed) return <div className="flex">{bar}</div>;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-[90rem] px-3 pt-3 sm:px-6 lg:px-[4.5rem] lg:pt-7">
        {bar}
      </div>
    </header>
  );
}
