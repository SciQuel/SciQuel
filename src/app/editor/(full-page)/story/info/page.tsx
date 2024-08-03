import { getCurrentContributions } from "@/components/EditorDashboard/StoryInfoForm/formComponents/ContributorSearch/actions";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import StoryInfoEditorClient from "./StoryInfoEditorPageClient";

interface SearchParams {
  id?: string;
}

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

  if ((id && !story) || !id) {
    // if story is not found redirect user back
    return redirect("/editor/dashboard");
  }

  const contributions = await getCurrentContributions(id);

  return (
    <StoryInfoEditorClient
      contributions={contributions ?? []}
      story={story || {}}
    />
  );
}
