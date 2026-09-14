"use client";

import clsx from "clsx";
import { useState, type ChangeEventHandler, type HTMLProps } from "react";

interface Props {
  title: string;
  required?: boolean;
  indicateRequired?: boolean;
  type?: "text" | "password" | "email";
  value?: HTMLProps<HTMLInputElement>["value"];
  minLength?: number;
  maxLength?: number;
  invalid?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function FormInput({
  title,
  minLength,
  maxLength,
  required = false,
  indicateRequired = true,
  type = "text",
  value,
  invalid,
  disabled = false,
  onChange,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-6 w-full">
      <input
        className={clsx(
          `peer w-full border-0 border-b px-2 py-1 text-sciquelTeal placeholder-transparent
          hover:border-sciquelTeal focus:border-sciquelTeal focus:outline-none focus:ring-0`,
          invalid
            ? "border-b-red-400 hover:border-b-red-400 focus:border-b-red-400"
            : "border-b-gray-200",
          "disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-300",
        )}
        placeholder={title}
        type={type === "password" ? (show ? "text" : "password") : type}
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
      {type === "password" && (
        <label
          className={`absolute -top-5 right-0 cursor-pointer text-sm text-sciquelTeal
          hover:brightness-75`}
          onClick={() => setShow(!show)}
        >
          {show ? "Hide password" : "Show password"}
        </label>
      )}
    </div>
  );
}
