import prisma from "@/lib/prisma";

export async function getMarkedStories(
  userId: string,
  storyIds: string[],
  type: "BOOK_MARK" | "BRAIN",
) {
  let result: { [key: string]: boolean } = {};
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

export async function isDifferentDateRead(storyId: string, userId: string) {
  return true;
}
