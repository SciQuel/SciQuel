import { type GetContributionResult } from "@/app/api/contributor/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import Avatar from "@/components/Avatar";
import FooterIcon from "@/components/Footer/FooterIcon";
import HomepageSection from "@/components/HomepageSection";
import ProfileButton from "@/components/profile-page/ProfileButtons";
import ProfileSidebar from "@/components/profile-page/ProfileSidebar";
import Pagination from "@/components/StoriesList/Pagination";
import TopicTag from "@/components/TopicTag";
import env from "@/lib/env";
import prisma from "@/lib/prisma";
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

function parseStaffPick(staffPick: string | undefined) {
  if (staffPick == "true") {
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
        return (await res.json()) as GetContributionResult;
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
        return (await res.json()) as GetContributionResult;
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
  const staffPick = parseStaffPick(searchParams["Sr"]);
  const contributorSlug = params.slug;
  const startingArticles = await getArticles(
    contributorSlug,
    pageNum,
    staffPick,
  );
  if (!startingArticles) {
    notFound();
  }

  return (
    <>
      <div className="flex h-fit min-h-[calc(100vh_-_4rem)] w-full flex-col justify-between sm:flex-row">
        <ProfileSidebar contributor={startingArticles.contributor} />

        <div className="flex h-full w-5/6 p-6 pt-16 text-center">
          <ProfileButton slug={contributorSlug} searchParams={searchParams} />
          <div>
            <div className="my-3 text-left">
              {/* <HomepageSection
                        heading={
                          category ? category + " Stories" : "Recent Stories"
                        }
                      /> */}
            </div>
            <div className="my-3 text-left">
              {/* <ArticleList articles={stories} /> */}
            </div>
            <div className="my-3 text-right">
              {/* <Pagination total_pages={total_pages} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

async function getStories(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const route = `/stories?${searchParams.toString()}&page_size=30`;

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

async function retrieveAuthors(id: string) {
  const authors = await prisma.user.findUnique({
    where: { id: id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      bio: true,
      roles: true,
    },
  });

  return authors;
}
