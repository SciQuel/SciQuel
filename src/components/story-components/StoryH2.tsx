import { type PropsWithChildren } from "react";

export default function StoryH2({ children }: PropsWithChildren<unknown>) {
  return (
    <h2 className="mx-auto w-full  text-3xl font-medium text-sciquelTeal md:w-[720px]">
      {children}
    </h2>
  );
}
