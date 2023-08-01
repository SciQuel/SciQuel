import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.roles.includes("EDITOR")) {
    return redirect("/");
  }

  return <div className="min-h-screen bg-[#F8F8FF]">{children}</div>;
}
