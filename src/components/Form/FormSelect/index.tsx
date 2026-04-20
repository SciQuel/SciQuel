"use client";

import clsx from "clsx";
import { type ChangeEventHandler, type HTMLProps } from "react";

interface Props {
  title: string;
  required?: boolean;
  indicateRequired?: boolean;
  value?: HTMLProps<HTMLSelectElement>["value"];
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}

export default function FormSelect({
  title,
  required = false,
  indicateRequired = true,
  value,
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="relative mt-6 w-full">
      <select
        className={clsx(
          `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
            outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
            focus:ring-0`,
          "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
        )}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="" disabled>
          Select a type
        </option>
        <option value="AUTHOR">Author</option>
      </select>
      <label className="pointer-events-none absolute -top-5 left-0 w-full text-sm">
        {title}
        {required && indicateRequired ? " *" : null}
      </label>
    </div>
  );
}
