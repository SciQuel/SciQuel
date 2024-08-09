import ContributorCreate from "@/components/EditorDashboard/contributors/ContributorCreate/ContributorCreate";
import ContributorSearch from "@/components/EditorDashboard/contributors/ContributorSearch/ContributorSearch";

export default function ContributorEditPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-semibold">Temp Contributor Editor Page</h1>
      <div className="grid grid-cols-2">
        <ContributorSearch />
        <ContributorCreate />
      </div>
    </div>
  );
}
