import { type Stories } from "@/app/api/stories/route";
import ArticleList from "../ArticleList";
import HomepageSection from "../HomepageSection";

interface Props {
  articles: Stories;
}

export default function SearchArticle({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <div className={`w-full`}>
        <p className={`w-full text-center`}>
          There are no stories that match the search criteria. Check back soon
          for new stories!
        </p>
      </div>
    );
  }

  return (
    <HomepageSection heading="Search Result....">
      {articles && <ArticleList articles={articles} preferHorizontal={true} />}
    </HomepageSection>
  );
}
