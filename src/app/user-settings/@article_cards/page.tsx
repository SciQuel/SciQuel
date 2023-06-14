import DashboardCard from "@/components/UserSettings/DashboardCard";

export default function ArticleCards() {
  return (
    <div className="mt-12 grid grow grid-cols-1 gap-8 lg:grid-cols-2">
      <DashboardCard title="Brained Articles" />
      <DashboardCard title="Saved Definitions" />
      <DashboardCard title="Annotations" />
      <DashboardCard title="Comments" />
      <DashboardCard title="Bookmarks" />
    </div>
  );
}
