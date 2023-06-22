import Sidebar from "@/components/UserSettings/Sidebar";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F8FF] px-8">
      <Sidebar />
      {props.children}
    </div>
  );
}
