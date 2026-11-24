import Image from "next/image";
import { image } from "@/content/images";
import type { ImageId } from "@/content/types";
import { cn } from "@/lib/cn";

const tones = { basalt: "bg-basalt", ocean: "bg-ocean", haze: "bg-haze" };

/**
 * One of the site's photographs.
 *
 * It has a frame and, inside it, the picture's own box. The frame is what
 * the page shows. The box is where the picture is fitted, and it may be
 * larger than the frame: that is how a part of a photograph is chosen for
 * a place, in the page and not in the file.
 *
 * A photograph is delivered sharp: at the resolution of the screen, up to
 * the size of its file, as AVIF or WebP (see `images` in next.config.ts).
 * Nothing blurs it. While it loads, its place has a flat tone taken from
 * the picture, and no blurred preview. The frame is sized by the layout, so
 * nothing moves when the picture arrives.
 *
 * It is part of the scenery and says nothing a visitor has to read, so it
 * has an empty text alternative.
 */
export function Photograph({
  id,
  sizes,
  first = false,
  fadeIn = false,
  className,
  boxClassName = "absolute inset-0",
  imageClassName,
}: {
  id: ImageId;
  /** How wide the picture is shown, for the browser's choice of file. */
  sizes: string;
  /** The photograph of the first screen: requested with priority. */
  first?: boolean;
  /** The top of the frame passes into the ground above it, with no edge. */
  fadeIn?: boolean;
  /** The frame. */
  className?: string;
  /** The picture's box inside the frame. It fills the frame unless said otherwise. */
  boxClassName?: string;
  /** Where the picture is held when it is cropped by its box. */
  imageClassName?: string;
}) {
  const record = image(id);

  return (
    <div
      data-photograph={id}
      className={cn("overflow-hidden", tones[record.tone ?? "haze"], fadeIn && "fade-in-top", className)}
    >
      <div className={boxClassName}>
        <Image
          src={record.src}
          alt=""
          fill
          sizes={sizes}
          quality={85}
          preload={first}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  );
}
