import { type PropsWithChildren } from "react";

export default function StoryH2({ children }: PropsWithChildren<unknown>) {
  return (
    <h2 className="mx-[30rem] text-3xl font-medium text-sciquelTeal">
      {children}
    </h2>
  );
}
