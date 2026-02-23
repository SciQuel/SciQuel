"use client";

// import axios from "axios";
// import { useSession } from "next-auth/react";
import { useContext, useEffect, useRef, useState } from "react";
// import DictionaryIcon from "../../../public/assets/images/book.svg";
import ShareIcon from "../../../public/assets/images/share.svg";
// import DictionaryButton from "./dictionary/DictionaryButton";
// import { DictionaryContext } from "./dictionary/DictionaryContext";
import { PrintContext, PrintToggleContext } from "./PrintContext";
import SocialMediaPopup from "./SocialMediaPopup";

type modalOptions = "none" | "brain-login" | "bookmark-login" | "share";

// interface Props {
//   storyId: string;
//   observe: boolean;
// }

const PrintModeIcon = () => (
  <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#76a89f]">
    <p className="sr-only">Switch to print mode</p>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 2V8H20"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 13H8"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 17H8"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 9H9H8"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
);

export default function ShareLinks() {
  const [showOptions, setShowOptions] = useState<modalOptions>("none");

  // const [isBrained, setIsBrained] = useState(false);
  // const [isBookmarked, setIsBookmarked] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const popupRef2 = useRef<HTMLDivElement>(null);
  // const popupRef3 = useRef<HTMLDivElement>(null);

  const isPrintMode = useContext(PrintContext);
  const toggleFunction = useContext(PrintToggleContext);
  // const { data: session, status } = useSession();

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  function handleClick(e: MouseEvent) {
    let shouldShut = true;

    if (popupRef.current?.contains(e.target as Node)) {
      shouldShut = false;
    }

    if (popupRef2.current?.contains(e.target as Node)) {
      shouldShut = false;
    }

    if (shouldShut) {
      setShowOptions("none");
    }
  }

  return (
    <div id="share-links" className="flex flex-row lg:flex-col gap-4 mt-2">
      {/* Print Mode Button */}
      <button
        type="button"
        className="pointer-events-auto h-fit w-fit rounded-full"
        aria-label="Print Mode"
        onClick={() => {
          if (toggleFunction) {
            window.scrollTo(0, 0);
            toggleFunction(!isPrintMode);
          }
        }}
      >
        <PrintModeIcon />
      </button>

      {/* Share Button */}
      <div
        onMouseLeave={() => {
          setShowOptions("none");
        }}
        onMouseEnter={() => {
          if (window.innerWidth > 640) {
            setShowOptions("share");
          }
        }}
        className={`pointer-events-auto  flex h-fit w-fit flex-col md:flex-row`}
      >
        <button
          type="button"
          aria-haspopup={true}
          aria-expanded={showOptions == "share"}
          className="pointer-events-auto h-fit w-fit rounded-full xl:ml-0"
          onClick={() => {
            if (showOptions == "share") {
              setShowOptions("none");
            } else {
              setShowOptions("share");
            }
          }}
        >
          <ShareIcon className="rounded-full bg-[#76a89f] h-[45px] w-[45px]" />
        </button>
        <div className="ml-[0.25rem] absolute">
          <SocialMediaPopup show={showOptions == "share"} ref={popupRef} />
        </div>
      </div>

    </div>
  );
}
