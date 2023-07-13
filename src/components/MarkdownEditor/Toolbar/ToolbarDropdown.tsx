"use client";

import {
  autoUpdate,
  FloatingFocusManager,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import clsx from "clsx";
import { useState, type PropsWithChildren } from "react";

export interface DropdownItem {
  label: string;
  onClick(): void;
}

interface Props {
  disabled?: boolean;
  dropdownItems: DropdownItem[];
}

export default function ToolbarDropdown({
  disabled,
  dropdownItems,
  children,
}: PropsWithChildren<Props>) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    middleware: [offset({ mainAxis: 5, crossAxis: 7 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <button
        className={clsx(
          "peer cursor-pointer rounded-md p-1 font-light leading-none ring-blue-500 hover:bg-slate-300",
          disabled && "pointer-events-none fill-gray-300 text-gray-300",
        )}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {children}
      </button>
      {dropdownItems && tooltipOpen && (
        <FloatingFocusManager context={context} modal={true}>
          <div
            className="z-10 flex flex-col overflow-hidden rounded-md border bg-white leading-none shadow-md"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {dropdownItems.map((item, index) => {
              return (
                <div
                  key={`dropdown-heading-${index + 1}`}
                  onClick={() => {
                    setTooltipOpen(false);
                    setTimeout(() => {
                      item.onClick();
                    }, 0);
                  }}
                  className={clsx(
                    "cursor-pointer p-2 hover:bg-slate-100",
                    index !== dropdownItems.length - 1 ? "border-b" : undefined,
                  )}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
