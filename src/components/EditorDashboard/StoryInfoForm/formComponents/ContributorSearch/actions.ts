"use server";

import { type Contribution } from "@/app/editor/(full-page)/story/info/StoryInfoEditorPageClient";
import prisma from "@/lib/prisma";
import {
  Prisma,
  type ContributionType,
  type StoryContribution,
} from "@prisma/client";
import { getServerSession } from "next-auth";

interface ContributorSearchInfo {
  firstName: string;
  lastName: string;
  email: string;
  bioText: string;
  slug: string;
}

async function checkEditorStatus() {
  const session = await getServerSession();

  if (session?.user.email) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (user && user.roles.includes("EDITOR")) {
        return true;
      }

      return false;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
}

export async function searchContributors(
  searchData: ContributorSearchInfo,
  page = 1,
) {
  try {
    const status = await checkEditorStatus();
    if (!status) {
      return undefined;
    }
    const documents = await prisma.contributor.findMany({
      where: {
        firstName: {
          contains: searchData.firstName,
          mode: "insensitive",
        },
        lastName: {
          contains: searchData.lastName,
          mode: "insensitive",
        },
        email: {
          contains: searchData.email,
          mode: "insensitive",
        },
        bio: {
          contains: searchData.bioText,
          mode: "insensitive",
        },
        contributorSlug: {
          contains: searchData.slug,
          mode: "insensitive",
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });

    return documents;
  } catch (err) {
    return undefined;
  }
}

export async function getCurrentContributions(storyId: string) {
  try {
    const status = await checkEditorStatus();
    if (!status) {
      return undefined;
    }
    const contributions = await prisma.storyContribution.findMany({
      where: {
        storyId,
      },
      include: {
        contributor: true,
      },
    });

    return contributions as Contribution[];
  } catch (err) {
    return undefined;
  }
}

export type AddContributionResult =
  | { newDoc: StoryContribution; status: "success" }
  | { status: "error"; error: string };

export async function addContribution(
  storyId: string,
  contributorId: string,
  contributionType: ContributionType,
  bio: string,
  otherContributorType?: string,
  otherContributorCredit?: string,
): Promise<AddContributionResult> {
  try {
    const editorStatus = await checkEditorStatus();
    if (!editorStatus) {
      return {
        status: "error",
        error: "could not verify user permissions.",
      };
    }
    const existingContribution = await prisma.storyContribution.findFirst({
      where: {
        storyId,
        contributorId,
      },
    });

    if (existingContribution) {
      return { status: "error", error: "Contribution already exists" };
    }

    const newContribution = await prisma.storyContribution.create({
      data: {
        storyId,
        contributorId,
        contributionType,
        bio,
        otherContributorCredit,
        otherContributorType,
      },
    });

    return {
      newDoc: newContribution,
      status: "success",
    };
  } catch (err) {
    return { status: "error", error: "unknown" };
  }
}

export async function editContribution(
  contributionId: string,
  bio?: string,
  contributionType?: ContributionType,
  otherContributorType?: string,
  otherContributorCredit?: string,
) {
  if (
    !bio &&
    !contributionType &&
    !otherContributorCredit &&
    !otherContributorType
  ) {
    return { status: "error", error: "Nothing to update." };
  }

  try {
    const status = await checkEditorStatus();
    if (!status) {
      return {
        status: "error",
        error: "Could not verify editor permissions",
      };
    }
    const prev = await prisma.storyContribution.findUnique({
      where: {
        id: contributionId,
      },
    });

    if (!prev) {
      return {
        status: "error",
        error: "Unknown contribution id",
      };
    }

    const newDoc = await prisma.storyContribution.update({
      where: {
        id: contributionId,
      },
      data: {
        ...(bio ? { bio: bio } : {}),
        ...(contributionType ? { contributionType } : {}),
        ...(otherContributorType ? { otherContributorType } : {}),
        ...(otherContributorCredit ? { otherContributorCredit } : {}),
      },
    });

    if (newDoc) {
      return { status: "success", data: newDoc };
    } else {
      return { status: "error", error: "Unknown" };
    }
  } catch (err) {
    return { status: "error", error: "Unknown" };
  }
}

export async function deleteContribution(contributionId: string) {
  try {
    const status = await checkEditorStatus();
    if (!status) {
      return {
        status: "error",
        error: "Could not verify editor permissions",
      };
    }

    const oldDoc = await prisma.storyContribution.findUnique({
      where: {
        id: contributionId,
      },
    });

    if (!oldDoc) {
      return {
        status: "error",
        error: "Could not locate contribution.",
      };
    }

    const newStatus = await prisma.storyContribution.delete({
      where: {
        id: contributionId,
      },
    });

    if (newStatus) {
      return {
        status: "success",
      };
    }

    return {
      status: "error",
      error: "Unknown",
    };
  } catch (err) {
    return {
      status: "error",
      error: "Unknown",
    };
  }
}
