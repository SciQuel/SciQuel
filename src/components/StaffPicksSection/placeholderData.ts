import { type StoryTopic } from "@prisma/client";

export interface PlaceholderArticle {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  topic: StoryTopic;
  authorName: string;
  condensedDate: string;
  href: string;
}

export interface PlaceholderStaffPick {
  id: string;
  articleId: string;
  href: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  topic: StoryTopic;
  authorName: string;
  condensedDate: string;
  quote: string;
  quoteAuthor: string;
  quoteHandle: string;
  quoteDate: string;
  avatarUrl: string;
}

export const placeholderArticles: PlaceholderArticle[] = [
  {
    id: "bobtail-squid",
    title: "Lights. Camera. Action!",
    summary:
      "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens.",
    thumbnailUrl: "/assets/images/bobtail.png",
    topic: "BIOLOGY",
    authorName: "Edward Chen",
    condensedDate: "05/27/21",
    href: "/stories/read",
  },
];

export const placeholderStaffPicks: PlaceholderStaffPick[] = [
  {
    id: "1",
    articleId: "bobtail-squid",
    href: "/stories/read",
    title: "Lights. Camera. Action!",
    summary:
      "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens.",
    thumbnailUrl: "/assets/images/bobtail.png",
    topic: "BIOLOGY",
    authorName: "Edward Chen",
    condensedDate: "05/27/21",
    quote:
      "A compelling story that highlights the Hawaiian bobtail squid's remarkable ability to recruit and host a single bacterial partner, Vibrio fischeri, through highly selective biological mechanisms.",
    quoteAuthor: "Edward Chen",
    quoteHandle: "SciQuel",
    quoteDate: "12/5/25",
    avatarUrl: "/user-settings/ProfilePicture.png",
  },
  {
    id: "2",
    articleId: "bobtail-squid",
    href: "/stories/read",
    title: "Lights. Camera. Action!",
    summary:
      "How the Hawaiian bobtail squid brings a creative vision to its maritime world of small big screens.",
    thumbnailUrl: "/assets/images/bobtail.png",
    topic: "BIOLOGY",
    authorName: "Edward Chen",
    condensedDate: "05/27/21",
    quote:
      "A compelling story that highlights the Hawaiian bobtail squid's remarkable ability to recruit and host a single bacterial partner, Vibrio fischeri, through highly selective biological mechanisms.",
    quoteAuthor: "Edward Chen",
    quoteHandle: "SciQuel",
    quoteDate: "12/5/25",
    avatarUrl: "/user-settings/ProfilePicture.png",
  },
];