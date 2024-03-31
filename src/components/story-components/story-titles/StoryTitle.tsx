import { GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import TitleLeft from "./TitleTextLeft";
import TitleOnImage from "./TitleTextOnImage";
import TitleRight from "./TitleTextRight";
import TitleTop from "./TitleTextTop";

interface Props {
  story: GetStoryResult;
}

export default function StoryTitle({ story }: Props) {
  switch (story.headlineConfiguration) {
    case "TITLE_LEFT":
      return <TitleLeft story={story} />;
    case "TITLE_ON_IMAGE":
      return <TitleOnImage story={story} />;
    case "TITLE_RIGHT":
      return <TitleRight story={story} />;

    case "TITLE_TOP":
      return <TitleTop story={story} />;

    default:
      return <TitleOnImage story={story} />;
  }
}
