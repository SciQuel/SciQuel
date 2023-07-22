"use client";

import InstagramIcon from "../Footer/images/icons8-instagram.svg";
import ArrowIcon from "./images/arrow-right-circle.svg";
import FacebookIcon from "./images/icons8-facebook.svg";
import YouTubeIcon from "./images/icons8-youtube.svg";

interface Props {
  type: "instagram" | "arrow" | "facebook" | "youtube";
}

export default function FooterIcon({ type }: Props) {
  const iconMap: Record<typeof type, JSX.Element> = {
    instagram: <InstagramIcon className="h-[2rem] w-auto" />,
    arrow: (
      <div className="flex h-[2rem] w-[2rem] items-center justify-center">
        <ArrowIcon />
      </div>
    ),
    facebook: <FacebookIcon className="h-[2rem] w-auto" />,
    youtube: <YouTubeIcon className="h-[2rem] w-auto" />,
  };
  return iconMap[type];
}
