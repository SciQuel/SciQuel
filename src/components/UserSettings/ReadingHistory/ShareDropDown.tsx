import Image from "next/image";
import { createRef, useRef, useState } from "react";
import ClipboardIcon from "../../../../public/assets/images/clipboard.svg";
import MailIcon from "../../../../public/assets/images/email.svg";
import LinkedinIcon from "../../../../public/assets/images/linkedin.svg";
import facebookIcon from "../../../../public/assets/images/story-facebook.png";
import shareIcon from "../../../../public/assets/images/story-share.png";
import xIcon from "../../../../public/assets/images/xicon.png";
import { type ReadingHistory as ReadingHistoryType } from "../../../app/user-settings/actions/getReadingHistory";

const iconButtonClass =
  "flex h-[40px] w-[40px] md:h-[40px] md:w-[40px] p-1 md:p-2 justify-center items-center rounded-full transition ease-linear  bg-[#76a89f] ";

interface props {
  popupRefs: React.MutableRefObject<
    Record<string, React.RefObject<HTMLDivElement>>
  >;
  reading: ReadingHistoryType[number] & { uuid: string };
  activeSharePopup: string | null;
}
const ShareDropDown = ({ popupRefs, reading, activeSharePopup }: props) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [showClipBoardIcon, setShowClipboardIcon] = useState(false);

  // on click, show the popup to copy reading url
  const handleShareClick = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.stopPropagation();

    setShowClipboardIcon((prev) => !prev);
  };

  const handleClipboardClick = () => {
    if (textRef.current) {
      const textToCopy = textRef?.current?.textContent;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(() => alert("error copying text"));
    }
  };

  // get baseurl for link
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sci-quel-weld.vercel.app";

  const open = activeSharePopup === reading.uuid;

  const buttonIcons = [];

  return (
    <div
      className={`absolute left-0 z-50 mt-3  w-1/2 md:relative md:right-0 md:w-full    ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      tabIndex={open ? 0 : -1}
      onClick={(e) => e.stopPropagation()}
      key={reading.uuid}
      ref={(popupRefs.current[reading.uuid] ??= createRef<HTMLDivElement>())}
    >
      {/* Icons */}
      <div className="relative z-10 flex  w-auto justify-between  gap-3 rounded-lg  bg-sciquelCardBg p-2 shadow-md ">
        <Image
          src={shareIcon}
          className={`${iconButtonClass}, sm:p-0, bg-transparent !p-0 md:p-0`}
          onClick={() => setShowClipboardIcon(!showClipBoardIcon)}
          width={20}
          height={20}
          role="button"
          tabIndex={0}
          alt="share a link to this story"
        />
        <span className="sr-only">share a link to this story</span>

        <a
          href="mailto:?subject=Check Out This Article&body=sciquel.org"
          className={iconButtonClass}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          <MailIcon width={20} height={20} />
          <span className="sr-only">email this article</span>
        </a>

        <a
          href="https://www.facebook.com/sharer/sharer.php?u=sciquel.org"
          className=""
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={facebookIcon}
            className=" h-[35px] w-[35px] md:h-[40px] md:w-[40px]"
            alt="share to facebook"
            width={40}
            height={40}
          />
        </a>

        <a
          href="https://www.linkedin.com/sharing/share-offsite/?url=sciquel.org"
          className={iconButtonClass}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          <LinkedinIcon width={20} height={20} />
          <span className="sr-only">Share to Linkedin</span>
        </a>

        <a
          href="https://twitter.com/intent/tweet?text=sciquel.org"
          className={iconButtonClass}
          target="_blank"
          onClick={(e) => handleShareClick(e)}
        >
          <Image src={xIcon} alt="share to x" width={20} height={20} />
        </a>
      </div>

      {/* link and copy ubtton that will show when user hits share again */}
      {showClipBoardIcon && open && (
        <div
          ref={textRef}
          className="absolute  left-0  z-10 mt-2 flex  w-full items-center gap-2 rounded-lg bg-sciquelCardBg px-1  py-3 shadow-md md:px-3"
        >
          <ClipboardIcon
            onClick={handleClipboardClick}
            className="h-4/5 w-[40px] cursor-pointer"
          />

          {/* Link */}
          <div className="h-4/5 flex-1 truncate rounded-full bg-[#76a89f] p-2 text-white">
            {`${baseUrl}/stories/${new Date(
              reading.createdAt,
            ).getUTCFullYear()}/${
              new Date(reading.createdAt).getUTCMonth() + 1
            }/${new Date(reading.createdAt).getUTCDate()}/${
              reading.story.slug
            }`}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareDropDown;
