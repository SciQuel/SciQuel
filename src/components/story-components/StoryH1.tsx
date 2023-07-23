import { type PropsWithChildren } from "react";

export default function StoryH1({ children }: PropsWithChildren<unknown>) {
  return (
    <h1 className="mx-auto w-full text-4xl font-medium text-sciquelTeal md:w-[720px]">
      {children}
    </h1>
  );
}
