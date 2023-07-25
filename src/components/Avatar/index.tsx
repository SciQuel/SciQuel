import clsx from "clsx";
import Image from "next/image";

interface Props {
  imageUrl?: string;
  label?: string;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl";
  className?: string;
  onClick?: () => void;
}

export default function Avatar({
  imageUrl,
  label,
  size = "md",
  className,
  onClick,
}: Props) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center overflow-clip rounded-full",
        typeof imageUrl !== "string" && "bg-amber-400",
        size === "xs" && "h-5 w-5 text-xs",
        size === "sm" && "h-9 w-9 text-lg",
        size === "md" && "h-12 w-12 text-xl",
        size === "lg" && "h-16 w-16 text-2xl",
        size === "xl" && "h-20 w-20 text-3xl",
        size === "2xl" && "h-24 w-24 text-4xl",
        size === "3xl" && "h-28 w-28 text-5xl",
        size === "4xl" && "h-36 w-36 text-5xl",
        size === "5xl" && "h-44 w-44 text-6xl",
        size === "6xl" && "h-52 w-52 text-7xl",
        size === "7xl" && "h-64 w-64 text-8xl",
        size === "8xl" && "h-72 w-72 text-9xl",
        className,
      )}
      onClick={onClick}
    >
      {typeof imageUrl === "string" ? (
        <Image src={imageUrl} width={288} height={288} alt="avatar" />
      ) : (
        <span className="select-none font-sans font-semibold">{label}</span>
      )}
    </div>
  );
}
