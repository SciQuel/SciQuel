import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
import StoryPreview from "@/components/EditorDashboard/StoryPreview";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface SearchParams {
  id?: string;
}

export default async function StoryInfoEditorPage({
  searchParams: { id },
}: {
  searchParams: SearchParams;
}) {
  const story = id ? await prisma.story.findUnique({ where: { id } }) : null;
  if (id && !story) {
    return redirect("/editor/dashboard");
  }
  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <div className="flex gap-5">
        <div className="w-1/2">
          <h3 className="text-3xl font-semibold text-sciquelTeal">Story Info</h3>
          <StoryInfoForm
            title={story?.title}
            summary={story?.summary}
            image={story?.thumbnailUrl}
            id={story?.id}
            caption={story?.coverCaption}
            date={story?.publishedAt}
          />
        </div>
      
      
        <div className="w-1/2 bg-gray-100">
        <h3 className="text-3xl font-semibold text-sciquelTeal">Story Preview</h3>
          <StoryPreview
            title={story?.title}
            summary={story?.summary}
            image={story?.thumbnailUrl}
            id={story?.id}
            caption={story?.coverCaption}
            date={story?.publishedAt}
          />
        </div>
      </div>
    </div>
  );
}
