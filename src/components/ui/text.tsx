import { Fragment } from "react";
import { site } from "@/content/site";

/**
 * A text in which the name Open-Breach never breaks at its hyphen.
 */
export function Text({ children }: { children: string }) {
  const parts = children.split(site.name);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 ? <span className="whitespace-nowrap">{site.name}</span> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
