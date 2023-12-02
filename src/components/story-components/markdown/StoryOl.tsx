import { type PropsWithChildren } from "react";

export default function StoryOl({ children }: PropsWithChildren<unknown>) {
  return (
    <ol className=" mx-0 w-full list-inside list-decimal font-sourceSerif4 text-lg font-[370] leading-8 marker:font-semibold  md:w-[768px]">
      {children}
    </ol>
  );
}
