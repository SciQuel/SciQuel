import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BrainIndex {
  cursor?: {
    firstBatch?: Array<{ key: { userId?: number; storyId?: number } }>;
  };
}

async function seed() {
  // Create index
  const response: BrainIndex = await prisma.$runCommandRaw({
    listIndexes: "Brain",
  });

  const brainUserStoryIndex = {
    key: {
      userId: 1,
      storyId: 1,
    },
    name: "user_id_story_id",
    unique: true,
  };

  const indexExists = response?.cursor?.firstBatch?.some(
    (index) =>
      index.key.userId === brainUserStoryIndex.key.userId &&
      index.key.storyId === brainUserStoryIndex.key.storyId,
  );

  if (indexExists) {
    console.log("Found compound index in collection Brain");
  } else {
    await prisma.$runCommandRaw({
      createIndexes: "Brain",
      indexes: [brainUserStoryIndex],
    });
    console.log("Created compound index in collection Brain");
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
