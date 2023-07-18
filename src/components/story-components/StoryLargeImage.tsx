import clsx from "clsx";
import { type PropsWithChildren } from "react";

interface Props {
  src: string;
}

export default function StoryLargeImage({
  src,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="flex justify-center">
      <figure
        className={clsx(
          "flex flex-col justify-center gap-2",
          "@lg:w-[28rem] @3xl:w-[42rem] @5xl:w-[50rem] @7xl:w-[60rem]",
          "mx-10 @lg:mx-0",
        )}
      >
        <img src={src} />
        <figcaption>{children}</figcaption>
      </figure>
    </div>
  );
}
