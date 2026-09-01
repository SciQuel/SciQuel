"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { type GetStoriesResult } from "@/app/api/stories/route";
import HomepageSection from "@/components/HomepageSection";
import StaffPickCard from "@/components/StaffPicksSection/StaffPickCard";

// Lightweight shape for the staff pick cards displayed on this dashboard
interface StaffPickEntry {
  staffPickId: string;
  storyId: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  topic: string;
  authorName: string;
  condensedDate: string;
  href: string;
  quote: string;
  quoteAuthor: string;
  quoteDate: string;
}

// Build a story URL from its publish date and slug
function buildStoryHref(date: Date, slug: string) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `/stories/${year}/${month}/${day}/${slug}`;
}

// Format a date as MM/DD/YY for the condensed card layout
function formatCondensedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).format(date);
}

// Map the API story payload to the flat shape used by the preview cards
function mapStoryToEntry(
  story: GetStoriesResult["stories"][number],
): StaffPickEntry | null {
  if (!story.staffPick) return null;

  const publishedDate = new Date(story.publishedAt ?? story.createdAt);
  const primaryAuthor =
    story.storyContributions.find((c) => c.contributionType === "AUTHOR") ??
    story.storyContributions[0];

  return {
    staffPickId: story.staffPick.id,
    storyId: story.id,
    title: story.title,
    summary: story.summary,
    thumbnailUrl: story.thumbnailUrl,
    topic: story.topics[0] ?? "SCIQUEL_MATTERS",
    authorName: primaryAuthor
      ? `${primaryAuthor.contributor.firstName} ${primaryAuthor.contributor.lastName}`
      : "SciQuel",
    condensedDate: formatCondensedDate(publishedDate),
    href: buildStoryHref(publishedDate, story.slug),
    quote: story.staffPick.description,
    quoteAuthor: story.staffPick.authorName,
    quoteDate: formatCondensedDate(new Date(story.staffPick.createdAt)),
  };
}

export default function StaffPicksPreviewPage() {
  const [staffPicks, setStaffPicks] = useState<StaffPickEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Pending delete state: holds the entry the user wants to remove
  const [staffPickPendingDelete, setStaffPickPendingDelete] =
    useState<StaffPickEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch all stories marked as staff picks from the API
  const fetchStaffPicks = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch(
        "/api/stories?published=true&staff_pick=true&page_size=50",
      );
      if (!response.ok) throw new Error("Failed to load staff picks.");

      const data = (await response.json()) as GetStoriesResult;
      const entries = data.stories
        .map(mapStoryToEntry)
        .filter((entry): entry is StaffPickEntry => entry !== null);
      setStaffPicks(entries);
    } catch {
      setLoadError("We couldn't load staff picks right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStaffPicks();
  }, [fetchStaffPicks]);

  function closeDeleteModal() {
    setStaffPickPendingDelete(null);
    setDeleteError(null);
  }

  // Call the DELETE endpoint then remove the entry from local state
  async function confirmDelete() {
    if (!staffPickPendingDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(
        `/api/staff/mark-story/${staffPickPendingDelete.staffPickId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete staff pick.");
      }

      // Remove from local state so the UI updates immediately
      setStaffPicks((current) =>
        current.filter(
          (entry) =>
            entry.staffPickId !== staffPickPendingDelete.staffPickId,
        ),
      );
      closeDeleteModal();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-6 py-12">
        <HomepageSection heading="Your Staff Picks">
          <div className="flex flex-col gap-8 border-t border-sciquelCardBorder pt-8">
            {/* Loading / error / empty states */}
            {isLoading ? (
              <p className="py-8 text-center text-sciquelMuted">
                Loading staff picks…
              </p>
            ) : loadError ? (
              <p className="py-8 text-center text-sm font-medium text-[#db3631]">
                {loadError}
              </p>
            ) : staffPicks.length === 0 ? (
              <p className="py-8 text-center text-sciquelMuted">
                No staff picks yet. Create one below!
              </p>
            ) : (
              staffPicks.map((entry) => (
                <div
                  key={entry.staffPickId}
                  className="flex flex-col gap-6 border-b border-sciquelCardBorder pb-8 last:border-b-0"
                >
                  <StaffPickCard
                    href={entry.href}
                    title={entry.title}
                    summary={entry.summary}
                    thumbnailUrl={entry.thumbnailUrl}
                    topic={entry.topic as Parameters<typeof StaffPickCard>[0]["topic"]}
                    authorName={entry.authorName}
                    condensedDate={entry.condensedDate}
                    quote={entry.quote}
                    quoteAuthor={entry.quoteAuthor}
                    quoteHandle="SciQuel"
                    quoteDate={entry.quoteDate}
                    avatarUrl="/user-settings/ProfilePicture.png"
                    showDivider={false}
                  />

                  <div className="flex gap-3">
                    {/* Edit navigates to the edit page with the real staff pick ID */}
                    <Link
                      href={`/staff-picks-preview/${entry.staffPickId}/edit`}
                      className="rounded-md bg-[#039a36] px-7 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-85"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setStaffPickPendingDelete(entry)}
                      className="rounded-md bg-[#db3631] px-7 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-85"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
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

      {/* Confirmation modal for deleting a staff pick */}
      {staffPickPendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-6"
          onClick={closeDeleteModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-staff-pick-title"
            aria-describedby="delete-staff-pick-description"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-sciquelCardBorder bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
          >
            <div className="flex flex-col gap-4">
              <h2
                id="delete-staff-pick-title"
                className="text-2xl font-semibold text-sciquelHeading"
              >
                Delete this Staff Pick?
              </h2>
              <p
                id="delete-staff-pick-description"
                className="text-base leading-relaxed text-sciquelMuted"
              >
                Are you sure you want to delete your staff pick for
                <span className="font-semibold text-sciquelHeading">
                  {` ${staffPickPendingDelete.title}`}
                </span>
                ?
              </p>

              {/* Show API error inside the modal so the user doesn't lose context */}
              {deleteError ? (
                <p className="text-sm font-medium text-[#db3631]">
                  {deleteError}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-md border border-sciquelCardBorder bg-white px-6 py-2.5 text-sm font-semibold text-sciquelHeading transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => void confirmDelete()}
                  className="rounded-md bg-[#db3631] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}