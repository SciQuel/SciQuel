import { type PropsWithChildren } from "react";

export default function StoryParagraph({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <p className="mx-[30rem] font-sourceSerif4 text-lg font-[370] leading-8">
      {children}
    </p>
  );
}
