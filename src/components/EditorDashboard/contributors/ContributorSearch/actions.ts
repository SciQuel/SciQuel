"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export interface ContributorResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  contributorSlug: string;
}

export type SearchResult = ContributorResult[] | undefined;

export async function search(
  firstName?: string,
  lastName?: string,
  email?: string,
) {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return undefined;
    }
    const contributors = await prisma.contributor.findMany({
      where: {
        firstName: {
          contains: firstName,
          mode: "insensitive",
        },
        lastName: {
          contains: lastName,
          mode: "insensitive",
        },
        email: {
          contains: email,
          mode: "insensitive",
        },
      },
      take: 8,
    });

    return contributors as ContributorResult[];
  } catch (err) {
    return undefined;
  }
}
