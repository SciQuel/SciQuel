"use client";

import {
  FloatingFocusManager,
  FloatingOverlay,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import clsx from "clsx";
import { useState } from "react";
import AvatarEditorModal from "./AvatarEditorModal";

export default function AvatarEditorButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
    enabled: !loading,
  });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const labelId = useId();
  const descriptionId = useId();

  return (
    <>
      <button
        className={clsx(
          `pb-auto group absolute pt-0 text-center`,
          `hover-hover:left-[0.375rem] hover-hover:top-[0.375rem] hover-hover:block hover-hover:h-24
            hover-hover:w-24 hover-hover:cursor-pointer hover-hover:overflow-clip hover-hover:rounded-full
          hover-hover:bg-gray-600 hover-hover:bg-opacity-0 hover-hover:hover:bg-opacity-30`,
          `hover-none:-bottom-10 hover-none:rounded-md hover-none:bg-cyan-600 hover-none:px-2
            hover-none:py-1 hover-none:hover:bg-cyan-700`,
        )}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div className="hidden w-full font-semibold text-white hover-none:block">
          Edit Picture
        </div>
        <div className="hidden h-full hover-hover:block">
          <div
            className={clsx(
              "w-full font-semibold text-white",
              `hover-hover:hidden hover-hover:bg-gray-600
              hover-hover:bg-opacity-30 hover-hover:group-hover:block`,
            )}
          >
            Edit
          </div>
        </div>
      </button>
      {isOpen && (
        <FloatingOverlay
          className="z-10 flex items-center justify-center"
          lockScroll
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
        >
          <FloatingFocusManager context={context}>
            <div
              className="rounded-lg bg-white md:w-[35rem]"
              ref={refs.setFloating}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
            >
              <AvatarEditorModal
                labelId={labelId}
                descriptionId={descriptionId}
                setIsOpen={setIsOpen}
                setLoading={setLoading}
              />
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
}
