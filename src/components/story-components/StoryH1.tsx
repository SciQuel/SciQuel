import { type PropsWithChildren } from "react";

export default function StoryH1({ children }: PropsWithChildren<unknown>) {
  return (
    <h1 className="text-4xl font-medium text-sciquelTeal @xs:mx-[1rem] @md:mx-[2rem] @lg:mx-[5rem] @3xl:mx-[10rem] @5xl:mx-[15rem] @6xl:mx-[18rem]">
      {children}
    </h1>
  );
}
