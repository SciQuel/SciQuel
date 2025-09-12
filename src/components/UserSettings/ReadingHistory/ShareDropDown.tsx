import Image from "next/image";
import { useRef, useState, createRef} from "react";
import ClipboardIcon from "../../../../public/assets/images/clipboard.svg";
import MailIcon from "../../../../public/assets/images/email.svg";
import LinkedinIcon from "../../../../public/assets/images/linkedin.svg";
import facebookIcon from "../../../../public/assets/images/story-facebook.png";
import shareIcon from "../../../../public/assets/images/story-share.png";
import xIcon from "../../../../public/assets/images/xicon.png";
import { type ReadingHistory as ReadingHistoryType } from "../../../app/user-settings/actions/getReadingHistory";


const iconButtonClass =
    "flex h-[35px] w-[35px] md:h-[40px] md:w-[40px] p-1 md:p-2 justify-center items-center rounded-full transition ease-linear  bg-[#76a89f] ";


interface props{
  popupRefs: React.MutableRefObject<Record<string, React.RefObject<HTMLDivElement>>>;
  reading: ReadingHistoryType[number] & { uuid: string };
  activeSharePopup: string | null;
}
const ShareDropDown = ({ popupRefs, reading, activeSharePopup }: props) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const [showClipBoardIcon, setShowClipboardIcon] = useState(false);


  // on click, show the popup to copy reading url
  const handleShareClick = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();

    setShowClipboardIcon((prev) => !prev);
  };

  const handleClipboardClick = () => {
    if (textRef.current) {
      const textToCopy= textRef?.current?.textContent;
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

  const buttonIcons = [
    
  ]

  return (
    <div
      className={`relative p-1 right-0 z-50 mt-3    ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" 
      }`}
      tabIndex= {open ? 0 : -1}
      onClick={(e) => e.stopPropagation()}
      key={reading.uuid}
      ref={(popupRefs.current[reading.uuid] ??= createRef<HTMLDivElement>())}
    >
      {/* Icons */}
      <div className="relative z-10 flex w-auto  justify-between gap-2 rounded-lg shadow-lg">
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
          className=""
          target="_blank"
          onClick={(e) => e.stopPropagation()}
        >
          
          <Image
            src={facebookIcon}
            className=" h-[35px] w-[35px] md:h-[40px] md:w-[40px]"
            alt="share to facebook"
            width ={40}
            height = {40}
           
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
          className="absolute top-[100%] z-10  mt-2 flex  w-full items-center gap-2 rounded-lg bg-white px-3 py-3 shadow-lg shadow-md"
        >
          <ClipboardIcon
            onClick={handleClipboardClick}
            className="h-4/5 w-[40px] cursor-pointer"
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
