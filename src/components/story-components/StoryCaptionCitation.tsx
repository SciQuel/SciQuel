import clsx from "clsx";
import { type PropsWithChildren } from "react";

export default function StoryCaptionCitation({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <span
      className={clsx(
        "font-sourceSerif4 text-xs font-[370] leading-8 text-sciquelCitation",
      )}
    >
      {children}
    </span>
  );
}
