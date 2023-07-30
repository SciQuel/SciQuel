import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BrainIndex {
  cursor?: {
    firstBatch?: Array<{ key: { userId?: number; storyId?: number } }>;
  };
}

interface BookmarkIndex {
  cursor?: {
    firstBatch?: Array<{ key: { userId?: number; storyId?: number } }>;
  };
}

const userStoryIndex = {
  key: {
    userId: 1,
    storyId: 1,
  },
  name: "user_id_story_id",
  unique: true,
};

async function seed() {
  let indexExists;

  // Create brain index
  const brainIndex: BrainIndex = await prisma.$runCommandRaw({
    listIndexes: "Brain",
  });

  indexExists = brainIndex?.cursor?.firstBatch?.some(
    (index) =>
      index.key.userId === userStoryIndex.key.userId &&
      index.key.storyId === userStoryIndex.key.storyId,
  );

  if (indexExists) {
    console.log("Found compound index in collection Brain");
  } else {
    await prisma.$runCommandRaw({
      createIndexes: "Brain",
      indexes: [userStoryIndex],
    });
    console.log("Created compound index in collection Brain");
  }

  // Create bookmark index
  const bookmarkIndex: BookmarkIndex = await prisma.$runCommandRaw({
    listIndexes: "Bookmark",
  });

  indexExists = bookmarkIndex?.cursor?.firstBatch?.some(
    (index) =>
      index.key.userId === userStoryIndex.key.userId &&
      index.key.storyId === userStoryIndex.key.storyId,
  );

  if (indexExists) {
    console.log("Found compound index in collection Bookmark");
  } else {
    await prisma.$runCommandRaw({
      createIndexes: "Bookmark",
      indexes: [userStoryIndex],
    });
    console.log("Created compound index in collection Bookmark");
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
