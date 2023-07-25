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
import { useState } from "react";
import AvatarEditorModal from "./AvatarEditorModal";

export default function AvatarEditorButton() {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: "mousedown",
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
      <div
        className={`group absolute left-[0.375rem] top-[0.375rem] h-24 w-24 cursor-pointer
        overflow-clip rounded-full bg-gray-600 bg-opacity-0 text-center hover:bg-opacity-30`}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <div className="hidden w-full bg-gray-600 bg-opacity-30 font-semibold text-white group-hover:block">
          Edit
        </div>
      </div>
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
              />
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  );
}
