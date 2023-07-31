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
import { useState, type PropsWithChildren } from "react";
import ToolbarButton, { type Props } from "./ToolbarButton";

export default function withDialog(props: PropsWithChildren<Props>) {
  function DialogWrapper() {
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
        <div ref={refs.setReference} {...getReferenceProps()}>
          <ToolbarButton {...props} />
        </div>
        {isOpen && (
          <FloatingOverlay
            lockScroll
            className="z-50"
            style={{ background: "rgba(0, 0, 0, 0.8)" }}
          >
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                <h2 id={labelId}>Heading element</h2>
                <p id={descriptionId}>Description element</p>
                <button onClick={() => setIsOpen(false)}>Close</button>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </>
    );
  }

  return DialogWrapper;
}
