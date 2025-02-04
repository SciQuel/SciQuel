import { type PropsWithChildren } from "react";

export default function StoryGrayText({
  children,
}: PropsWithChildren<unknown>) {
  return <span className={"text-sciquelCitation"}>{children}</span>;
}
