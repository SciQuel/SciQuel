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
    <div className="mx-0 w-full px-1 md:w-[768px]">
      <div
        role="button"
        onKeyDown={(e) => {
          console.log(e);
          if (e.key == "Enter" || e.key == " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        tabIndex={0}
        onClick={() => {
          setOpen(!open);
        }}
        aria-expanded={open || isPrintMode}
        className={`${
          isPrintMode ? "border-gray-900" : "cursor-pointer"
        } ml-[-0.33rem] flex max-w-fit flex-row items-center rounded`}
      >
        <span
          className={`${isPrintMode ? "" : "text-sciquelTeal"} ${
            open || isPrintMode ? "pr-[0.65rem]" : "pr-3"
          } relative -left-[0.1rem]`}
        >
          {open || isPrintMode ? "⮟" : "⮞"}
        </span>{" "}
        {childArray[0]}
      </div>

      <div
        className={`${
          open || isPrintMode ? "max-h border-s-4 p-2 pl-[1.1rem]" : "max-h-0"
        } ${
          isPrintMode ? "border-gray-900" : "border-sciquelTeal"
        } ml-[-0.1rem] mt-3 overflow-hidden`}
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
