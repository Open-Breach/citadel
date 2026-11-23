import { Text } from "@/components/ui/text";

/** The heading of a section, with an optional line under it. */
export function SectionHeading({
  id,
  children,
  intro,
  className,
}: {
  id: string;
  children: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 id={id} className="text-title text-basalt">
        <Text>{children}</Text>
      </h2>
      {intro ? (
        <p className="text-ocean mt-4 max-w-[34rem] text-lead">
          <Text>{intro}</Text>
        </p>
      ) : null}
    </div>
  );
}
