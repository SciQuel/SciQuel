import Image from "next/image";
import { useRef, useState } from "react";
import ClipboardIcon from "../../../../public/assets/images/clipboard.svg";
import MailIcon from "../../../../public/assets/images/email.svg";
import LinkedinIcon from "../../../../public/assets/images/linkedin.svg";
import facebookIcon from "../../../../public/assets/images/story-facebook.png";
import shareIcon from "../../../../public/assets/images/story-share.png";
import xIcon from "../../../../public/assets/images/xicon.png";

const iconButtonClass =
  "flex md:h-[40px] md:w-[40px] h-[25px] w-[25px] items-center justify-center rounded-full bg-[#76a89f] py-1 transition ease-linear";

const ShareDropDown = ({ popupRefs, reading, activeSharePopup }) => {
  const textRef = useRef();
  const [showClipBoardIcon, setShowClipboardIcon] = useState(false);

  const handleShareClick = (e) => {
    e.stopPropagation();

    setShowClipboardIcon((prev) => !prev);
  };

  const handleClipboardClick = () => {
    if (textRef.current) {
      const textToCopy = textRef.current.textContent;
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

  return (
    <div
      className={`relative right-0 z-50 mt-3  overflow-visible  ${
        open ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => e.stopPropagation()}
      key={reading.uuid}
      ref={(popupRefs.current[reading.uuid] ??= { current: null })}
    >
      {/* Icons */}
      <div className="relative z-10 flex w-auto items-center justify-between gap-2 rounded-lg px-3 shadow-lg">
        <button onClick={handleShareClick} className={iconButtonClass}>
          <Image
            src={shareIcon}
            width={20}
            height={20}
            alt="share a link to this story"
          />
          <span className="sr-only">share a link to this story</span>
        </button>

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
          className={iconButtonClass}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={facebookIcon}
            alt="share to facebook"
            width={20}
            height={20}
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
      {showClipBoardIcon && (
        <div
          ref={textRef}
          className="absolute top-[100%] z-10  mt-2 flex  w-[250px] items-center gap-2 rounded-lg bg-white px-3 py-3 shadow-lg shadow-md"
        >
          <ClipboardIcon
            onClick={handleClipboardClick}
            className="h-4/5 w-[40px]"
          />

          {/* Link */}
          <div className="h-4/5 flex-1 truncate rounded-full bg-[#76a89f] p-2">
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
