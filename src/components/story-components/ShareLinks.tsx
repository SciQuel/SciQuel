"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import facebookIcon from "../../../public/assets/images/story-facebook.png";
import instagramIcon from "../../../public/assets/images/story-ig.png";
import shareIcon from "../../../public/assets/images/story-share.png";
import { PrintContext, PrintToggleContext } from "./PrintContext";

export default function ShareLinks() {
  const [showOptions, setShowOptions] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isPrintMode = useContext(PrintContext);
  const toggleFunction = useContext(PrintToggleContext);

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
        className="pointer-events-auto h-fit w-fit rounded-full p-3"
        onClick={() => {
          if (toggleFunction) {
            toggleFunction(!isPrintMode);
          }
        }}
      >
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
      </button>
      <button className="pointer-events-auto h-fit w-fit rounded-full p-3 ">
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
      </button>
      <button className="pointer-events-auto h-fit w-fit rounded-full p-3">
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
      </button>
      <button
        className="pointer-events-auto h-fit w-fit rounded-full p-3"
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
          showOptions ? "  opacity-1" : "opacity-0 sm:-translate-y-2"
        }  fixed bottom-0  left-0 h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all sm:absolute   sm:top-0 sm:-ml-2 sm:mt-20 sm:h-fit sm:w-fit sm:items-start sm:justify-center sm:bg-transparent xl:static xl:mt-3`}
      >
        <div
          ref={popupRef}
          className={`${
            showOptions
              ? "translate-y-0"
              : "max-h-0 translate-y-full opacity-0 sm:-translate-y-0"
          }  absolute bottom-0 flex w-screen flex-col pt-0 transition-transform duration-500 sm:relative sm:pl-5 sm:pr-1 sm:before:absolute sm:before:left-52 sm:before:top-2 sm:before:z-[2] sm:before:ml-6 sm:before:h-8 sm:before:w-8 sm:before:rotate-45 sm:before:border-l-2 sm:before:border-t-2 sm:before:border-sciquelCardBorder sm:before:bg-sciquelCardBg  md:w-[720px] md:pl-0 md:pr-0 xl:w-fit xl:before:left-0 xl:before:ml-7`}
        >
          <div
            className={`relative flex w-full flex-col-reverse sm:p-4 xl:-left-4 xl:flex-row`}
          >
            {/* button + side-popout container */}
            <div
              className={`pointer-events-auto relative m-0 flex flex-row border-x-2 border-sciquelCardBorder bg-sciquelCardBg pb-4 before:pointer-events-none sm:rounded-b sm:border-b-2 sm:pb-2 md:px-1 lg:h-fit xl:top-2 xl:w-fit  xl:flex-col xl:rounded xl:border-t-2 xl:px-2 xl:py-4`}
            >
              {/* buttons container */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`sciquel.org${pathname}`);
                }}
                className={` h-fit w-fit rounded-full p-3`}
              >
                <Image
                  src={shareIcon}
                  alt="share to a link to this story"
                  width={45}
                  height={45}
                />
              </button>
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
            <div
              className={`pointer-events-auto m-0 mt-2 rounded-t border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg p-4 pb-2 lg:h-fit xl:mx-3 xl:rounded xl:border-2 xl:pb-4`}
            >
              {/* floating input for copying link */}
              <input
                readOnly
                type="text"
                className="mt-3 w-full border p-1 xl:mt-0 xl:w-96"
                value={`sciquel.org${pathname}`}
                onClick={() => {
                  navigator.clipboard.writeText(`sciquel.org${pathname}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
