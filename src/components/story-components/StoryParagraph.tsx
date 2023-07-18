import clsx from "clsx";
import { type PropsWithChildren } from "react";

export default function StoryParagraph({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <div className="flex justify-center">
      <p
        className={clsx(
          "font-sourceSerif4 text-lg font-[370] leading-8",
          "@lg:w-[28rem] @3xl:w-[35rem] @5xl:w-[40rem] @7xl:w-[50rem]",
          "mx-10 @lg:mx-0",
        )}
      >
        {children}
      </p>
    </div>
  );
}
