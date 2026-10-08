import { PrismaClient, StoryContentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function backfill() {
  const stories = await prisma.story.findMany({
    include: {
      storyContent: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  let updated = 0;

  for (const story of stories) {
    const [latest, ...older] = story.storyContent;
    if (!latest) {
      continue;
    }

    const latestStatus = story.published
      ? StoryContentStatus.PUBLISHED
      : StoryContentStatus.WORKING;
    const leftoverStatus = story.published
      ? StoryContentStatus.PUBLISHED
      : StoryContentStatus.DRAFT;

    await prisma.storyContent.update({
      where: { id: latest.id },
      data: { status: latestStatus },
    });
    updated += 1;

    for (const row of older) {
      await prisma.storyContent.update({
        where: { id: row.id },
        data: { status: leftoverStatus },
      });
      updated += 1;
    }
  }

  console.log(`Backfilled status on ${updated} StoryContent row(s).`);
}

backfill()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
