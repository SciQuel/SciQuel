import { type StoryTopic } from "@prisma/client";
import Link from "next/link";

interface Props {
  name: StoryTopic;
  clickable?: boolean;
}

const topicTagColors: Record<StoryTopic, string> = {
  ASTRONOMY: "#A44A3F",
  BIOLOGY: "#D15B2B",
  CHEMICAL_ENGINEERING: "#E3954F",
  CHEMISTRY: "#C39075",
  COMPUTER_SCIENCE: "#FFC834",
  ELECTRICAL_ENGINEERING: "#ACB377",
  ENVIRONMENTAL_SCIENCE: "#54623A",
  GEOLOGY: "#387270",
  MATHEMATICS: "#50A2A7",
  MECHANICAL_ENGINEERING: "#0A2B5E",
  MEDICINE: "#7282AC",
  PHYSICS: "#AB95B3",
  PSYCHOLOGY: "#624563",
  SOCIOLOGY: "#CC6666",
  TECHNOLOGY: "#4E413F",
} as const;

//TopicTag can now be passed in an optional clickable arguement
export default function TopicTag({ name, clickable = true }: Props) {
  return clickable ? (
    <Link href={`/stories/topics/${name}`}>
      <span
        className="topic-tag flex w-fit items-center rounded-full px-3 py-1"
        style={{ backgroundColor: topicTagColors[name] }}
      >
        <p className="m-0 text-xs font-medium text-white">
          {name?.replace("_", " ").toLowerCase()}
        </p>
      </span>
    </Link>
  ) : (
    <span
      className="flex w-fit items-center rounded-full px-3 py-1"
      style={{ backgroundColor: topicTagColors[name] }}
    >
      <p className="m-0 text-xs font-medium text-white">
        {name?.replace("_", " ").toLowerCase()}
      </p>
    </span>
  );
}
