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
      <button className="h-fit w-fit rounded-full p-3 pointer-events-auto">
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
          showOptions ? "pointer-events-auto" : "pointer-events-none opacity-0"
        } fixed left-0  top-0 flex  h-screen w-screen items-end justify-center bg-neutral-800/75 transition ease-linear sm:absolute sm:-ml-2 sm:mt-20 sm:h-fit sm:w-fit sm:items-center sm:bg-transparent xl:static xl:mt-3`}
      >
        <div
          ref={popupRef}
          className={`${
            showOptions ? "" : "translate-y-full sm:translate-y-6"
          } relative flex w-screen flex-col pt-4 transition-transform sm:pl-5 sm:pr-1 sm:before:absolute sm:before:left-52 sm:before:top-0 sm:before:z-10 sm:before:ml-6 sm:before:h-8 sm:before:w-8 sm:before:rotate-45 sm:before:border-l-2 sm:before:border-t-2 sm:before:border-sciquelCardBorder sm:before:bg-sciquelCardBg  md:w-[720px] md:pl-0 md:pr-0 xl:w-fit xl:before:left-0 xl:before:ml-7`}
        >
          <div className="relative h-full w-full sm:rounded rounded-t border-2 border-sciquelCardBorder bg-sciquelCardBg p-4">
            <div className="my-2">
              <input
                readOnly
                type="text"
                className="w-full border p-1 xl:w-96"
                value={`sciquel.org${pathname}`}
                onClick={() => {
                  navigator.clipboard.writeText(`sciquel.org${pathname}`);
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`sciquel.org${pathname}`);
                }}
                className="m-2 rounded-md bg-sciquelTeal p-1 text-lg font-semibold text-slate-50"
              >
                Copy Url
              </button>
            </div>
            <div className="flex flex-row xl:flex-col">
              <a
                className={`${
                  showOptions ? "" : "pointer-events-none opacity-0"
                } h-fit w-fit rounded-full p-3 transition ease-linear`}
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
                className={`${
                  showOptions ? "" : "pointer-events-none opacity-0"
                } h-fit w-fit rounded-full p-3 transition ease-linear`}
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
                className={`${
                  showOptions ? "" : "pointer-events-none opacity-0"
                }  h-fit w-fit rounded-full p-3 transition ease-linear`}
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
