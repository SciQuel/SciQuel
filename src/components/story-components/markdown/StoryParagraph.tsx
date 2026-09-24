import { wrapFirstAsciiAlphanumeric } from "@/lib/wrap-first-ascii-alphanumeric";
import { type PropsWithChildren } from "react";

export default function StoryParagraph({
  children,
  isLead = false,
}: PropsWithChildren<{ isLead?: boolean }>) {
  return (
    <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[768px]">
      {isLead
        ? wrapFirstAsciiAlphanumeric(
            children,
            "font-customTest text-[1.25em] leading-none",
          )
        : children}
    </p>
  );
}
