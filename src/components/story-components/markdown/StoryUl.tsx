import { type PropsWithChildren } from "react";

export default function StoryUl({ children }: PropsWithChildren<unknown>) {
  return (
    <ul className="mx-0 w-full list-inside list-disc font-sourceSerif4 text-lg font-[370] leading-8  md:w-[768px]">
      {children}
    </ul>
  );
}
