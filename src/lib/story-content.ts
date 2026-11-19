import prisma from "@/lib/prisma";
import {
  StoryContentStatus,
  type Prisma,
  type StoryContent,
} from "@prisma/client";

export const publishedStoryContentQuery = {
  where: { status: StoryContentStatus.PUBLISHED },
  take: 1,
  orderBy: { createdAt: "desc" as const },
} satisfies Prisma.Story$storyContentArgs;

export function pickEditorStoryContent(
  rows: StoryContent[],
): StoryContent | null {
  const working = rows
    .filter((row) => row.status === StoryContentStatus.WORKING)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  if (working) {
    return working;
  }

  const published = rows
    .filter((row) => row.status === StoryContentStatus.PUBLISHED)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  return published ?? null;
}

export async function findEditorStoryContent(storyId: string) {
  const working = await prisma.storyContent.findFirst({
    where: { storyId, status: StoryContentStatus.WORKING },
    orderBy: { createdAt: "desc" },
  });
  if (working) {
    return working;
  }

  return prisma.storyContent.findFirst({
    where: { storyId, status: StoryContentStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
  });
}

export async function upsertWorkingStoryContent(
  storyId: string,
  data: { content?: string; footer?: string | null },
) {
  const working = await prisma.storyContent.findFirst({
    where: { storyId, status: StoryContentStatus.WORKING },
    orderBy: { createdAt: "desc" },
  });

  if (working) {
    return prisma.storyContent.update({
      where: { id: working.id },
      data: {
        content: data.content,
        footer: data.footer,
      },
    });
  }

  return prisma.storyContent.create({
    data: {
      storyId,
      content: data.content ?? "",
      footer: data.footer,
      status: StoryContentStatus.WORKING,
      createdAt: new Date(),
    },
  });
}
