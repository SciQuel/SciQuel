"use client";

import { useState, type ChangeEventHandler, type HTMLProps } from "react";

interface Props {
  title: string;
  required?: boolean;
  indicateRequired?: boolean;
  type?: "text" | "password" | "email";
  value?: HTMLProps<HTMLInputElement>["value"];
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function FormInput({
  title,
  required = false,
  indicateRequired = true,
  type = "text",
  value,
  onChange,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-6 w-full">
      <input
        className={`peer w-full rounded-md px-2 py-1 placeholder-transparent outline
        outline-1 outline-gray-200 invalid:outline-dashed
        invalid:outline-2 invalid:outline-red-400 hover:outline-sciquelTeal
        invalid:hover:outline-red-400 focus:outline-2 focus:outline-sciquelTeal focus:ring-0`}
        placeholder={title}
        type={type === "password" ? (show ? "text" : "password") : type}
        value={value}
        minLength={type === "password" ? 8 : undefined}
        maxLength={type === "password" ? 64 : undefined}
        onChange={onChange}
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