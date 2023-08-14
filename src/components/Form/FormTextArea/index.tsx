"use client";

import clsx from "clsx";
import { type ChangeEventHandler, type HTMLProps } from "react";

interface Props {
  title: string;
  required?: boolean;
  indicateRequired?: boolean;
  value?: HTMLProps<HTMLTextAreaElement>["value"];
  minLength?: number;
  maxLength?: number;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function FormTextArea({
  title,
  minLength,
  maxLength,
  required = false,
  indicateRequired = true,
  value,
  invalid,
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="relative mt-6 w-full">
      <textarea
        className={clsx(
          `peer w-full rounded-md px-2 py-1 placeholder-transparent outline invalid:outline-dashed
          invalid:outline-2 invalid:outline-red-400 hover:outline-sciquelTeal
          invalid:hover:outline-red-400 focus:outline-2 focus:ring-0`,
          invalid
            ? "outline-dashed outline-2 outline-red-400 hover:outline-red-400 focus:outline-red-400"
            : "outline-1 outline-gray-200 focus:outline-sciquelTeal",
          "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
        )}
        placeholder={title}
        value={value}
        minLength={minLength}
        maxLength={maxLength}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        className={`duration-400 pointer-events-none absolute -top-5 left-0 w-full
        text-sm transition-position peer-placeholder-shown:left-2
        peer-placeholder-shown:top-1 peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400 peer-focus:text-black`}
      >
        {title}
        {required && indicateRequired ? " *" : null}
      </label>
    </div>
  );
}
