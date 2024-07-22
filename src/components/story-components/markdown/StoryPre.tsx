import { type PropsWithChildren } from "react";

export default function StoryPre({ children }: PropsWithChildren<unknown>) {
  return (
    <pre
      className={
        "mx-0 my-1 w-full font-sourceSerif4 text-lg font-[370] md:w-[768px] [&>code]:block [&>code]:w-full"
      }
    >
      {children}
    </pre>
  );
}
