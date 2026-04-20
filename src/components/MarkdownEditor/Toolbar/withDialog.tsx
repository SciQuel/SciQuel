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
import {
  useState,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from "react";
import ToolbarButton, { type Props } from "./ToolbarButton";

interface DialogProps extends Props {
  modalBody: (
    labelId: string,
    descriptionId: string,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
  ) => ReactNode;
}

export default function withDialog(props: PropsWithChildren<DialogProps>) {
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
            className="z-50 flex items-center justify-center"
            style={{ background: "rgba(0, 0, 0, 0.8)" }}
          >
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
                className="rounded-lg bg-white md:w-[35rem]"
              >
                {props.modalBody(labelId, descriptionId, setIsOpen)}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </>
    );
  }

  return DialogWrapper;
}
