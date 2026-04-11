// Edit page for an existing staff pick
// Fetches the real story + staff pick data from the API using the staff pick ID in the URL
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { type GetStoriesResult } from "@/app/api/stories/route";
import HomepageSection from "@/components/HomepageSection";
import StaffPickCreateFlow, {
  type InitialStaffPick,
} from "@/components/StaffPicksSection/StaffPickCreateFlow";

interface PageProps {
  params: {
    id: string;
  };
}

// Build a story URL from its publish date and slug
function buildStoryHref(date: Date, slug: string) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `/stories/${year}/${month}/${day}/${slug}`;
}

function formatCondensedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).format(date);
}

export default function StaffPickEditPreviewPage({ params }: PageProps) {
  const [staffPick, setStaffPick] = useState<InitialStaffPick | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  // Look up the story whose staffPick.id matches the URL param
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/stories?published=true&staff_pick=true&page_size=50",
        );
        if (!response.ok) throw new Error("Failed to load.");

        const data = (await response.json()) as GetStoriesResult;

        const story = data.stories.find(
          (s) => s.staffPick?.id === params.id,
        );

        if (!story || !story.staffPick) {
          setIsNotFound(true);
          return;
        }

        const publishedDate = new Date(story.publishedAt ?? story.createdAt);
        const primaryAuthor =
          story.storyContributions.find(
            (c) => c.contributionType === "AUTHOR",
          ) ?? story.storyContributions[0];

        setStaffPick({
          id: story.staffPick.id,
          article: {
            id: story.id,
            title: story.title,
            summary: story.summary,
            thumbnailUrl: story.thumbnailUrl,
            topic: story.topics[0] ?? "SCIQUEL_MATTERS",
            authorName: primaryAuthor
              ? `${primaryAuthor.contributor.firstName} ${primaryAuthor.contributor.lastName}`
              : "SciQuel",
            condensedDate: formatCondensedDate(publishedDate),
            href: buildStoryHref(publishedDate, story.slug),
          },
          quote: story.staffPick.description,
          // Use the editor name stored on the staff pick
          quoteAuthor: story.staffPick.authorName,
        });
      } catch {
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, [params.id]);

  if (isNotFound) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-6 py-12">
      <HomepageSection heading="Edit your Staff Pick">
        <div className="border-t border-sciquelCardBorder">
          {isLoading || !staffPick ? (
            <p className="py-12 text-center text-sciquelMuted">Loading…</p>
          ) : (
            <StaffPickCreateFlow mode="edit" initialStaffPick={staffPick} />
          )}
        </div>
      </HomepageSection>
    </div>
  );
}