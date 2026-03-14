"use client";

import { useState } from "react";
import Link from "next/link";
import HomepageSection from "@/components/HomepageSection";
import StaffPickCard from "@/components/StaffPicksSection/StaffPickCard";
import {
  placeholderStaffPicks,
  type PlaceholderStaffPick,
} from "@/components/StaffPicksSection/placeholderData";

export default function StaffPicksPreviewPage() {
  const [staffPicks, setStaffPicks] = useState(placeholderStaffPicks);
  const [staffPickPendingDelete, setStaffPickPendingDelete] =
    useState<PlaceholderStaffPick | null>(null);

  function closeDeleteModal() {
    setStaffPickPendingDelete(null);
  }

  function confirmDelete() {
    if (!staffPickPendingDelete) {
      return;
    }

    setStaffPicks((currentStaffPicks) => {
      return currentStaffPicks.filter(
        (staffPick) => staffPick.id !== staffPickPendingDelete.id,
      );
    });
    closeDeleteModal();
  }

  return (
    <>
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl flex-col px-6 py-12">
        <HomepageSection heading="Your Staff Picks">
          <div className="flex flex-col gap-8 border-t border-sciquelCardBorder pt-8">
            {staffPicks.map((staffPick) => {
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
                  <Link
                    href={`/staff-picks-preview/${staffPick.id}/edit`}
                    className="rounded-md bg-[#039a36] px-7 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-85"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setStaffPickPendingDelete(staffPick)}
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
                  onClick={confirmDelete}
                  className="rounded-md bg-[#db3631] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-85"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}