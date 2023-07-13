import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import NavigateLink from "../HomepageSection/NavigateLink";

interface Props {
  articles: GetStoriesResult;
}

export default function TrendingSection({ articles }: Props) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <HomepageSection heading="Trending">
      {articles && <ArticleList articles={articles.slice(0, 3)} />}
      <NavigateLink text="Browse all trending" route="/stories/list" />
    </HomepageSection>
  );
}
