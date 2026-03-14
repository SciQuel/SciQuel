// This component is a temporary prototype for the staff pick creation flow,
// used to validate the design and interactions before wiring it up to real data and actions.
// It is not currently integrated into the app and can be accessed at /staff-picks-preview from the header link.
// The placeholder article data and simplified submit flow will be replaced with real implementations once the design is finalized.

// "use client" is required to use state and effects in this component, which are necessary for the interactive create flow steps and form handling.
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import StaffPickCard from "./StaffPickCard";
import {
  placeholderArticles,
  type PlaceholderStaffPick,
} from "./placeholderData";

type Step = "compose" | "preview" | "success";

interface StaffPickCreateFlowProps {
  mode?: "create" | "edit";
  initialStaffPick?: PlaceholderStaffPick;
}

// Shared button styling for the bottom navigation controls
function ActionButton(props: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const variant = props.variant ?? "primary";
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={[
        "min-w-[6.5rem] rounded-md px-8 py-3 text-sm font-semibold text-white transition",
        variant === "primary" ? "bg-sciquelTeal hover:opacity-85" : "bg-sciquelTeal hover:opacity-85",
        props.disabled ? "cursor-not-allowed opacity-40" : "shadow-[0_10px_25px_rgba(25,75,82,0.18)]",
      ].join(" ")}
    >
      {props.children}
    </button>
  );
}

export default function StaffPickCreateFlow({
  mode = "create",
  initialStaffPick,
}: StaffPickCreateFlowProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  // This controls which screen of the create flow is currently visible
  const [step, setStep] = useState<Step>("compose");
  const [searchValue, setSearchValue] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState(
    initialStaffPick?.articleId ?? "",
  );
  const [quote, setQuote] = useState(initialStaffPick?.quote ?? "");
  const [authorName, setAuthorName] = useState(
    initialStaffPick?.quoteAuthor ?? "",
  );

  // Filter the placeholder article list from the search box input
  const filteredArticles = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) {
      return placeholderArticles;
    }

    return placeholderArticles.filter((article) => {
      return (
        article.title.toLowerCase().includes(normalized) ||
        article.authorName.toLowerCase().includes(normalized) ||
        article.topic.toLowerCase().replaceAll("_", " ").includes(normalized)
      );
    });
  }, [searchValue]);

  // Resolve the selected article once so the form and preview can both reuse it
  const selectedArticle = placeholderArticles.find(
    (article) => article.id === selectedArticleId,
  );

  // Preview is only enabled once the core draft fields are filled in
  const canPreview = Boolean(
    selectedArticle && quote.trim().length > 0 && authorName.trim().length > 0,
  );
  const previewDate = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  }).format(new Date());

  // The success screen replaces the form after the temporary submit action
  if (step === "success") {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center gap-6 text-center">
        <p className="text-2xl font-semibold text-black">
          {isEditMode
            ? "Success! Your Staff Pick has been updated."
            : "Success! Your Staff pick has been submitted."}
        </p>
        <Link
          href="/staff-picks-preview"
          className="text-lg font-semibold text-[#2667ff] transition hover:opacity-80"
        >
          Go to staff picks page
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[34rem] flex-col justify-between gap-12 pt-8">
      {step === "compose" ? (
        // Compose step: choose an article and write the quote details
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <section className="flex flex-col gap-5">
            <h2 className="text-[2rem] font-semibold leading-none text-black">
              {isEditMode ? "Selected Article" : "Choose your Article"}
            </h2>

            {selectedArticle ? (
              // Once an article is selected, show it as a removable tag instead of the picker
              <div className="flex items-center gap-3 pt-2">
                <span className="text-2xl font-medium text-[#2667ff]">
                  {selectedArticle.title}
                </span>
                {isEditMode ? null : (
                  <button
                    type="button"
                    onClick={() => setSelectedArticleId("")}
                    className="text-2xl font-medium text-[#ff1d14] transition hover:opacity-70"
                    aria-label="Remove selected article"
                  >
                    ×
                  </button>
                )}
              </div>
            ) : isEditMode ? null : (
              <>
                {/* Search narrows the temporary article choices shown in the dropdown */}
                <div className="relative w-full">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                    ⌕
                  </span>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search"
                    className="w-full rounded-md border border-gray-300 bg-white py-3 pl-11 pr-4 text-lg text-black outline-none transition placeholder:text-gray-400 focus:border-sciquelTeal"
                  />
                </div>

                {/* The dropdown is the actual selector for which article becomes the staff pick */}
                <div className="w-full">
                  <select
                    value={selectedArticleId}
                    onChange={(event) => setSelectedArticleId(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-lg text-black outline-none transition focus:border-sciquelTeal"
                  >
                    <option value="">Article</option>
                    {filteredArticles.map((article) => (
                      <option key={article.id} value={article.id}>
                        {article.title}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </section>

          <section className="flex flex-col gap-5">
            <h2 className="text-[2rem] font-semibold leading-none text-black">
              {isEditMode ? "Edit your Quote" : "Write your Quote"}
            </h2>

            {/* Quote text is reused directly in the preview card */}
            <textarea
              value={quote}
              onChange={(event) => setQuote(event.target.value)}
              placeholder="Write your quote here"
              className="min-h-[13rem] w-full rounded-md border border-gray-300 bg-white px-5 py-4 text-lg leading-relaxed text-black outline-none transition placeholder:text-gray-400 focus:border-sciquelTeal"
            />

            {/* The author name is kept separate so the preview can mimic the final attribution line */}
            <input
              type="text"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              placeholder="Your Name"
              className="w-full rounded-md border border-gray-300 bg-white px-5 py-3 text-lg font-semibold text-black outline-none transition placeholder:font-medium placeholder:text-gray-400 focus:border-sciquelTeal"
            />
          </section>
        </div>
      ) : (
        // Preview step: render the reusable staff pick card with the current draft values
        <section className="flex flex-col gap-8 pt-2">
          <h2 className="text-[2rem] font-semibold leading-none text-black">Preview</h2>
          {selectedArticle ? (
            <div className="w-full">
              <StaffPickCard
                href={selectedArticle.href}
                title={selectedArticle.title}
                summary={selectedArticle.summary}
                thumbnailUrl={selectedArticle.thumbnailUrl}
                topic={selectedArticle.topic}
                authorName={selectedArticle.authorName}
                condensedDate={selectedArticle.condensedDate}
                quote={quote}
                quoteAuthor={authorName}
                quoteHandle="SciQuel"
                quoteDate={previewDate}
                avatarUrl="/user-settings/ProfilePicture.png"
                showDivider={false}
              />
            </div>
          ) : null}
        </section>
      )}

      {/* Bottom controls either move to preview or finish the temporary submit flow */}
      <div className="flex items-end justify-between pt-8">
        <ActionButton
          onClick={() => {
            if (step === "compose") {
              router.push("/staff-picks-preview");
              return;
            }
            setStep("compose");
          }}
        >
          Back
        </ActionButton>

        {step === "compose" ? (
          <ActionButton disabled={!canPreview} onClick={() => setStep("preview")}>
            Preview
          </ActionButton>
        ) : (
          <ActionButton onClick={() => setStep("success")}>
            {isEditMode ? "Save" : "Submit"}
          </ActionButton>
        )}
      </div>
    </div>
  );
}