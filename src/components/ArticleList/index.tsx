import { type EnumKey } from "@/lib/enums";
import type Topic from "@/lib/enums/Topic";
import ArticleCard from "../ArticleCard/ArticleCard";

interface Article {
  topic: EnumKey<typeof Topic>;
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
    <div className="grid auto-rows-max grid-cols-3 gap-4">
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
