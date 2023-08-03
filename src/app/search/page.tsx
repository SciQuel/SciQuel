import { GetStoriesResult } from "@/app/api/stories/route";
import Search from "@/components/Search";
import SearchArticle from "@/components/SearchArticle";
import env from "@/lib/env";

interface Params {
  searchParams: { [key: string]: string | "" };
}

export default async function SearchPage({ searchParams }: Params) {
  console.log("searchParams", searchParams);
  const [articles] = await Promise.all([retrieveDefaultContent(searchParams)]);
  // const search = await retrieveSearchContent(params);

  return (
    <div>
      <Search searchParams={searchParams} />

      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <SearchArticle articles={articles} />
      </div>
    </div>
  );
}

async function retrieveDefaultContent({
  keyword,
  type,
  date_from,
  date_to,
  sort_by,
}: Params["searchParams"]) {
  let storyRoute = ``;
  const filterKeyword = keyword != "undefined" ? `keyword=${keyword}` : ``;
  console.log("filterKeyword", filterKeyword);
  const filterType = type != "undefined" ? `type=${type}` : ``;
  console.log("filterType", type != "undefined", filterType);
  let filterDate;
  if (date_from != "undefined" && date_to != "") {
    filterDate = `date_from=${date_from}&date_to=${date_to}`;
  } else {
    if (date_from != "undefined") {
      filterDate = `date_from=${date_from}`;
    } else if (date_to != "undefined") {
      filterDate = `date_to=${date_to}`;
    } else {
      filterDate = ``;
    }
  }
  console.log("filterDate", filterDate);

  const filterSort = sort_by != "undefined" ? `sort_by=${sort_by}` : ``;
  console.log("keyword", filterKeyword);
  if (
    filterKeyword != `` &&
    filterType != `` &&
    filterDate != `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterKeyword}&${filterType}&${filterDate}&${filterSort}`;
  } else if (
    filterKeyword != `` &&
    filterType != `` &&
    filterDate != `` &&
    filterSort == ``
  ) {
    storyRoute = `/stories?${filterKeyword}&${filterType}&${filterDate}`;
  } else if (
    filterKeyword != `` &&
    filterType != `` &&
    filterDate == `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterKeyword}&${filterType}&${filterSort}`;
  } else if (
    filterKeyword != `` &&
    filterType != `` &&
    filterDate == `` &&
    filterSort == ``
  ) {
    storyRoute = `/stories?${filterKeyword}&${filterType}`;
  } else if (
    filterKeyword != `` &&
    filterType == `` &&
    filterDate != `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterKeyword}&${filterDate}&${filterSort}`;
  } else if (
    filterKeyword != `` &&
    filterType == `` &&
    filterDate != `` &&
    filterSort == ``
  ) {
    storyRoute = `/stories?${filterKeyword}&${filterDate}`;
  } else if (
    filterKeyword != `` &&
    filterType == `` &&
    filterDate == `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterKeyword}&${filterSort}`;
  } else if (
    filterKeyword != `` &&
    filterType == `` &&
    filterDate == `` &&
    filterSort == ``
  ) {
    storyRoute = `/stories?${filterKeyword}`;
  } else if (
    filterKeyword == `` &&
    filterType != `` &&
    filterDate != `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterType}&${filterDate}&${filterSort}`;
  } else if (
    filterKeyword == `` &&
    filterType != `` &&
    filterDate != `` &&
    filterSort == ``
  ) {
    storyRoute = `/stories?${filterType}&${filterDate}`;
  } else if (
    filterKeyword == `` &&
    filterType != `` &&
    filterDate == `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterType}&${filterSort}`;
  } else if (
    filterKeyword == `` &&
    filterType != `` &&
    filterDate == `` &&
    filterSort == ``
  ) {
    storyRoute = `/stories?${filterType}`;
  } else if (
    filterKeyword == `` &&
    filterType == `` &&
    filterDate != `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterDate}&${filterSort}`;
  } else if (
    filterKeyword == `` &&
    filterType == `` &&
    filterDate != `` &&
    filterSort == ``
  ) {
    storyRoute = `/stories?${filterDate}`;
  } else if (
    filterKeyword == `` &&
    filterType == `` &&
    filterDate == `` &&
    filterSort != ``
  ) {
    storyRoute = `/stories?${filterSort}`;
  } else {
    storyRoute = `/stories`;
  }

  console.log("route ", storyRoute);
  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api${storyRoute}`, {
    next: { tags: [storyRoute] },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const stories = await res
    .json()
    .then((value: GetStoriesResult) => value.stories);

  return stories.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    publishedAt: new Date(story.publishedAt),
    updatedAt: new Date(story.updatedAt),
  }));
}
