import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function TempProfileHeading() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <></>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email ?? "no-auth",
    },
    select: {
      roles: true,
    },
  });

  if (!user || !user.roles.includes("EDITOR")) {
    return <></>;
  }

  return (
    <Link
      href={"/editor/dashboard"}
      className="rounded-lg border-2 border-slate-100 px-3 py-2
      transition-colors hover:bg-slate-100 hover:text-sciquelTeal"
    >
      Editor Dashboard
    </Link>
  );
}
