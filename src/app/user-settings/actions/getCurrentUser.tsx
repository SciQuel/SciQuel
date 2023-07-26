import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getSession() {
  return await getServerSession();
}

export default async function getUserData() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currUser) {
      return null;
    }

    return {
      ...currUser,
    };
  } catch (err: any) {
    return null;
  }
}
