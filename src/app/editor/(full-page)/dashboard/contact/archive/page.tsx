import ContactArchiveDashboard from "@/components/EditorDashboard/contact-forms/ArchiveDashboard";
import Link from "next/link";

export default function ContactArchivePage() {
  return (
    <div className="p-3">
      <nav className="flex flex-row">
        <Link href="/editor/dashboard">Editor Dashboard</Link> >{" "}
        <Link href="/editor/dashboard/contact">Contact Messages</Link> >{" "}
        <p>Archive</p>
      </nav>
      <h1 className="text-3xl font-semibold text-sciquelTeal">
        Archived Contact Messages
      </h1>
      <ContactArchiveDashboard />
    </div>
  );
}
