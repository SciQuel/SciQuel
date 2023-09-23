"use client";

import { useContext, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

export default function StoryBlockquote({
  children,
}: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <blockquote
      className={
        isPrintMode
          ? "mx-0 flex h-fit w-screen justify-center py-3 text-center  [&>*]:px-2  [&>*]:text-2xl"
          : "h- mx-0 w-screen bg-gradient-to-b from-[#196E8C] to-[#65A69E] py-16 text-center text-sciquelCardBg [&>*]:px-2 [&>*]:font-alegreyaSansSC [&>*]:text-3xl [&>*]:md:w-screen [&>*]:md:px-36"
      }
    >
      {children}
    </blockquote>
  );
}
