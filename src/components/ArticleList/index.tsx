import ArticleCard from "../ArticleCard/ArticleCard";

interface Article {
  topic: string;
  title: string;
  subtitle?: string;
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
          key={article.title}
          topic={article.topic}
          title={article.title}
          subtitle={article.subtitle}
          author={article.author}
          date={article.date.toDateString()}
          src={article.thumbnailUrl}
        />
      ))}
    </div>
  );
}
