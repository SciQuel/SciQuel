import { type PropsWithChildren } from "react";

export default function StoryParagraph({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <p className="story-paragraph mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 first:mt-6 first:first-letter:float-left first:first-letter:mr-[0.3rem] first:first-letter:font-customTest first:first-letter:text-[5rem] first:first-letter:leading-[54px] md:w-[768px]">
      {children}
    </p>
  );
}
