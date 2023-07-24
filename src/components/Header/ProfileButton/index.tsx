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
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import DropdownItem from "./DropdownItem";
import ExpandIcon from "./expand.svg";

export default function ProfileButton() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  if (session.status === "unauthenticated") {
    return (
      <a
        href="#"
        onClick={() => void signIn()}
        className="font-bold leading-[2rem]"
      >
        LOGIN
      </a>
    );
  }

  if (session.status === "loading") {
    return null;
  }

  const fullname = session.data?.user?.name?.split(", ").reverse().join(" ");

  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps()}
      className="flex cursor-pointer flex-row items-center gap-3"
    >
      <div className="h-9 w-9 rounded-full bg-slate-900"></div>
      <div className="flex flex-col gap-1">
        <div className="leading-none">{fullname}</div>
        <div className="text-xs leading-none">{session.data?.user?.email}</div>
      </div>
      <div className="-ml-2 h-6 w-6">
        <ExpandIcon className="h-full w-full fill-white" />
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-[20] flex w-48 flex-col rounded-md bg-white px-3 py-2 text-sciquelDarkText outline-none ring-0 drop-shadow-md"
            >
              <DropdownItem label="Profile" href="/user-settings/dashboard" />
              <DropdownItem label="Settings" href="/user-settings/settings" />
              <DropdownItem label="Sign out" onClick={() => void signOut()} />
            </div>
          </FloatingFocusManager>
        )}
      </div>
    </div>
  );
}
