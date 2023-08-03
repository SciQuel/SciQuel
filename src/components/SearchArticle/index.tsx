import { type Stories } from "@/app/api/stories/route";
import ArticleList from "../ArticleList";
import HomepageSection from "../HomepageSection";

interface Props {
  articles: Stories;
}

export default function StaffPicksSection({ articles }: Props) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <HomepageSection heading="Search Result....">
      {articles && (
        <ArticleList articles={articles.slice(0, 3)} preferHorizontal={true} />
      )}
    </HomepageSection>
  );
}
