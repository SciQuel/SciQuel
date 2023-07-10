import { type PropsWithChildren } from "react";

export default function StoryParagraph({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <p className="font-sourceSerif4 text-lg font-[370] leading-8 @xs:mx-[1rem] @md:mx-[2rem] @lg:mx-[5rem] @3xl:mx-[10rem] @5xl:mx-[15rem] @6xl:mx-[18rem]">
      {children}
    </p>
  );
}
