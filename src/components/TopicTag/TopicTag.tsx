import Topic from "@/lib/topic";

interface Props {
  name: (typeof Topic)[keyof typeof Topic];
}

const topicTagColors: Record<(typeof Topic)[keyof typeof Topic], string> = {
  [Topic.ASTRONOMY]: "#A44A3F",
  [Topic.BIOLOGY]: "#D15B2B",
  [Topic.CHEMICAL_ENGINEERING]: "#E3954F",
  [Topic.CHEMISTRY]: "#C39075",
  [Topic.COMPUTER_SCIENCE]: "#FFC834",
  [Topic.ELECTRICAL_ENGINEERING]: "#ACB377",
  [Topic.ENVIRONMENTAL_SCIENCE]: "#54623A",
  [Topic.GEOLOGY]: "#387270",
  [Topic.MATHEMATICS]: "#50A2A7",
  [Topic.MECHANICAL_ENGINEERING]: "#0A2B5E",
  [Topic.MEDICINE]: "#7282AC",
  [Topic.PHYSICS]: "#AB95B3",
  [Topic.PSYCHOLOGY]: "#624563",
  [Topic.SOCIOLOGY]: "#CC6666",
  [Topic.TECHNOLOGY]: "#4E413F",
} as const;

export default function TopicTag({ name }: Props) {
  return (
    <div
      className="flex items-center rounded-full px-3 py-1"
      // Tailwind compilation only supports style, not interpolated arbitrary values
      style={{ backgroundColor: topicTagColors[name] }}
    >
      <p className="m-0 text-xs font-medium text-white">{name}</p>
    </div>
  );
}

export { TopicTag };
