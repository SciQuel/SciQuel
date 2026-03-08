import HomepageSection from "@/components/HomepageSection";
import StaffPickCreateFlow from "@/components/StaffPicksSection/StaffPickCreateFlow";

export default function StaffPickCreatePreviewPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-6 py-12">
      <HomepageSection heading="Create your Staff Pick">
        <div className="border-t border-sciquelCardBorder">
          <StaffPickCreateFlow />
        </div>
      </HomepageSection>
    </div>
  );
}