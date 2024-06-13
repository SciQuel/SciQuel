import { type GetContributionResult } from "@/app/api/contributor/route";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import HomepageSection from "@/components/HomepageSection";
import ProfileButton from "@/components/profile-page/ProfileButtons";
import ProfileSidebar from "@/components/profile-page/ProfileSidebar";
import Pagination from "@/components/StoriesList/Pagination";
import env from "@/lib/env";
import { DateTime } from "luxon";
import { notFound } from "next/navigation";

interface Params {
  searchParams: { [key: string]: string };
  params: {
    slug: string;
  };
}

function parsePageNum(page: string | undefined) {
  if (!page) {
    return 1;
  }

  const int = parseInt(page);

  if (isNaN(int)) {
    return 1;
  }

  return int;
}

function parseStaffPick(category: string | undefined) {
  if (category == "staff_picks") {
    return true;
  }
  return false;
}

async function getArticles(slug: string, page: number, staffPick: boolean) {
  if (staffPick) {
    try {
      const res = await fetch(
        `${
          env.NEXT_PUBLIC_SITE_URL
        }/api/contributor?contributorSlug=${slug}&staffPick=True&pageNum=${
          page - 1
        }`,
      );
      if (res.ok) {
        const raw = (await res.json()) as GetContributionResult;
        raw.stories = raw.stories.map((story) => ({
          ...story,
          publishedAt: new Date(story.publishedAt),
        }));
        return raw;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  } else {
    try {
      const res = await fetch(
        `${
          env.NEXT_PUBLIC_SITE_URL
        }/api/contributor?contributorSlug=${slug}&pageNum=${page - 1}`,
      );
      if (res.ok) {
        const raw = (await res.json()) as GetContributionResult;
        raw.stories = raw.stories.map((story) => ({
          ...story,
          publishedAt: new Date(story.publishedAt),
        }));
        return raw;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return null;
}

/* Test: 
    ID with author role:  64ff8fa50d2710ca31d09555
    ID with out author role: 64cc4fefe601ab59588a9e0f
*/
export default async function ProfilePage({ searchParams, params }: Params) {
  const pageNum = parsePageNum(searchParams["page"]);
  const staffPick = parseStaffPick(searchParams["category"]);
  const category = staffPick ? "Staff Pick" : null;
  const contributorSlug = params.slug;
  const startingArticles = await getArticles(
    contributorSlug,
    pageNum,
    staffPick,
  );

  if (!startingArticles) {
    notFound();
  }
  const pageSize = 9;
  const totalPages = Math.ceil(startingArticles.count / pageSize);
  return (
    <>
      <div className="flex h-fit min-h-[calc(100vh_-_4rem)] w-full flex-col justify-between md:flex-row">
        <ProfileSidebar contributor={startingArticles.contributor} />

        <div className="flex h-full flex-1 flex-col gap-3 p-6 pt-8 text-center">
          <ProfileButton slug={contributorSlug} searchParams={searchParams} />

          <div className="flex flex-col gap-4">
            <div className=" text-left">
              <HomepageSection
                heading={category ? category + " Stories" : "Recent Stories"}
              />
            </div>
            <div className="grid flex-1 grid-cols-1 gap-4 text-left lg:grid-cols-2 xl:grid-cols-3 ">
              {startingArticles.stories.map((article) => (
                <ArticleCard
                  href={(() => {
                    const publishDate = DateTime.fromJSDate(
                      article.publishedAt,
                    ).toUTC();
                    return `/stories/${publishDate.year}/${publishDate.toFormat(
                      "LL",
                    )}/${publishDate.toFormat("dd")}/${article.slug}`;
                  })()}
                  key={article.title}
                  topic={article.tags[0]}
                  title={article.title}
                  subtitle={article.summary}
                  author={(() => {
                    const author = article.storyContributions.find(
                      (value) => value.contributionType === "AUTHOR",
                    );
                    return author
                      ? `${author.contributor.firstName} ${author.contributor.lastName}`
                      : "";
                  })()}
                  date={DateTime.fromJSDate(article.publishedAt).toLocaleString(
                    DateTime.DATE_FULL,
                  )}
                  thumbnailUrl={article.thumbnailUrl}
                  mini={false}
                  preferHorizontal={false}
                />
              ))}
            </div>
            <div className="mt-4 text-right">
              <Pagination total_pages={totalPages} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
