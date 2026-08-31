"use client";

import { type ReactNode } from "react";
import InstagramIcon from "../Footer/images/icons8-instagram.svg";
import FacebookIcon from "./images/icons8-facebook.svg";
import YouTubeIcon from "./images/icons8-youtube.svg";
import WebsiteIcon from "./images/web-svgrepo-com.svg";

interface Props {
  type: "instagram" | "website" | "facebook" | "youtube";
}

export default function FooterIcon({ type }: Props) {
  const iconMap: Record<typeof type, ReactNode> = {
    instagram: (
      <button>
        <InstagramIcon className="h-[2rem] w-auto" />{" "}
      </button>
    ),
    website: (
      <button>
        <div className="flex h-[2rem] w-[2rem] items-center justify-center">
          <WebsiteIcon className="h-[2rem] w-[2rem]" />
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
    // website: (
    //   <button>
    //     <WebsiteIcon className="h-[2rem] w-[2rem]" />
    //   </button>
    // ),
  };
  return iconMap[type];
}
