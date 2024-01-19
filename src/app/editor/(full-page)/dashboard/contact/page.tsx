import { type GetContactResult } from "@/app/api/contact/route";
import ContactDashboard from "@/components/EditorDashboard/contact-forms/ContactDashboard";
import env from "@/lib/env";

export default async function ContactDashboardPage() {
  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold text-sciquelTeal">
        Contact Dashboard{" "}
        <a
          href="/editor/dashboard/contact/bans"
          className="float-right text-xl"
        >
          Manage Banned Accounts
        </a>
      </h1>
      <ContactDashboard />
    </div>
  );
}
