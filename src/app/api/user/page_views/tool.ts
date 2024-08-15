import prisma from "@/lib/prisma";

export async function getMarkedStories(
  userId: string,
  storyIds: string[],
  type: "BOOK_MARK" | "BRAIN",
) {
  const result: { [key: string]: boolean } = {};
  let storiesFound: { storyId: string }[] = [];
  if (type === "BOOK_MARK") {
    storiesFound = await prisma.bookmark.findMany({
      where: {
        userId: userId,
        storyId: {
          in: storyIds,
        },
      },
      select: {
        storyId: true,
      },
    });
  } else if (type === "BRAIN") {
    storiesFound = await prisma.brain.findMany({
      where: {
        userId: userId,
        storyId: {
          in: storyIds,
        },
      },
      select: {
        storyId: true,
      },
    });
  }
  storiesFound.forEach((story) => {
    result[story.storyId] = true;
  });
  return result;
}

export async function checkDifferentDateRead(
  storyId: string,
  userId: string,
  timeZone: number,
) {
  const UTCTime = new Date();
  let isNewDay = false;
  const lastPost = await prisma.pageView.findFirst({
    where: {
      userId,
      storyId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
      id: true,
    },
  });
  if (!lastPost) {
    throw new Error("lastPost not found in isDifferentDateRead function");
  }
  const lastUTCTime = lastPost.createdAt;
  const DAY_IN_MILISECOND = 86400000;

  if (UTCTime.getTime() - lastUTCTime.getTime() >= DAY_IN_MILISECOND) {
    isNewDay = true;
  } else {
    const UTChour = UTCTime.getUTCHours();
    const UTCLastHour = lastUTCTime.getUTCHours();
    const result = UTCLastHour - UTChour;
    let difference2Hour = 0;
    if (result >= 0) {
      difference2Hour = 24 - result;
    } else {
      difference2Hour = Math.abs(result);
    }
    //if last hours past 24, new day is in.
    isNewDay = UTCLastHour + timeZone + difference2Hour >= 24;
  }
  return { isNewDay, idLastPost: lastPost.id };
}
