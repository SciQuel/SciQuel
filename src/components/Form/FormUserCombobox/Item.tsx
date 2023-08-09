import { useId } from "@floating-ui/react";
import clsx from "clsx";
import { forwardRef } from "react";

interface ItemProps {
  children: React.ReactNode;
  active: boolean;
}

const Item = forwardRef<
  HTMLDivElement,
  ItemProps & React.HTMLProps<HTMLDivElement>
>(({ children, active, ...rest }, ref) => {
  const id = useId();
  return (
    <div
      ref={ref}
      role="option"
      id={id}
      aria-selected={active}
      {...rest}
      className={clsx(
        "w-full cursor-pointer px-2 py-1 [&:not(:last-child)]:border-b",
        active && "bg-gray-50",
      )}
    >
      {children}
    </div>
  );
});

export default Item;
