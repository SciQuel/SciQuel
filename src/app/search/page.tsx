import { type GetStoriesResult } from "@/app/api/stories/route";
import Search from "@/components/Search";
import SearchArticle from "@/components/SearchArticle";
import env from "@/lib/env";

interface Params {
  searchParams: { [key: string]: string | undefined };
}

export default async function SearchPage({ searchParams }: Params) {
  // console.log("searchParams", searchParams);
  const search = await retrieveDefaultContent(searchParams);

  return (
    <div>
      <Search searchParams={searchParams} />

      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <SearchArticle articles={search} />
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
  const filterKeyword = keyword != undefined ? keyword : ``;
  const filterType = type != undefined ? type : ``;

  let filterDate;
  let filterDateF = ``;
  let filterDateT = ``;
  if (date_from != undefined && date_to != undefined) {
    filterDateF = date_from;
    filterDateT = date_to;
  } else if (date_from != undefined) {
    filterDateF = date_from;
  } else if (date_to != undefined) {
    filterDateT = date_to;
  } else {
    filterDate = ``;
  }

  if (filterDateF != "" && filterDateT != "") {
    filterDate = `date_from=${filterDateF}&date_to=${filterDateT}`;
  } else if (filterDateF != "") {
    filterDate = `date_from=${filterDateF}`;
  } else if (filterDateT != "") {
    filterDate = `date_to=${filterDateT}`;
  }
  const filterSort = sort_by != undefined ? sort_by : ``;
  if (
    filterKeyword != "" &&
    filterType != "" &&
    filterDate != "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}&type=${filterType}&${filterDate}&sort_by=${filterSort}`;
  } else if (
    filterKeyword != "" &&
    filterType != "" &&
    filterDate != "" &&
    filterSort == ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}&type=${filterType}&${filterDate}`;
  } else if (
    filterKeyword != "" &&
    filterType != "" &&
    filterDate == "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}&type=${filterType}&sort_by=${filterSort}`;
  } else if (
    filterKeyword != "" &&
    filterType != "" &&
    filterDate == "" &&
    filterSort == ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}&type=${filterType}`;
  } else if (
    filterKeyword != "" &&
    filterType == "" &&
    filterDate != "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}&${filterDate}&sort_by=${filterSort}`;
  } else if (
    filterKeyword != "" &&
    filterType == "" &&
    filterDate != "" &&
    filterSort == ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}&${filterDate}`;
  } else if (
    filterKeyword != "" &&
    filterType == "" &&
    filterDate == "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}&sort_by=${filterSort}`;
  } else if (
    filterKeyword != "" &&
    filterType == "" &&
    filterDate == "" &&
    filterSort == ""
  ) {
    storyRoute = `/stories?keyword=${filterKeyword}`;
  } else if (
    filterKeyword == "" &&
    filterType != "" &&
    filterDate != "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?type=${filterType}&${filterDate}&sort_by=${filterSort}`;
  } else if (
    filterKeyword == "" &&
    filterType != "" &&
    filterDate != "" &&
    filterSort == ""
  ) {
    storyRoute = `/stories?type=${filterType}&${filterDate}`;
  } else if (
    filterKeyword == "" &&
    filterType != "" &&
    filterDate == "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?type=${filterType}&sort_by=${filterSort}`;
  } else if (
    filterKeyword == "" &&
    filterType != "" &&
    filterDate == "" &&
    filterSort == ""
  ) {
    storyRoute = `/stories?type=${filterType}`;
  } else if (
    filterKeyword == "" &&
    filterType == "" &&
    filterDate != "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?${filterDate}&sort_by=${filterSort}`;
  } else if (
    filterKeyword == "" &&
    filterType == "" &&
    filterDate != "" &&
    filterSort == ""
  ) {
    storyRoute = `/stories?${filterDate}`;
  } else if (
    filterKeyword == "" &&
    filterType == "" &&
    filterDate == "" &&
    filterSort != ""
  ) {
    storyRoute = `/stories?sort_by=${filterSort}`;
  } else {
    storyRoute = `/stories`;
  }
  console.log("route", storyRoute);
  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api${storyRoute}`, {
    next: { tags: [storyRoute] },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const stories = await res
    .json()
    .then((value: GetStoriesResult) => value.stories);

  // console.log("story", stories);
  return stories.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    publishedAt: new Date(story.publishedAt),
    updatedAt: new Date(story.updatedAt),
  }));
}
