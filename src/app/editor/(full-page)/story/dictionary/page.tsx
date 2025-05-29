import DefinitionsDisplay from "@/components/EditorDashboard/DefinitionsDisplay/DefinitionsDisplay";
import DictionaryDefinitionForm from "@/components/EditorDashboard/DictionaryForm/DictionaryForm";
import DictionaryList from "@/components/EditorDashboard/DictionaryForm/DictionaryList/DictionaryList";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getStory(id: string) {
  try {
    const story = await prisma.story.findUnique({
      where: {
        id: id,
      },
      include: {
        definitions: true,
      },
    });
    return story;
  } catch (err) {
    console.error(err);
    return null;
  }
}

interface SearchParams {
  id?: string;
}

export default async function StoryInfoEditorPage({
  searchParams: { id },
}: {
  searchParams: SearchParams;
}) {
  if (!id) {
    return redirect("/editor/dashboard");
  }

  const storyInfo = await getStory(id);

  if (!storyInfo) {
    return redirect("/editor/dashboard");
  }

  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <h2 className="text-3xl font-semibold text-sciquelTeal">
        Story Dictionary - {storyInfo.title}
      </h2>
      <div>
        <DictionaryDefinitionForm id={id} />
      </div>

      <div>
        <DictionaryList definitions={storyInfo.definitions} />
      </div>
    </div>
  );
}
