"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  forwardRef,
  useReducer,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import facebookIcon from "../../../public/assets/images/story-facebook.png";
import instagramIcon from "../../../public/assets/images/story-ig.png";
import shareIcon from "../../../public/assets/images/story-share.png";

interface Props {
  show: boolean;
}

interface CopiedAction {
  type: "show" | "hide" | "restart";
}

const SocialMediaPopup = forwardRef(
  ({ show }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const [showFull, setShowFull] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [playTimerBar, setPlayTimerBar] = useState(false);
    const [justCopied, dispatchJustCopied] = useReducer(
      (state: boolean, action: CopiedAction) => {
        switch (action.type) {
          case "show":
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
              setPlayTimerBar(false);
            }
            timerRef.current = setTimeout(() => {
              dispatchJustCopied({ type: "hide" });
            }, 2000);

            setTimeout(() => {
              setPlayTimerBar(true);
            }, 100);

            return true;

          case "hide":
            setPlayTimerBar(false);
            return false;

          case "restart":

          default:
            throw Error("unknown action type in justCopied reducer");
        }
      },
      false,
    );

    return (
      <>
        <div
          className={`
    ${show ? "opacity-1" : "max-h-0 max-w-0 opacity-0 sm:-translate-y-2"}  
    fixed bottom-0  left-0 h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all sm:absolute   sm:top-0 sm:-ml-2 sm:mt-20 sm:h-fit sm:w-fit sm:items-start sm:justify-center sm:bg-transparent xl:relative xl:mt-3`}
        >
          <div
            ref={ref}
            className={`${
              show
                ? "translate-y-0"
                : "max-h-0 translate-y-full opacity-0 sm:-translate-y-0"
            }  absolute bottom-0 flex w-screen flex-col pt-0 transition-transform duration-500 sm:relative sm:pl-5 sm:pr-1 sm:before:absolute sm:before:left-52 sm:before:top-2 sm:before:z-[2] sm:before:ml-6 sm:before:h-8 sm:before:w-8 sm:before:rotate-45 sm:before:border-l-2 sm:before:border-t-2 sm:before:border-sciquelCardBorder sm:before:bg-sciquelCardBg  md:w-[720px] md:pl-0 md:pr-0 xl:relative xl:w-fit xl:before:left-0 xl:before:ml-7`}
          >
            <div
              className={`relative flex w-full flex-col-reverse sm:p-4 xl:-left-4 xl:flex-row`}
            >
              {/* button + side-popout container */}
              <div
                className={`pointer-events-auto relative m-0 flex flex-row border-x-2 border-sciquelCardBorder bg-sciquelCardBg pb-4 sm:rounded-b sm:border-b-2 sm:pb-2 md:px-1 lg:h-fit xl:top-2 xl:w-fit  xl:flex-col xl:rounded xl:border-t-2 xl:px-2 xl:py-4`}
              >
                {/*  before:pointer-events-none */}
                {/* buttons container */}
                <button
                  type="button"
                  aria-haspopup={true}
                  aria-expanded={showFull}
                  onClick={() => {
                    if (showFull) {
                      setShowFull(false);
                    } else {
                      if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.select();
                      }

                      setShowFull(true);
                    }
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
                className={`${
                  showFull
                    ? " pointer-events-auto p-4 pb-2  xl:p-3"
                    : show
                    ? "pointer-events-auto p-4 pb-2 xl:pointer-events-none xl:w-0 xl:-translate-x-3 xl:p-0 xl:opacity-0"
                    : "w-0 -translate-x-3 p-0 opacity-0"
                } m-0 mt-2 rounded-t border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg transition-all lg:h-fit xl:mx-3 xl:mt-7 xl:rounded xl:border-2`}
              >
                {/* floating input for copying link */}
                <input
                  ref={inputRef}
                  readOnly
                  type="text"
                  className="mt-3 w-full border p-1 xl:mt-0 xl:w-96"
                  value={`sciquel.org${pathname}`}
                  onClick={() => {
                    navigator.clipboard.writeText(`sciquel.org${pathname}`);
                    dispatchJustCopied({ type: "show" });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${
            playTimerBar
              ? "after:w-0 after:animate-[shrink_1900ms_linear] after:bg-sciquelTeal"
              : //  after:duration-[2000ms]
                "after:w-full"
            //  after:duration-0
          } ${
            justCopied ? "" : "opacity-0"
          }  fixed bottom-0 right-0 m-3 mb-44 rounded-md border-2 border-sciquelCardBorder bg-sciquelCardBg px-3 py-2 font-semibold text-zinc-400 transition-opacity after:absolute after:bottom-0 after:left-0 after:z-50 after:h-1 sm:mb-3`}
          // after:transition-[width] after:ease-linear
        >
          {/* "copied to clipboard" modal */}
          Copied to Clipboard
        </div>
      </>
    );
  },
);

export default SocialMediaPopup;
