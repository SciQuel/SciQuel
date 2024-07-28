import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import StoryInfoEditorClient from "./StoryInfoEditorPageClient";

interface SearchParams {
  id?: string;
}
const prisma = new PrismaClient();

export default async function StoryInfoEditorPage({
  searchParams: { id },
}: {
  searchParams: SearchParams;
}) {
  const story = id
    ? await prisma.story.findUnique({
        where: { id },
        include: {
          storyContributions: {
            include: {
              contributor: true,
            },
          },
        },
      })
    : null;

  if (id && !story) {
    // if story is not found redirect user back
    return redirect("/editor/dashboard");
  }

  return <StoryInfoEditorClient story={story || {}} />;
}
