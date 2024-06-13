import ContactLink from "@/components/EditorDashboard/contact-forms/ContactLink";
import DraftTable from "@/components/EditorDashboard/DraftTable";
import PublishedTable from "@/components/EditorDashboard/PublishedTable";

export default function EditorDashboardPage() {
  return (
    <div className="mx-32 mt-5 flex flex-col gap-5">
      <h3 className="flex items-center text-3xl font-semibold text-sciquelTeal">
        Editors&apos; Dashboard. <ContactLink />
      </h3>
      <DraftTable />
      <PublishedTable />
    </div>
  );
}
