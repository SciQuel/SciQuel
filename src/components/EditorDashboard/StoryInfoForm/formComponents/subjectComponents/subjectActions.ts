"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

interface GetSuccessRes {
  status: 200;
  subjects: Prisma.GeneralSubjectGetPayload<{}>[];
}

interface GetErrorRes {
  status: 401 | 403 | 500;
  error: string;
}

type Response = GetSuccessRes | GetErrorRes;

export async function getSubjects(
  numItems: number,
  queryRaw?: string,
): Promise<Response> {
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

    let getQ: Prisma.GeneralSubjectFindManyArgs = {
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

    const getResult = await prisma.generalSubject.findMany(getQ);

    return {
      status: 200,
      subjects: getResult,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      error: "internal server error",
    };
  }
}

type SubjectExistsRes =
  | {
      status: 200;
      itemExists: true;
      itemType: "SUBJECT" | "SUBTOPIC";
    }
  | {
      status: 200;
      itemExists: false;
    }
  | {
      status: 401 | 403 | 500;
      error: string;
    };

export async function subjectExists(
  subjectName: string,
): Promise<SubjectExistsRes> {
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

    const query: Prisma.GeneralSubjectFindFirstArgs = {
      where: {
        name: {
          equals: subjectName,
        },
      },
    };

    const result = await prisma.generalSubject.findFirst(query);

    if (result) {
      return {
        status: 200,
        itemExists: true,
        itemType: "SUBJECT",
      };
    }

    const subtopicRes = await prisma.subtopic.findFirst({
      where: {
        name: {
          equals: subjectName,
        },
      },
    });

    if (subtopicRes) {
      return {
        status: 200,
        itemExists: true,
        itemType: "SUBTOPIC",
      };
    }

    return {
      status: 200,
      itemExists: false,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      error: "internal server error",
    };
  }
}

export async function createSubject(subjectName: string) {
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

    const existingSubject = await prisma.generalSubject.findFirst({
      where: {
        name: subjectName.toUpperCase().replaceAll(" ", "_"),
      },
    });

    if (existingSubject) {
      return {
        error: "subject already exists",
      };
    }

    await prisma.generalSubject.create({
      data: {
        name: subjectName.toUpperCase().replaceAll(" ", "_"),
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
