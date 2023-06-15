import DashboardCard from "@/components/UserSettings/DashboardCard";

//import Union from "/user-settings/Union.svg";
//import ViewVector from "user-settings/ViewVector.svg";

const items = [
  {
    title: "Lights, Camera, Action!",
    author: "Jane Smith",
    date: "2",
    image: "/user-settings/ArticleImage.svg",
    type: "articles",
  },
  {
    title: "Lights, Camera, Action!",
    author: "Jane Smith",
    date: "2",
    image: "/user-settings/ArticleImage.svg",
    type: "articles",
  },
  {
    title: "Lights, Camera, Action!",
    author: "Jane Smith",
    date: "2",
    image: "/user-settings/ArticleImage.svg",
    type: "articles",
  },
  {
    title: "Lights, Camera, Action!",
    author: "Jane Smith",
    date: "2",
    image: "/user-settings/ArticleImage.svg",
    type: "articles",
  },
  {
    title: "Lights, Camera, Action",
    description: "Nowadays we have humans putting fire on everything.",
    date: "2",
    subtitle: "Paragraph 4",
    image: "/user-settings/Annotation3.svg",
    type: "annotations",
  },
  {
    title: "Lights, Camera, Action!",
    description: "Nowadays we have humans putting fire on everything.",
    date: "2",
    subtitle: "Paragraph 4",
    image: "/user-settings/Annotation3.svg",
    type: "annotations",
  },
  {
    title: "Lights, Camera, Action!",
    description: "Nowadays we have humans putting fire on everything.",
    date: "2",
    subtitle: "Paragraph 4",
    image: "/user-settings/Annotation2.svg",
    type: "annotations",
  },
  {
    title: "Lights, Camera, Action!",
    description: "Nowadays we have humans putting fire on everything.",
    date: "2",
    subtitle: "Paragraph 4",
    image: "/user-settings/Annotation.svg",
    type: "annotations",
  },
  {
    title: "Lights, Camera, Action!",
    description: "Nowadays we have humans putting fire on everything.",
    date: "2",
    subtitle: "Paragraph 4",
    image: "/user-settings/Annotation3.svg",
    type: "annotations",
  },
  {
    title: "Lights, Camera, Action!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp or incididunt ut labore et dolore magna aliqua.",
    date: "2",
    subtitle: "Comment",
    image: "/user-settings/Comment.svg",
    type: "comments",
  },
  {
    title: "Lights, Camera, Action!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp or incididunt ut labore et dolore magna aliqua.",
    date: "2",
    subtitle: "Comment",
    image: "/user-settings/Comment.svg",
    type: "comments",
  },
  {
    title: "Lights, Camera, Action!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp or incididunt ut labore et dolore magna aliqua.",
    date: "2",
    subtitle: "Reply",
    image: "/user-settings/Reply.svg",
    type: "comments",
  },
  {
    title: "Lights, Camera, Action!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp or incididunt ut labore et dolore magna aliqua.",
    date: "2",
    subtitle: "Comment",
    image: "/user-settings/Comment.svg",
    type: "comments",
  },
  {
    title: "Lights, Camera, Action!",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temp or incididunt ut labore et dolore magna aliqua.",
    date: "2",
    subtitle: "Reply",
    image: "/user-settings/Reply.svg",
    type: "comments",
  },
];

export default function ArticleCards() {
  return (
    <div className="my-12 grid grow grid-cols-1 gap-8 lg:grid-cols-2">
      <DashboardCard
        title="Brained Articles"
        targetType="articles"
        articles={items}
      />
      <DashboardCard
        title="Saved Definitions"
        targetType="articles"
        articles={items}
      />
      <DashboardCard
        title="Annotations"
        targetType="annotations"
        articles={items}
      />
      <DashboardCard title="Comments" targetType="comments" articles={items} />
      <DashboardCard title="Bookmarks" targetType="articles" articles={items} />
    </div>
  );
}
