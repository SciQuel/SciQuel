"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type ContributorResult } from "../ContributorSearch/actions";

export async function createContributor(
  first: string,
  last: string,
  email: string,
  bio: string,
  slug: string,
) {
  try {
    const session = await getServerSession();

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email ?? "noemail" },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return { error: "unauthorized" };
    }

    const conflictingContributors = await prisma.contributor.findMany({
      where: {
        OR: [
          {
            email: email,
          },
          {
            contributorSlug: slug,
          },
        ],
      },
    });

    if (conflictingContributors && conflictingContributors.length > 0) {
      return {
        error: "contributors already exist",
        contributors: conflictingContributors,
      };
    }

    const newContributor = await prisma.contributor.create({
      data: {
        firstName: first,
        lastName: last,
        email: email,
        contributorSlug: slug,
        bio: bio,
      },
    });

    return {
      status: "success",
      newContributor: newContributor as ContributorResult,
    };
  } catch (err) {
    return { error: "unknown server error" };
  }
}
