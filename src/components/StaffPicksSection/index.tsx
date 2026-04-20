import { type Stories } from "@/app/api/stories/route";
import ArticleList from "../ArticleList";
import HomepageSection from "../HomepageSection";
import NavigateLink from "../HomepageSection/NavigateLink";

interface Props {
  articles: Stories;
}

export default function StaffPicksSection({ articles }: Props) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <HomepageSection heading="Staff Picks">
      {articles && (
        <ArticleList articles={articles.slice(0, 3)} preferHorizontal={true} />
      )}
      <NavigateLink
        text="Browse staff picks"
        route="/stories/list?staff_pick=true"
      />
    </HomepageSection>
  );
}
