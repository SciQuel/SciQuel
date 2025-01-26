import { type StoryTopic } from "@prisma/client";

interface Props {
  name: StoryTopic;
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

export default function TopicTag({ name }: Props) {
  return (
    <span
      className="flex w-fit items-center rounded-full px-3 py-1"
      // Tailwind compilation only supports style, not interpolated arbitrary values
      style={{ backgroundColor: topicTagColors[name] }}
    >
      <p className="m-0 text-xs font-medium text-white">
        {name?.replace("_", " ").toLowerCase()}
      </p>
    </span>
  );
}
