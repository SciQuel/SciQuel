import Topic from "@/lib/topic";
import ArticleList from "../ArticleList";
import MainCard from "../MainCard/MainCard";

export default function WhatsNewSection() {
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
    <div>
      <h1 className="text-4xl font-[550] text-sciquelHeading">
        Read what&apos;s new
      </h1>
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
          tag={Topic.MEDICINE}
          href={"/"}
        />
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}
