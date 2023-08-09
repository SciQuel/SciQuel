import StoryInfoForm from "@/components/EditorDashboard/StoryInfoForm";
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
      <h3 className="text-3xl font-semibold text-sciquelTeal">Story Info</h3>
      <StoryInfoForm
        title={story?.title}
        summary={story?.summary}
        image={story?.thumbnailUrl}
        id={story?.id}
      />
    </div>
  );
}
