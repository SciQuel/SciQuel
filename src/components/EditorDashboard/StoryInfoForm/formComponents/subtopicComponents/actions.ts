"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getSubtopics(numItems: number, queryRaw?: string) {
  try {
    const session = await getServerSession();

    if (!session?.user.email) {
      return {
        status: 401,
        error: "unauthorized",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return {
        status: 403,
        error: "forbidden",
      };
    }

    const query = queryRaw
      ? queryRaw.toUpperCase().replaceAll(" ", "_")
      : undefined;

    let getQ: Prisma.SubtopicFindManyArgs = {
      take: numItems,
    };

    if (query) {
      getQ = {
        where: {
          name: {
            contains: query,
          },
        },
        take: numItems,
      };
    }

    const getResult = await prisma.subtopic.findMany(getQ);

    console.log(query);
    console.log(getResult.length);

    return {
      status: 200,
      subtopics: getResult,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      error: "internal server error",
    };
  }
}

export async function createSubtopic(subtopicName: string) {
  try {
    const session = await getServerSession();

    if (!session?.user.email) {
      return {
        error: "unauthorized",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user || !user.roles.includes("EDITOR")) {
      return {
        error: "forbidden",
      };
    }

    const existingSubtopic = await prisma.subtopic.findFirst({
      where: {
        name: subtopicName.toUpperCase().replaceAll(" ", "_"),
      },
    });

    if (existingSubtopic) {
      return {
        error: "subtopic already exists",
      };
    }

    await prisma.subtopic.create({
      data: {
        name: subtopicName.toUpperCase().replaceAll(" ", "_"),
        numStories: 0,
      },
    });

    return {
      error: undefined,
    };
  } catch (err) {
    return {
      error: "internal server error",
    };
  }
}
