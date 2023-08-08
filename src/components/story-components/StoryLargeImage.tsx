"use client"

import {PrintContext} from "./PrintContext";
import { type PropsWithChildren, useContext } from "react";

interface Props {
  src: string;
}

export default function StoryLargeImage({
  src,
  children,
}: PropsWithChildren<Props>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <div className="flex justify-center">
      <figure className="mx-auto table gap-2 p-8 lg:w-min lg:p-0">
        <img
          src={src}
          className={`${isPrintMode ? "md:max-w-[720px]" : "lg:max-w-[1000px]" } max-w-screen max-h-[900px] w-auto`}
        />
        <figcaption className="table-caption w-full caption-bottom px-8 lg:px-0">
          {children}
        </figcaption>
      </figure>
    </div>
  );
}
