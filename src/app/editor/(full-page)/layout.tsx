import { type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#F8F8FF]">{children}</div>;
}
