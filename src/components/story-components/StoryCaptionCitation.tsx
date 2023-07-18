import clsx from "clsx";
import { type PropsWithChildren } from "react";

export default function StoryCaptionCitation({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <div className="flex justify-center">
      <p
        className={clsx(
          "font-sourceSerif4 text-xs font-[370] leading-8 text-sciquelCitation",
          "@lg:w-[28rem] @3xl:w-[35rem] @5xl:w-[40rem] @7xl:w-[50rem]",
          "mx-10 @lg:mx-0",
          "story-citation",
        )}
      >
        {children}
      </p>
    </div>
  );
}
