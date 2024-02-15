import { type GetContactResult } from "@/app/api/contact/route";
import ContactDashboard from "@/components/EditorDashboard/contact-forms/ContactDashboard";
import env from "@/lib/env";
import Link from "next/link";

export default async function ContactDashboardPage() {
  return (
    <div className="p-3">
      <h1 className="my-2 flex h-fit justify-between text-3xl font-semibold text-sciquelTeal">
        Contact Dashboard{" "}
        <Link href="/editor/dashboard/contact/bans" className="text-xl">
          Manage Banned Accounts
        </Link>
      </h1>
      <Link
        className="m-4 block w-fit rounded-full border-4 border-sciquelTeal px-3 py-1 text-lg font-bold"
        href={"/editor/dashboard/contact/search"}
      >
        Go to search page
      </Link>
      <ContactDashboard />
    </div>
  );
}
