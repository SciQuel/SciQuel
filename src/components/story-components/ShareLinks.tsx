import Image from "next/image";
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
          width={40}
          height={40}
        />
      </button>
      <button className="h-fit w-fit rounded-full p-3">
        <Image
          src={instagramIcon}
          alt="share to instagram"
          width={40}
          height={40}
        />
      </button>
      <button className="h-fit w-fit rounded-full p-3">
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={40}
          height={40}
        />
      </button>
    </>
  );
}
