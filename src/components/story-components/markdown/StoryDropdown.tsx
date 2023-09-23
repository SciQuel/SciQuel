"use client";

import { Children, useContext, useState, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

export default function StoryDropdown({
  children,
}: PropsWithChildren<unknown>) {
  const [open, setOpen] = useState(false);
  const isPrintMode = useContext(PrintContext);
  const childArray = Children.toArray(children);

  if (childArray.length < 2) {
    return <></>;
  }
  return (
    <div className="mx-0 w-full md:w-[720px]">
      <div
        onClick={() => {
          setOpen(!open);
        }}
        aria-expanded={open || isPrintMode}
        className={`${
          isPrintMode ? "border-gray-900" : "cursor-pointer"
        } -ml-1 flex max-w-fit flex-row items-center rounded`}
      >
        <span className={`${isPrintMode ? "" : "text-sciquelTeal"} pr-2`}>
          {open || isPrintMode ? "⮟" : "⮞"}
        </span>{" "}
        {childArray[0]}
      </div>

      <div
        className={`${
          open || isPrintMode ? "max-h border-s-4 p-2" : "max-h-0"
        } ${
          isPrintMode ? "border-gray-900" : "border-sciquelTeal"
        } mt-3 overflow-hidden `}
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
