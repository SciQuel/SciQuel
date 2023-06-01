import Topic from "@/lib/enums/Topic";
import ArticleList from "../ArticleList";
import HomepageSection from "../HomepageSection";

export default function TrendingSection() {
  const articles = [
    {
      topic: Topic.COMPUTER_SCIENCE,
      title: "Lights. Camera. Action! ASD ASD ASD ASD ASD ASD",
      subtitle:
        "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
      author: "Edward Chen",
      date: new Date("May 27, 2021"),
      thumbnailUrl: "/assets/images/bobtail.png",
    },
    {
      topic: Topic.COMPUTER_SCIENCE,
      title: "Lights. Camera. Action!",
      subtitle:
        "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
      author: "Edward Chen",
      date: new Date("May 27, 2021"),
      thumbnailUrl: "/assets/images/bobtail.png",
    },
    {
      topic: Topic.COMPUTER_SCIENCE,
      title:
        "Lights. Camera. Action! ASD ASD ASD ASD ASD ASD Lorem Ipsum Dolor Sit Amet",
      subtitle:
        "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
      author: "Edward Chen",
      date: new Date("May 27, 2021"),
      thumbnailUrl: "/assets/images/bobtail.png",
    },
  ];

  return (
    <HomepageSection heading="Trending">
      <ArticleList articles={articles} />
    </HomepageSection>
  );
}
