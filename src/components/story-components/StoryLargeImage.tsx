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
      <figure className="mx-auto table gap-2 p-8 lg:w-min lg:p-0">
        <img
          src={src}
          className="max-w-screen max-h-[900px] w-auto lg:max-w-[1000px]"
        />
        <figcaption className="table-caption w-full caption-bottom px-8 lg:px-0">
          {children}
        </figcaption>
      </figure>
    </div>
  );
}
