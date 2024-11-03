import { type HTMLProps, type PropsWithChildren } from "react";

export default function StoryLink({
  children,
  href,
}: PropsWithChildren<HTMLProps<HTMLAnchorElement>>) {
  return (
    <a
      target="_blank"
      className="text-sky-700 underline visited:text-purple-700"
      href={href}
    >
      {children}
    </a>
  );
}
