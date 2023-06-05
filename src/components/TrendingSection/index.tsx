"use client";

import { type GetStoriesResult } from "@/app/api/stories/route";
import axios from "axios";
import useSWR, { type Fetcher } from "swr";
import ArticleList from "../ArticleList";
import HomepageSection from "../HomepageSection";

const fetcher: Fetcher<GetStoriesResult, string> = async (url) => {
  return (await axios.get<GetStoriesResult>(url)).data.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    publishedAt: new Date(story.publishedAt),
    updatedAt: new Date(story.updatedAt),
  }));
};

export default function TrendingSection() {
  const { data } = useSWR("/api/stories", fetcher);

  return (
    <HomepageSection heading="Trending">
      {data && <ArticleList articles={data.slice(0, 3)} />}
    </HomepageSection>
  );
}
