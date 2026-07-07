import ContactLink from "@/components/EditorDashboard/contact-forms/ContactLink";
import DraftTable from "@/components/EditorDashboard/DraftTable";
import PublishedTable from "@/components/EditorDashboard/PublishedTable";
import Link from "next/link";
import { publishStory, storyFetcher } from "./action";

export default async function EditorDashboardPage() {
  const draftStoriesData = await storyFetcher("false");
  const publishedStoriesData = await storyFetcher("true");
  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <h3 className="flex items-center text-3xl font-semibold text-sciquelTeal">
        Editors&apos; Dashboard. <ContactLink />
      </h3>
      <div>
        <Link href="/editor/contributors">Edit / Add Contributors</Link>
      </div>
      <DraftTable data={draftStoriesData} publishHandle={publishStory} />
      <PublishedTable
        data={publishedStoriesData}
        publishHandle={publishStory}
      />
    </div>
  );
}
