import { GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import TitleLeft from "./TitleTextLeft";
import TitleOnImage from "./TitleTextOnImage";
import TitleRight from "./TitleTextRight";
import TitleTop from "./TitleTextTop";

interface Props {
  story: GetStoryResult;
}

export default function StoryTitle({ story }: Props) {
  return <TitleTop story={story} />;
}
