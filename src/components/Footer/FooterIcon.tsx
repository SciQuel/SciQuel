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
    instagram: (
      <button>
        <InstagramIcon className="h-[2rem] w-auto" />{" "}
      </button>
    ),
    arrow: (
      <button>
        <div className="flex h-[2rem] w-[2rem] items-center justify-center">
          <ArrowIcon />
        </div>
      </button>
    ),
    facebook: (
      <button>
        <FacebookIcon className="h-[2rem] w-auto" />
      </button>
    ),
    youtube: (
      <button>
        {" "}
        <YouTubeIcon className="h-[2rem] w-auto" />{" "}
      </button>
    ),
  };
  return iconMap[type];
}
