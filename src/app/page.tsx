import TrendingSection from "@/components/TrendingSection";
import WhatsNewSection from "@/components/WhatsNewSection";

export default function Home() {
  return (
    <>
      {/* Article cards */}
      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <WhatsNewSection />
        <TrendingSection />
      </div>
    </>
  );
}
