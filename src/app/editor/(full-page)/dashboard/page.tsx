import DraftTable from "@/components/EditorDashboard/DraftTable";
import PublishedTable from "@/components/EditorDashboard/PublishedTable";

export default function EditorDashboardPage() {
  return (
    <div className="mx-32 flex flex-col gap-5 pt-16">
      <h3 className="text-3xl font-semibold text-sciquelTeal">
        Editors&apos; Dashboard
      </h3>
      <DraftTable />
      <PublishedTable />
    </div>
  );
}
