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
import ClipboardIcon from "../../../public/assets/images/clipboard.svg";
import MailIcon from "../../../public/assets/images/email.svg";
import LinkedinIcon from "../../../public/assets/images/linkedin.svg";
import facebookIcon from "../../../public/assets/images/story-facebook.png";
import shareIcon from "../../../public/assets/images/story-share.png";
import xIcon from "../../../public/assets/images/xicon.png";

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
          className={
            `
    ${show ? "opacity-1" : "max-h-0 max-w-0 opacity-0 sm:-translate-y-2"}  
    fixed bottom-0 left-0 z-[19] h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all` +
            ` sm:static sm:top-0 sm:ml-[-4.75rem] sm:mt-2 sm:h-fit sm:w-fit sm:items-start sm:justify-center sm:bg-transparent` +
            ` xl:-mt-20 xl:ml-8 xl:w-fit xl:px-8`
          }
        >
          <div
            ref={ref}
            className={
              `${
                show
                  ? "translate-y-0"
                  : "max-h-0 translate-y-full opacity-0 sm:-translate-y-0"
              }  absolute bottom-0 z-[19] flex w-screen flex-col pt-0 transition-transform duration-500 ` +
              ` sm:relative sm:px-0 md:w-[768px] md:pl-0 md:pr-0 xl:relative  xl:h-fit xl:w-fit `
            }
          >
            <div className="z-20 sm:absolute sm:left-20 sm:top-1 sm:z-[2] sm:ml-1 sm:h-6  sm:w-6 sm:rotate-45 sm:rounded-tl sm:border-l-2 sm:border-t-2 sm:border-sciquelCardBorder sm:bg-sciquelCardBg xl:left-0 xl:top-10 xl:ml-[1.3rem] xl:h-7 xl:w-7 xl:rounded-bl xl:rounded-tl-none xl:border-b-2 xl:border-t-0">
              {/* this is the arrow, created from a rotated div */}
            </div>
            <div
              className={`relative flex w-full flex-col-reverse sm:p-2 xl:left-8 xl:flex-row xl:px-0 xl:py-2`}
            >
              {/* button + side-popout container */}
              <div
                className={`pointer-events-auto  relative m-0 flex flex-row border-x-2 border-sciquelCardBorder bg-sciquelCardBg py-1 pb-4 sm:rounded-b-xl sm:border-b-2 sm:pb-2 md:px-1 lg:h-fit xl:top-2 xl:w-max xl:flex-col xl:gap-1 xl:rounded-xl xl:border-2 xl:px-0 xl:pt-2`}
              >
                {/* buttons container */}
                <button
                  type="button"
                  aria-haspopup={true}
                  aria-expanded={showFull}
                  tabIndex={show ? 0 : -1}
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
                  className={`relative z-30 h-fit w-fit rounded-full px-3 py-1`}
                >
                  <Image
                    src={shareIcon}
                    alt="share a link to this story"
                    width={45}
                    height={45}
                  />
                </button>
                <a
                  tabIndex={show ? 0 : -1}
                  href={`mailto:?subject=Check Out This Article&body=sciquel.org${pathname}`}
                  className={`mx-3 my-1 flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#76a89f] py-1 transition ease-linear`}
                  target="_blank"
                >
                  <MailIcon className="h-[17px] w-[25px] object-contain" />
                  <span className="sr-only">email this article</span>
                </a>
                <a
                  className={` h-fit w-fit rounded-full px-3 py-1`}
                  tabIndex={show ? 0 : -1}
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
                  tabIndex={show ? 0 : -1}
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=sciquel.org${pathname}`}
                  className={`mx-3 my-1 flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#76a89f] py-1 transition ease-linear`}
                  target="_blank"
                >
                  <LinkedinIcon className="h-[25px] w-[25px] object-contain" />
                  <span className="sr-only">Share to Linkedin</span>
                </a>
                <a
                  tabIndex={show ? 0 : -1}
                  href={`https://twitter.com/intent/tweet?text=sciquel.org${pathname}`}
                  className={`mx-3 my-1 flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#76a89f] py-1 transition ease-linear`}
                  target="_blank"
                >
                  <Image src={xIcon} alt="share to x" width={20} height={25} />
                </a>
              </div>
              <div
                className={`${
                  showFull
                    ? " pointer-events-auto p-4 pb-2 xl:mx-3 xl:mt-2  xl:p-3"
                    : show
                    ? "pointer-events-auto p-4 pb-2 xl:pointer-events-none   xl:w-0 xl:-translate-x-3 xl:p-0 xl:opacity-0"
                    : "w-0 -translate-x-3 p-0 opacity-0"
                } m-0 mt-2 flex flex-row  justify-center rounded-t-xl border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg transition-all lg:h-fit xl:rounded-xl xl:border-2`}
              >
                {/* floating input for copying link */}
                <button
                  type="button"
                  tabIndex={show ? 0 : -1}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`sciquel.org${pathname}`)
                      .then()
                      .catch((err) => {
                        console.error(err);
                      });
                    dispatchJustCopied({ type: "show" });
                  }}
                  className={`${
                    !showFull ? "xl:hidden" : ""
                  } me-3 flex  items-center justify-center`}
                >
                  <ClipboardIcon className={"m-0 h-11 w-11 p-0"} />
                  <span className="sr-only">copy story URL to clipboard</span>
                </button>
                <input
                  tabIndex={show ? 0 : -1}
                  ref={inputRef}
                  readOnly
                  type="text"
                  className={`${
                    !showFull ? "xl:hidden " : ""
                  } w-full rounded-lg border p-1 xl:mt-0 xl:w-96`}
                  value={`sciquel.org${pathname}`}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`sciquel.org${pathname}`)
                      .then()
                      .catch((err) => {
                        console.error(err);
                      });
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
            justCopied ? "" : "pointer-events-none opacity-0"
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
