import { type ChangeEventHandler, type HTMLProps } from "react";

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
  return (
    <div className="relative mt-6 w-full">
      <input
        className={`peer w-full rounded-md px-2 py-1 placeholder-transparent outline
        outline-1 outline-gray-200 hover:outline-sciquelTeal
        focus:outline-2 focus:outline-sciquelTeal focus:ring-0`}
        placeholder={title}
        type={type}
        value={value}
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
    </div>
  );
}
