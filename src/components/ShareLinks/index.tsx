import Image from "next/image";
import bookmarkIcon from "../../../public/assets/images/bookmark.png";
import facebookIcon from "../../../public/assets/images/story-facebook.png";
import instagramIcon from "../../../public/assets/images/story-ig.png";
import shareIcon from "../../../public/assets/images/story-share.png";

export default function ShareLinks() {
  return (
    <>
      <button className="h-fit w-fit rounded-full p-3">
        <Image
          src={facebookIcon}
          alt="share to facebook"
          width={50}
          height={50}
        />
      </button>
      <button className="h-fit w-fit rounded-full p-3">
        <Image
          src={instagramIcon}
          alt="share to instagram"
          width={50}
          height={50}
        />
      </button>
      <button className="h-fit w-fit rounded-full p-3">
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={50}
          height={50}
        />
      </button>
    </>
  );
}
