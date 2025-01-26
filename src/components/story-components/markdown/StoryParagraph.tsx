import { type PropsWithChildren } from "react";

export default function StoryParagraph({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <p className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[768px]">
      {children}
    </p>
  );
}
