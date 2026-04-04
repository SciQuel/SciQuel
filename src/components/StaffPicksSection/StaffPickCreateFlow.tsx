// This component is a temporary prototype for the staff pick creation flow,
// used to validate the design and interactions before wiring it up to real data and actions.
// It is not currently integrated into the app and can be accessed at /staff-picks-preview from the header link.
// The placeholder article data and simplified submit flow will be replaced with real implementations once the design is finalized.

// "use client" is required to use state and effects in this component, which are necessary for the interactive create flow steps and form handling.
"use client";

import { type GetStoriesResult } from "@/app/api/stories/route";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type StoryTopic } from "@prisma/client";
import { useDeferredValue, useEffect, useState } from "react";
import StaffPickCard from "./StaffPickCard";
import { type PlaceholderStaffPick } from "./placeholderData";
import TopicTag from "../TopicTag";

type Step = "compose" | "preview" | "success";

interface ArticleOption {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  topic: StoryTopic;
  authorName: string;
  condensedDate: string;
  href: string;
}

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
  const deferredSearchValue = useDeferredValue(searchValue);
  // Real article options now come from the stories API instead of placeholder data.
  const [articleOptions, setArticleOptions] = useState<ArticleOption[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleOption | null>(
    initialStaffPick ? mapStaffPickToArticle(initialStaffPick) : null,
  );
  const [isLoadingArticles, setIsLoadingArticles] = useState(!isEditMode);
  const [articleLoadError, setArticleLoadError] = useState<string | null>(null);
  const [quote, setQuote] = useState(initialStaffPick?.quote ?? "");
  const [authorName, setAuthorName] = useState(
    initialStaffPick?.quoteAuthor ?? "",
  );

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    // Keep the prototype edit screen fixed to its seeded article, but load live articles for create.
    const controller = new AbortController();
    const params = new URLSearchParams({
      published: "true",
      // Only show stories that are not already picked as staff picks.
      staff_pick: "false",
      page_size: "25",
    });
    const normalizedSearchValue = deferredSearchValue.trim();

    if (normalizedSearchValue) {
      params.set("keyword", normalizedSearchValue);
    }

    setIsLoadingArticles(true);
    setArticleLoadError(null);

    void fetch(`/api/stories?${params.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load articles.");
        }

        return (await response.json()) as GetStoriesResult;
      })
      .then((result) => {
        // Normalize story records into the lighter picker/preview shape this flow already uses.
        setArticleOptions(result.stories.map(mapStoryToArticle));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        console.error(error);
        setArticleOptions([]);
        setArticleLoadError("We couldn't load articles right now.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingArticles(false);
        }
      });

    return () => controller.abort();
  }, [deferredSearchValue, isEditMode]);

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
                    onClick={() => setSelectedArticle(null)}
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

                {/* Show richer article results so the user can scan before selecting. */}
                <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
                  {isLoadingArticles ? (
                    <div className="px-4 py-5 text-sm text-sciquelMuted">
                      Loading articles...
                    </div>
                  ) : articleOptions.length > 0 ? (
                    <div className="max-h-[20rem] overflow-y-auto">
                      {articleOptions.map((article) => (
                        <button
                          key={article.id}
                          type="button"
                          onClick={() => setSelectedArticle(article)}
                          className="flex w-full flex-col gap-3 border-b border-gray-100 px-4 py-4 text-left transition hover:bg-[#f6fbfb] last:border-b-0"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 flex-col gap-2">
                              <span className="text-lg font-semibold leading-snug text-sciquelHeading">
                                {article.title}
                              </span>
                              <p className="line-clamp-2 text-sm leading-relaxed text-sciquelMuted">
                                {article.summary}
                              </p>
                            </div>
                            <span className="rounded-full bg-sciquelTeal px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                              Select
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-sciquelMuted">
                            <TopicTag name={article.topic} />
                            <span className="font-semibold text-sciquelDarkText">
                              By {article.authorName}
                            </span>
                            <span>{article.condensedDate}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                {articleLoadError ? (
                  <p className="text-sm font-medium text-[#db3631]">
                    {articleLoadError}
                  </p>
                ) : null}

                {!isLoadingArticles && !articleLoadError && articleOptions.length === 0 ? (
                  <p className="text-sm text-sciquelMuted">
                    No published articles matched your search.
                  </p>
                ) : null}
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

function mapStaffPickToArticle(staffPick: PlaceholderStaffPick): ArticleOption {
  return {
    id: staffPick.articleId,
    title: staffPick.title,
    summary: staffPick.summary,
    thumbnailUrl: staffPick.thumbnailUrl,
    topic: staffPick.topic,
    authorName: staffPick.authorName,
    condensedDate: staffPick.condensedDate,
    href: staffPick.href,
  };
}

// Convert the full story payload into the article card fields used by the staff pick flow.
function mapStoryToArticle(story: GetStoriesResult["stories"][number]): ArticleOption {
  const publishedDate = new Date(story.publishedAt ?? story.createdAt);
  const primaryAuthor =
    story.storyContributions.find(
      (contribution) => contribution.contributionType === "AUTHOR",
    ) ?? story.storyContributions[0];

  return {
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
  };
}

function formatCondensedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).format(date);
}

function buildStoryHref(date: Date, slug: string) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `/stories/${year}/${month}/${day}/${slug}`;
}