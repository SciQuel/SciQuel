import { type PropsWithChildren } from "react";

interface Props {
  src: string;
}

export default function StoryLargeImage({
  src,
  children,
}: PropsWithChildren<Props>) {
  return (
    <figure className="flex flex-col justify-center gap-2 @xs:mx-[1rem] @md:mx-[2rem] @lg:mx-[5rem] @5xl:mx-[10rem]">
      <img src={src} />
      <figcaption>{children}</figcaption>
    </figure>
  );
}
