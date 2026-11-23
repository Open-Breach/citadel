import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** The column the content keeps to: 1440 wide at most, with the margins of board B. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-[4.5rem]", className)}
      {...props}
    />
  );
}
