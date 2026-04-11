import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import StaffPickCard from "@/components/StaffPicksSection/StaffPickCard";
import Pagination from "@/components/StoriesList/Pagination";
import env from "@/lib/env";
import { DateTime } from "luxon";

interface Params {
  topic: string;
  staff_pick: string;
  page_number: string;
}

export default async function StoriesListPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { topic, staff_pick, page_number } = searchParams;
  const params = {
    ...(topic ? { topic } : {}),
    ...(staff_pick && staff_pick === "true" ? { staff_pick: "true" } : {}),
    page: page_number || "1",
  };

  const { stories, total_pages } = await getStories(params);

  const isStaffPick = staff_pick === "true";

  // Header text shows ALL TOPICS by default or Topic if specified
  let headerText = topic ? topic.toUpperCase().replace("_", " ") : "ALL TOPICS";

  // Add Staff Pick to header text if user specified staff pick
  if (isStaffPick) {
    headerText += " | Staff Picks";
  }

  return (
    <>
      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <HomepageSection heading={headerText}>
          {stories.length > 0 ? (
            <>
              {/* Use the richer StaffPickCard layout when browsing staff picks */}
              {isStaffPick ? (
                <div className="flex flex-col gap-8">
                  {stories.map((article) => {
                    const publishDate = DateTime.fromJSDate(article.publishedAt).toUTC();
                    const href = `/stories/${publishDate.year}/${publishDate.toFormat("LL")}/${publishDate.toFormat("dd")}/${article.slug}`;
                    const author = article.storyContributions.find(
                      (v) => v.contributionType === "AUTHOR",
                    );
                    const authorName = author
                      ? `${author.contributor.firstName} ${author.contributor.lastName}`
                      : "";

                    return (
                      <StaffPickCard
                        key={article.id}
                        href={href}
                        title={article.title}
                        summary={article.summary}
                        thumbnailUrl={article.thumbnailUrl}
                        topic={article.topics?.[0] ?? "BIOLOGY"}
                        authorName={authorName}
                        condensedDate={publishDate.toFormat("MM/dd/yy")}
                        quote={article.staffPick?.description ?? ""}
                        quoteAuthor={article.staffPick?.authorName ?? "SciQuel"}
                        quoteHandle="SciQuel"
                        quoteDate={
                          article.staffPick
                            ? new Intl.DateTimeFormat("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "2-digit",
                              }).format(new Date(article.staffPick.createdAt))
                            : publishDate.toFormat("MM/dd/yy")
                        }
                        avatarUrl="/user-settings/ProfilePicture.png"
                      />
                    );
                  })}
                </div>
              ) : (
                <ArticleList articles={stories} preferHorizontal={true} />
              )}

              <Pagination total_pages={total_pages} />
            </>
          ) : (
            <h2 className="text-3xl font-[550] text-sciquelHeading">
              No Result
            </h2>
          )}
        </HomepageSection>
      </div>
    </>
  );
}

async function getStories(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const route = `/stories?${searchParams.toString()}`;

  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api${route}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: GetStoriesResult = await res.json().then();

  data.stories = data.stories.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    publishedAt: new Date(story.publishedAt),
    updatedAt: new Date(story.updatedAt),
  }));

  return data;
}
