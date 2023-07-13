import { type PropsWithChildren } from "react";

interface Props {
  src: string;
}

export default function StoryLargeImage({
  src,
  children,
}: PropsWithChildren<Props>) {
  return (
    <figure className="flex flex-col justify-center gap-2 md:w-11/12 md:min-w-[720px] ">
      <img src={src} />
      <figcaption>{children}</figcaption>
    </figure>
  );
}
