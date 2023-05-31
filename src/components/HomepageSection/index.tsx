import { type PropsWithChildren } from "react";

interface Props {
  heading: string;
}

export default function HomepageSection({
  heading,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-[550] text-sciquelHeading">{heading}</h1>
      {children}
    </div>
  );
}
