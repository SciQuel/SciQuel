// Server-side layout that restricts all staff-picks-preview pages to authenticated editors
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function StaffPicksPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { roles: true },
  });

  // Only users with the EDITOR role can access the staff picks dashboard
  if (!user?.roles.includes("EDITOR")) {
    redirect("/");
  }

  return <>{children}</>;
}
