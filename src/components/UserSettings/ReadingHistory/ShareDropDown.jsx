import Image from "next/image";
import ClipboardIcon from "../../../../public/assets/images/clipboard.svg";
import MailIcon from "../../../../public/assets/images/email.svg";
import LinkedinIcon from "../../../../public/assets/images/linkedin.svg";
import facebookIcon from "../../../../public/assets/images/story-facebook.png";
import shareIcon from "../../../../public/assets/images/story-share.png";
import xIcon from "../../../../public/assets/images/xicon.png";

const ShareDropDown = ({ popupRef }) => {
  return (
    <>
      {/* container for the button div and the link dropdown */}
      <div className="absolute right-0  top-5 z-50 h-[80px] w-[calc(100%+200px)] overflow-visible">
        <div
          className=" fixed z-10 flex h-[300px] w-[150px] flex-col items-center justify-between rounded-lg bg-white px-3 shadow-lg "
          ref={popupRef}
        >
          <button
            type="button"
            aria-haspopup={true}
            className={`relative z-30  rounded-full  py-1`}
          >
            <Image
              src={shareIcon}
              alt="share a link to this story"
              width={40}
              height={40}
            />
          </button>{" "}
          <a
            href={`mailto:?subject=Check Out This Article&body=sciquel.org$`}
            className={`   flex h-[px40] w-[40px] items-center justify-center rounded-full bg-[#76a89f]  py-1 transition ease-linear`}
            target="_blank"
          >
            <MailIcon className="h-full w-full object-cover " />
            <span className="sr-only">email this article</span>
          </a>
          <a
            className={`rounded-full`}
            target="_blank"
            href={`https://www.facebook.com/sharer/sharer.php?u=sciquel.org`}
          >
            <Image
              src={facebookIcon}
              alt="share to facebook"
              width={40}
              height={40}
            />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=sciquel.org$}`}
            className={` flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#76a89f] py-1 transition ease-linear`}
            target="_blank"
          >
            <LinkedinIcon className="h-[40px] w-[40px]" />
            <span className="sr-only">Share to Linkedin</span>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=sciquel.org$`}
            className={` flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#76a89f] py-1 transition ease-linear`}
            target="_blank"
          >
            <Image src={xIcon} alt="share to x" width={40} height={40} />
          </a>
        </div>
        <div className="absolute top-[100%] z-10 mt-2 flex h-[70px] w-[250px] items-center gap-2 bg-white px-3 py-3 shadow-lg">
          <ClipboardIcon className="h-4/5 w-[40px]" />
          <div className="h-4/5 flex-1 rounded-full bg-[#76a89f]"> </div>
        </div>
      </div>
    </>
  );
};
export default ShareDropDown;
