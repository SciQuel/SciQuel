import clsx from "clsx";
import { type PropsWithChildren } from "react";

export default function StoryH1({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="flex justify-center">
      <h1
        className={clsx(
          "mt-5 text-4xl font-medium text-sciquelTeal",
          "@lg:w-[28rem] @3xl:w-[35rem] @5xl:w-[40rem] @7xl:w-[50rem]",
          "mx-10 @lg:mx-0",
        )}
      >
        {children}
      </h1>
    </div>
  );
}
