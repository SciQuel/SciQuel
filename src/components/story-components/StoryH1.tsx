import { type PropsWithChildren } from "react";

export default function StoryH1({ children }: PropsWithChildren<unknown>) {
  return (
    <h1 className="mx-[30rem] text-4xl font-medium text-sciquelTeal">
      {children}
    </h1>
  );
}
