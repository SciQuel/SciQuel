import { type PropsWithChildren } from "react";

interface Props {
  src: string;
}

export default function StoryLargeImage({
  src,
  children,
}: PropsWithChildren<Props>) {
  return (
    <figure className="mx-80 flex flex-col justify-center gap-2">
      <img src={src} />
      <figcaption>{children}</figcaption>
    </figure>
  );
}
