import type Topic from "@/lib/topic";
import ArticleCard from "../ArticleCard/ArticleCard";

interface Article {
  topic: (typeof Topic)[keyof typeof Topic];
  title: string;
  subtitle: string;
  author: string;
  date: Date;
  thumbnailUrl: string;
}

interface Props {
  articles: Article[];
}

export default function ArticleList({ articles }: Props) {
  return (
    <div className="flex flex-row gap-5">
      {articles.map((article) => (
        <ArticleCard
          href="#"
          key={article.title}
          topic={article.topic}
          title={article.title}
          subtitle={article.subtitle}
          author={article.author}
          date={article.date.toDateString()}
          thumbnailUrl={article.thumbnailUrl}
        />
      ))}
    </div>
  );
}
