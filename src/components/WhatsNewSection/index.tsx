import ArticleList, { type Article } from "../ArticleList";
import HomepageSection from "../HomepageSection";
import MainCard from "../MainCard/MainCard";

export default function WhatsNewSection() {
  const articles = [
    {
      topic: "COMPUTER_SCIENCE",
      title: "Lights. Camera. Action! ASD ASD ASD ASD ASD ASD",
      subtitle:
        "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
      author: "Edward Chen",
      date: new Date("May 27, 2021"),
      thumbnailUrl: "/assets/images/bobtail.png",
    },
    {
      topic: "COMPUTER_SCIENCE",
      title: "Lights. Camera. Action!",
      subtitle:
        "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
      author: "Edward Chen",
      date: new Date("May 27, 2021"),
      thumbnailUrl: "/assets/images/bobtail.png",
    },
    {
      topic: "COMPUTER_SCIENCE",
      title:
        "Lights. Camera. Action! ASD ASD ASD ASD ASD ASD Lorem Ipsum Dolor Sit Amet",
      subtitle:
        "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd asd ",
      author: "Edward Chen",
      date: new Date("May 27, 2021"),
      thumbnailUrl: "/assets/images/bobtail.png",
    },
  ] satisfies Article[];

  return (
    <HomepageSection heading="Read what's new">
      <div className="pb-5">
        <MainCard
          thumbnailUrl="/assets/images/bobtail.png"
          title={"Lights. Camera. Action!"}
          subtitle={
            "How does the Hawaiian bobtail squid singly live with Vibrio fischeri? A look at the Special Relationship between an uncommon bacterium and a pocket-sized squid."
          }
          author={"Edward Chen"}
          date={"May 27, 2021"}
          mediaType={"Article"}
          tag="MEDICINE"
          href={"/"}
        />
      </div>
      <ArticleList articles={articles} />
    </HomepageSection>
  );
}
