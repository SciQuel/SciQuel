"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import facebookIcon from "../../../public/assets/images/story-facebook.png";
import instagramIcon from "../../../public/assets/images/story-ig.png";
import shareIcon from "../../../public/assets/images/story-share.png";

export default function ShareLinks() {
  const [showOptions, setShowOptions] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  function handleClick(e: MouseEvent) {
    if (popupRef.current) {
      if (!popupRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    }
  }

  return (
    <>
      <button
        className="h-fit w-fit rounded-full p-3 pointer-events-auto"
        
      >
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
      </button>
      <button className="h-fit w-fit rounded-full p-3 pointer-events-auto ">
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
      </button>
      <button className="h-fit w-fit rounded-full p-3 pointer-events-auto">
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
      </button>
      <button
        className="h-fit w-fit rounded-full p-3 pointer-events-auto"
        onClick={() => {
          setShowOptions(!showOptions);
        }}
      >
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
      </button>
    
      <div
        className={`${
          showOptions ? "  opacity-1" : " opacity-0"
    
        }  transition-opacity overflow-hidden  sm:w-fit sm:h-fit h-screen w-screen fixed left-0 sm:top-0 bottom-0   items-end sm:justify-center bg-neutral-800/75 sm:absolute sm:-ml-2 sm:mt-20 sm:items-start sm:bg-transparent xl:static xl:mt-3`}
      >
        <div
          ref={popupRef}
          className={ `${
          showOptions ? " max-h-[100vh] opacity-1" : "max-h-0 opacity-0"
    
        }  transition-[max-height] duration-500 sm:relative absolute bottom-0 flex w-screen flex-col pt-0 sm:pl-5 sm:pr-1 sm:before:absolute sm:before:left-52 sm:before:top-2 sm:before:z-[2] sm:before:ml-6 sm:before:h-8 sm:before:w-8 sm:before:rotate-45 sm:before:border-l-2 sm:before:border-t-2 sm:before:border-sciquelCardBorder sm:before:bg-sciquelCardBg  md:w-[720px] md:pl-0 md:pr-0 xl:w-fit xl:before:left-0 xl:before:ml-7`}
        >
          <div className={`relative xl:-left-4 w-full sm:rounded rounded-t sm:p-4`}>
            <div className={` pointer-events-auto mt-2 p-4 pb-2 xl:pb-4 border-2 rounded-t rounded-r border-sciquelCardBorder bg-sciquelCardBg`}>
              <input
                readOnly
                type="text"
                className="w-full border p-1 xl:w-96 mt-3 xl:mt-0"
                value={`sciquel.org${pathname}`}
                onClick={() => {
                  navigator.clipboard.writeText(`sciquel.org${pathname}`);
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`sciquel.org${pathname}`);
                }}
                className="mx-2 xl:my-2 mt-3 sm:mt-5 rounded-md bg-sciquelTeal p-1 text-lg font-semibold text-slate-50"
              >
                Copy Url
              </button>
            </div>
            <div className={` pointer-events-auto xl:before:rounded-tl  xl:before:border-t-2 xl:before:border-l-2 xl:before:border-sciquelCardBorder before:pointer-events-none xl:before:z-[2] xl:before:absolute xl:before:top-0 xl:before:-right-10 xl:before:h-10 xl:before:w-10  flex sm:rounded-b flex-row xl:flex-col xl:w-fit xl:p-2 md:p-1 border-x-2 sm:border-b-2 border-sciquelCardBorder bg-sciquelCardBg relative top-[-2px]`}>
              <a
                className={` h-fit w-fit rounded-full p-3`}
                target="_blank"
                href={`https://www.facebook.com/sharer/sharer.php?u=sciquel.org${pathname}`}
              >
                <Image
                  src={facebookIcon}
                  alt="share to facebook"
                  width={45}
                  height={45}
                />
              </a>
              <a
                href={`mailto:?subject=Check Out This Article&body=sciquel.org${pathname}`}
                className={` h-fit w-fit rounded-full p-3 transition ease-linear`}
                target="_blank"
              >
                <Image
                  src={instagramIcon}
                  alt="Email Article"
                  width={45}
                  height={45}
                />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=sciquel.org${pathname}`}
                className={` h-fit w-fit rounded-full p-3 transition ease-linear`}
                target="_blank"
              >
                <Image
                  src={instagramIcon}
                  alt="share to instagram"
                  width={45}
                  height={45}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
