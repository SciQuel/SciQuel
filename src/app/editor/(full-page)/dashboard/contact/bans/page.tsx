import BannedUserDashboard from "@/components/EditorDashboard/contact-forms/BanDashboard";

export default function ContactBanPage() {
  return (
    <div className="p-3">
      <h1 className="text-3xl font-semibold text-sciquelTeal">
        Manage Banned Accounts
      </h1>
      <BannedUserDashboard />
    </div>
  );
}
