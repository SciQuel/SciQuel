"use client";

import { useContext, type PropsWithChildren } from "react";
import { PrintContext } from "./PrintContext";

interface Props {
  src: string;
  alt?: string;
}

export default function StoryLargeImage({
  src,
  alt,
  children,
}: PropsWithChildren<Props>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <div className="flex justify-center">
      <figure className="mx-auto table gap-2 p-8 lg:w-min lg:p-0">
        <img
          src={src}
          className={`${
            isPrintMode ? "md:max-w-[720px]" : "lg:max-w-[1000px]"
          } max-w-screen max-h-[900px] w-auto`}
          alt={alt}
        />
        <figcaption className="table-caption w-full caption-bottom px-8 lg:px-0">
          {children}
        </figcaption>
      </figure>
    </div>
  );
}
