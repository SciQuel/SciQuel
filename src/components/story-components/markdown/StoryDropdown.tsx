"use client";

import { Children, useContext, useState, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

export default function StoryDropdown({
  children,
}: PropsWithChildren<unknown>) {
  const [open, setOpen] = useState(false);
  const isPrintMode = useContext(PrintContext);
  const childArray = Children.toArray(children);

  return (
    <div className="mx-0 w-full  md:w-[720px]">
      <div
        onClick={() => {
          setOpen(!open);
        }}
        aria-expanded={open}
        className={`${
          isPrintMode
            ? "border-2 border-gray-900 px-2"
            : " bg-sciquelTeal p-2 text-sciquelCardBg"
        } flex max-w-fit cursor-pointer flex-row items-center rounded [&>*:first-child]:max-w-fit`}
      >
        {childArray[0]} <span className="p-2">{open ? "⮟" : "⮞"}</span>
      </div>

      <div
        className={`${open ? "max-h border-2 p-2" : "max-h-0"} ${
          isPrintMode ? "border-gray-900" : "border-sciquelTeal"
        } mt-3 overflow-hidden rounded `}
      >
        {Children.map(childArray, (child, index) => {
          if (index > 0) {
            return child;
          } else {
            return <></>;
          }
        })}
      </div>
    </div>
  );
}
