import Link from "next/link";
import HomepageSection from "@/components/HomepageSection";
import StaffPickCard from "@/components/StaffPicksSection/StaffPickCard";
import { type StoryTopic } from "@prisma/client";

interface PlaceholderStaffPick {
  id: string;
  href: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  topic: StoryTopic;
  authorName: string;
  condensedDate: string;
  quote: string;
  quoteAuthor: string;
  quoteHandle: string;
  quoteDate: string;
  avatarUrl: string;
}

const placeholderStaffPicks: PlaceholderStaffPick[] = [
  {
    id: "1",
    href: "/stories/read",
    title: "Lights. Camera. Action!",
    summary:
      "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens.",
    thumbnailUrl: "/assets/images/bobtail.png",
    topic: "BIOLOGY",
    authorName: "Edward Chen",
    condensedDate: "05/27/21",
    quote:
      "A compelling story that highlights the Hawaiian bobtail squid's remarkable ability to recruit and host a single bacterial partner, Vibrio fischeri, through highly selective biological mechanisms.",
    quoteAuthor: "Edward Chen",
    quoteHandle: "SciQuel",
    quoteDate: "12/5/25",
    avatarUrl: "/user-settings/ProfilePicture.png",
  },
  {
    id: "2",
    href: "/stories/read",
    title: "Lights. Camera. Action!",
    summary:
      "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens.",
    thumbnailUrl: "/assets/images/bobtail.png",
    topic: "BIOLOGY",
    authorName: "Edward Chen",
    condensedDate: "05/27/21",
    quote:
      "A compelling story that highlights the Hawaiian bobtail squid's remarkable ability to recruit and host a single bacterial partner, Vibrio fischeri, through highly selective biological mechanisms.",
    quoteAuthor: "Edward Chen",
    quoteHandle: "SciQuel",
    quoteDate: "12/5/25",
    avatarUrl: "/user-settings/ProfilePicture.png",
  },
];

export default function StaffPicksPreviewPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-6 py-12">
      <HomepageSection heading="Your Staff Picks">
        <div className="flex flex-col gap-8 border-t border-sciquelCardBorder pt-8">
          {placeholderStaffPicks.map((staffPick) => {
            return (
              <div
                key={staffPick.id}
                className="flex flex-col gap-6 border-b border-sciquelCardBorder pb-8 last:border-b-0"
              >
                <StaffPickCard
                  href={staffPick.href}
                  title={staffPick.title}
                  summary={staffPick.summary}
                  thumbnailUrl={staffPick.thumbnailUrl}
                  topic={staffPick.topic}
                  authorName={staffPick.authorName}
                  condensedDate={staffPick.condensedDate}
                  quote={staffPick.quote}
                  quoteAuthor={staffPick.quoteAuthor}
                  quoteHandle={staffPick.quoteHandle}
                  quoteDate={staffPick.quoteDate}
                  avatarUrl={staffPick.avatarUrl}
                  showDivider={false}
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-md bg-[#039a36] px-7 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-85"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-[#db3631] px-7 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-85"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-6">
          <Link
            href="/staff-picks-preview/create"
            className="rounded-md bg-sciquelTeal px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(25,75,82,0.18)] transition hover:opacity-85"
          >
            Create New Staff Pick
          </Link>
        </div>
      </HomepageSection>
    </div>
  );
}