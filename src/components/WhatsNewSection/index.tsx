"use client";

import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import MainCard from "@/components/MainCard";
import axios from "axios";
import { DateTime } from "luxon";
import useSWR, { type Fetcher } from "swr";

const fetcher: Fetcher<GetStoriesResult, string> = async (url) => {
  return (await axios.get<GetStoriesResult>(url)).data.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    publishedAt: new Date(story.publishedAt),
    updatedAt: new Date(story.updatedAt),
  }));
};

export default function WhatsNewSection() {
  const { data } = useSWR("/api/stories", fetcher);

  const headlineArticle = data?.[0];
  const readMoreArticles = data?.slice(1, 4) ?? [];
  // const articles = [
  //   {
  //     topic: "COMPUTER_SCIENCE",
  //     title: "Lights. Camera. Action! ASD ASD ASD ASD ASD ASD",
  //     subtitle:
  //       "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
  //     author: "Edward Chen",
  //     date: new Date("May 27, 2021"),
  //     thumbnailUrl: "/assets/images/bobtail.png",
  //   },
  //   {
  //     topic: "COMPUTER_SCIENCE",
  //     title: "Lights. Camera. Action!",
  //     subtitle:
  //       "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
  //     author: "Edward Chen",
  //     date: new Date("May 27, 2021"),
  //     thumbnailUrl: "/assets/images/bobtail.png",
  //   },
  //   {
  //     topic: "COMPUTER_SCIENCE",
  //     title:
  //       "Lights. Camera. Action! ASD ASD ASD ASD ASD ASD Lorem Ipsum Dolor Sit Amet Consectitur",
  //     subtitle:
  //       "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
  //     author: "Edward Chen",
  //     date: new Date("May 27, 2021"),
  //     thumbnailUrl: "/assets/images/bobtail.png",
  //   },
  // ] satisfies Article[];

  return (
    <HomepageSection heading="Read what's new">
      <div className="pb-5">
        {headlineArticle && (
          <MainCard
            thumbnailUrl={headlineArticle.thumbnailUrl}
            title={headlineArticle.title}
            subtitle={headlineArticle.summary}
            author={(() => {
              const author = headlineArticle.storyContributions.find(
                (value) => value.contributionType === "AUTHOR",
              );
              return author
                ? `${author.user.firstName} ${author.user.lastName}`
                : "";
            })()}
            date={DateTime.fromJSDate(
              headlineArticle.publishedAt,
            ).toLocaleString(DateTime.DATE_FULL)}
            mediaType={headlineArticle.storyType}
            tag={headlineArticle.tags[0]}
            href={`/${headlineArticle.publishedAt.getFullYear()}/${headlineArticle.publishedAt.getMonth()}/${headlineArticle.publishedAt.getDay()}/${
              headlineArticle.slug
            }`}
          />
        )}
      </div>
      {readMoreArticles && <ArticleList articles={readMoreArticles} />}
    </HomepageSection>
  );
}
