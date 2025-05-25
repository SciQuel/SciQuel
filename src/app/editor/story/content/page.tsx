import MarkdownEditor from "@/components/MarkdownEditor";
import prisma from "@/lib/prisma";
import { type StoryContent } from "@prisma/client";
import { redirect } from "next/navigation";

interface SearchParams {
  id?: string;
}

export default async function StoryContentEditorPage({
  searchParams: { id },
}: {
  searchParams: SearchParams;
}) {
  const story = id
    ? await prisma.story.findUnique({
        where: { id },
        include: { storyContent: true, definitions: true },
      })
    : null;
  if (!story) {
    return redirect("/editor/dashboard");
  }

  const dictWords = story.definitions.reduce((accumulator, current) => {
    if (current.word) {
      accumulator.push(current.word);
    }

    return accumulator;
  }, [] as string[]);

  const latestRevision = story.storyContent.reduce<StoryContent | null>(
    (acc, current) => {
      if (acc === null) {
        return current;
      }
      if (current.createdAt > acc.createdAt) {
        return current;
      }
      return acc;
    },
    null,
  );
  return (
    <MarkdownEditor
      dictionaryWords={dictWords}
      initialValue={latestRevision?.content}
      id={story.id}
    />
  );
}
