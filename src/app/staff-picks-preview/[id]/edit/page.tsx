// This is a placeholder page for the staff pick edit flow. It uses the same component as the create flow, but with pre-filled data.
// The data is currently hardcoded, but will eventually be fetched from the backend.
import { notFound } from "next/navigation";
import HomepageSection from "@/components/HomepageSection";
import StaffPickCreateFlow from "@/components/StaffPicksSection/StaffPickCreateFlow";
import { placeholderStaffPicks } from "@/components/StaffPicksSection/placeholderData";

interface PageProps {
  params: {
    id: string;
  };
}

export default function StaffPickEditPreviewPage({ params }: PageProps) {
  const staffPick = placeholderStaffPicks.find((item) => item.id === params.id);

  if (!staffPick) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-6 py-12">
      <HomepageSection heading="Edit your Staff Pick">
        <div className="border-t border-sciquelCardBorder">
          <StaffPickCreateFlow mode="edit" initialStaffPick={staffPick} />
        </div>
      </HomepageSection>
    </div>
  );
}