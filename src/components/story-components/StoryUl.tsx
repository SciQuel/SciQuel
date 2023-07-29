import { type PropsWithChildren } from "react";

export default function StoryUl({ children }: PropsWithChildren<unknown>) {
  return (
    <ul className="mx-0 w-full font-sourceSerif4 text-lg font-[370] leading-8 md:w-[720px]">
      {children}
    </ul>
  );
}
