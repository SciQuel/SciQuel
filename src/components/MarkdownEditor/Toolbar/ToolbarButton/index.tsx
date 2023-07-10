import { type PropsWithChildren } from "react";

interface Props {
  type?: "button" | "dropdown";
}

export default function ToolbarButton({
  type = "button",
  children,
}: PropsWithChildren<Props>) {
  return (
    <>
      <div className="peer cursor-pointer rounded-md p-1 font-light leading-none hover:bg-slate-300">
        {children}
      </div>
    </>
  );
}
