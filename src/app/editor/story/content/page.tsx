import MarkdownEditor from "@/components/MarkdownEditor";
import prisma from "@/lib/prisma";
import { pickEditorStoryContent } from "@/lib/story-content";
import { redirect } from "next/navigation";

interface SearchParams {
  id?: string;
}

export default async function StoryContentEditorPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const { id } = searchParams;

  const story = id
    ? await prisma.story.findUnique({
        where: { id },
        include: { storyContent: true },
      })
    : null;
  if (!story) {
    return redirect("/editor/dashboard");
  }

  const latestRevision = pickEditorStoryContent(story.storyContent);
  return (
    <MarkdownEditor initialValue={latestRevision?.content} id={story.id} />
  );
}
