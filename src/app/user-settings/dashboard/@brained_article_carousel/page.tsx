import getCurrentUser from "@/app/user-settings/actions/getCurrentUser";
import BrainedArticleCarousel from "@/components/UserDashboard/BrainedArticleCarousel";
import { type User } from "@prisma/client";

export default async function Greeting() {
  const currUser: User | null = await getCurrentUser();
  if (currUser === null) return null;
  const items = [
    {
      title: "Lights, Camera, Action!",
      author: "Jane Smith",
      date: "2",
      image: "/user-settings/ArticleImage.svg",
      type: "articles",
    },
    {
      title: "Sceleratus Phoebus coniugis",
      author: "Edward Chen",
      date: "2",
      image: "/user-settings/ArticleImage.svg",
      type: "articles",
    },
    {
      title: "Lecto nostrae postquam maneret",
      author: "Edward Chen",
      date: "2",
      image: "/user-settings/ArticleImage.svg",
      type: "articles",
    },
  ];
  return <BrainedArticleCarousel articles={items} />;
}
