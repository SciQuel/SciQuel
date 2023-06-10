import Sidebar from "@/components/UserSettings/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F8F8FF] px-8">
      <Sidebar />
      {children}
    </div>
  );
}
