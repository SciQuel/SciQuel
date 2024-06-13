"use client";

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { type Contributor } from "@prisma/client";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import Item from "./Item";

interface Props {
  title: string;
  required?: boolean;
  indicateRequired?: boolean;
  value?: ComboboxValue;
  onChange?: (data: ComboboxValue) => void;
  invalid?: boolean;
  disabled?: boolean;
  directory?: {
    firstName: Contributor["firstName"];
    lastName: Contributor["lastName"];
    email: Contributor["email"];
  }[];
}

export interface ComboboxValue {
  text: string;
  name?: string;
  email?: string;
}

export default function FormUserCombobox({
  title,
  required = false,
  indicateRequired = true,
  value,
  onChange,
  invalid,
  disabled = false,
  directory = [],
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<ComboboxValue>({ text: "" });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNav, dismiss, role],
  );

  const items = directory.reduce<
    {
      firstName: Contributor["firstName"];
      lastName: Contributor["lastName"];
      email: Contributor["email"];
    }[]
  >((accumulator, curr) => {
    if (
      curr.firstName.toLowerCase().startsWith(inputValue.text.toLowerCase()) ||
      curr.lastName.toLowerCase().startsWith(inputValue.text.toLowerCase()) ||
      curr.email?.toLowerCase().startsWith(inputValue.text.toLowerCase())
    ) {
      return [...accumulator, curr];
    }
    return accumulator;
  }, []);

  const combinedSetValue = useCallback(
    (value: ComboboxValue) => {
      onChange !== undefined && onChange(value);
      setInputValue(value);
    },
    [onChange],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const newComboboxValue = { text: value };
      combinedSetValue(newComboboxValue);

      if (value) {
        setIsOpen(true);
        setActiveIndex(0);
      } else {
        setIsOpen(false);
      }
    },
    [combinedSetValue],
  );

  return (
    <>
      <div className="relative mt-6 w-full">
        <input
          className={clsx(
            `peer w-full rounded-md px-2 py-1 leading-snug placeholder-transparent outline
              invalid:outline-dashed invalid:outline-2 invalid:outline-red-400
            hover:outline-sciquelTeal invalid:hover:outline-red-400 focus:outline-2 focus:ring-0`,
            invalid
              ? "outline-dashed outline-2 outline-red-400 hover:outline-red-400 focus:outline-red-400"
              : "outline-1 outline-gray-200 focus:outline-sciquelTeal",
            "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
          )}
          placeholder={title}
          type="text"
          disabled={disabled}
          {...getReferenceProps({
            ref: refs.setReference,
            onChange: onInputChange,
            value: value?.text ?? inputValue.text,
            "aria-autocomplete": "list",
            onKeyDown(event) {
              if (
                event.key === "Enter" &&
                activeIndex != null &&
                items[activeIndex]
              ) {
                const newValue = `${items[activeIndex].firstName} ${items[activeIndex].lastName} <${items[activeIndex].email}>`;
                combinedSetValue({
                  text: newValue,
                  name: newValue,
                  email: items[activeIndex].email ?? "",
                });
                setActiveIndex(null);
                setIsOpen(false);
              }
            },
          })}
        />
        <label
          className={`duration-400 pointer-events-none absolute -top-5 left-0 w-full
        text-sm transition-position peer-placeholder-shown:left-2
        peer-placeholder-shown:top-1 peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400 peer-focus:text-black`}
        >
          {title}
          {required && indicateRequired ? " *" : null}
        </label>
        {isOpen && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            visuallyHiddenDismiss
          >
            <div
              {...getFloatingProps({
                ref: refs.setFloating,
                style: {
                  ...floatingStyles,
                },
              })}
              className={clsx(
                items.length > 0 &&
                  "w-full overflow-clip rounded-md border bg-white drop-shadow",
                "z-10",
              )}
            >
              {items.map((item, index) => (
                <Item
                  {...getItemProps({
                    key: `${item.firstName} ${item.lastName}`,
                    ref(node) {
                      listRef.current[index] = node;
                    },
                    onClick() {
                      const newValue = `${item.firstName} ${item.lastName} <${item.email}>`;
                      combinedSetValue({
                        text: newValue,
                        name: newValue,
                        email: item.email ?? "",
                      });
                      setIsOpen(false);
                      (
                        refs.domReference.current as HTMLElement | null
                      )?.focus();
                    },
                  })}
                  active={activeIndex === index}
                >
                  {item.firstName} {item.lastName} &lt;{item.email}&gt;
                </Item>
              ))}
            </div>
          </FloatingFocusManager>
        )}
      </div>
    </>
  );
}
