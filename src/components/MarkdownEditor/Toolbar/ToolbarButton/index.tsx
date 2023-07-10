"use client";

import {
  autoUpdate,
  offset,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useState, type PropsWithChildren } from "react";

interface Props {
  type?: "button" | "dropdown";
  tooltip?: string;
}

export default function ToolbarButton({
  type = "button",
  tooltip,
  children,
}: PropsWithChildren<Props>) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    middleware: [offset(5)],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <button
        className="peer cursor-pointer rounded-md p-1 font-light leading-none ring-blue-500 hover:bg-slate-300"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {children}
      </button>
      {type === "button" && tooltip && tooltipOpen && (
        <div
          className="z-10 rounded-md bg-slate-700 p-[0.35rem] leading-none text-white"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {tooltip}
        </div>
      )}
    </>
  );
}
