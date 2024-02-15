import Image from "next/image";
import SciquelIcon from "../../../../public/assets/images/logo.png";

export default function StoryEndIcon() {
  return (
    <Image
      width={35}
      height={40}
      className="inline rounded-full bg-sciquelTeal p-0.5"
      alt="Sciquel icon"
      src={SciquelIcon.src}
    />
  );
}
