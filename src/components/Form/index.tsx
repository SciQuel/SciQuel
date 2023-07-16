import clsx from "clsx";
import { type HTMLProps, type PropsWithChildren } from "react";

interface Props {
  onSubmit?: HTMLProps<HTMLFormElement>["onSubmit"];
  className?: string;
}

export default function Form({
  children,
  onSubmit,
  className,
}: PropsWithChildren<Props>) {
  return (
    <form className={clsx("w-full", className)} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
