import clsx from "clsx";
import { type PropsWithChildren } from "react";

interface Props {
  className?: string;
  type?: "danger" | "warn" | "info";
}

export default function Alert({
  children,
  className,
  type = "info",
}: PropsWithChildren<Props>) {
  return (
    <div
      className={clsx(
        "rounded-md p-2 text-sm font-semibold text-white",
        type === "info" ? "bg-sciquelTeal" : undefined,
        type === "warn" ? "bg-amber-500" : undefined,
        type === "danger" ? "bg-red-400" : undefined,
        className,
      )}
    >
      {children}
    </div>
  );
}
