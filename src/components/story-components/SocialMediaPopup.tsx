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
import FacebookIcon from "../../../public/assets/images/facebook-icon.svg";
import LinkedinIcon from "../../../public/assets/images/linkedin.svg";
import ShareIcon from "../../../public/assets/images/share.svg";
import XIcon from "../../../public/assets/images/x-logo.svg";

interface Props {
  show: boolean;
}

interface CopiedAction {
  type: "show" | "hide";
}

const SocialMediaPopup = forwardRef(
  ({ show }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const [showFull, setShowFull] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const fullUrl = `sciquel.org${pathname}`;

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [playTimerBar, setPlayTimerBar] = useState(false);
    
    const [justCopied, dispatchJustCopied] = useReducer(
      (state: boolean, action: CopiedAction) => {
        switch (action.type) {
          case "show":
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => dispatchJustCopied({ type: "hide" }), 2000);
            setTimeout(() => setPlayTimerBar(true), 100);
            return true;
          case "hide":
            setPlayTimerBar(false);
            return false;
          default:
            return state;
        }
      },
      false
    );

    const handleCopy = () => {
      navigator.clipboard.writeText(fullUrl).catch(console.error);
      dispatchJustCopied({ type: "show" });
    };

    const buttons = [
      {
        id: "share",
        label: "Toggle share options",
        icon: <ShareIcon className="h-[45px] w-[45px] rounded-full bg-[#76a89f]" />,
        onClick: () => {
          if (!showFull && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
          }
          setShowFull(!showFull);
        },
        isButton: true,
      },
      {
        id: "email",
        label: "email this article",
        href: `mailto:?subject=Check Out This Article&body=${fullUrl}`,
        icon: <MailIcon className="h-[17px] w-[25px] object-contain" />,
      },
      {
        id: "facebook",
        label: "share to facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`,
        icon: <FacebookIcon className="h-[25px] w-[25px] object-contain" />,
      },
      {
        id: "linkedin",
        label: "share to Linkedin",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`,
        icon: <LinkedinIcon className="h-[25px] w-[25px] object-contain" />,
      },
      {
        id: "x",
        label: "share to x",
        href: `https://twitter.com/intent/tweet?text=${fullUrl}`,
        icon: <XIcon className="h-[25px] w-[25px] object-contain" />,
      },
    ];

    const btnClass = "z-20 mx-3 my-1 flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#76a89f] py-1 transition ease-linear";

    return (
      <>
        <div
          className={`fixed bottom-0 left-0 z-[19] h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all sm:static sm:top-0 sm:ml-[-4.75rem] sm:mt-2 sm:h-fit sm:w-fit sm:items-start sm:justify-center sm:bg-transparent xl:-mt-20 xl:ml-0 xl:w-fit xl:px-8 ${
            show ? "opacity-100" : "max-h-0 max-w-0 opacity-0 sm:-translate-y-2"
          }`}
        >
          <div
            ref={ref}
            className={`absolute bottom-0 z-[19] flex w-screen flex-col pt-0 transition-transform duration-500 sm:relative sm:px-0 md:w-[768px] md:pl-0 md:pr-0 xl:relative xl:h-fit xl:w-fit ${
              show ? "translate-y-0" : "max-h-0 translate-y-full opacity-0 sm:-translate-y-0"
            }`}
          >
            {/* Arrow */}
            <div className="z-20 sm:absolute sm:left-20 sm:top-1 sm:z-[2] sm:ml-1 sm:h-6 sm:w-6 sm:rotate-45 sm:rounded-tl sm:border-l-2 sm:border-t-2 sm:border-sciquelCardBorder sm:bg-sciquelCardBg xl:left-0 xl:top-10 xl:ml-[1.3rem] xl:h-7 xl:w-7 xl:rounded-bl xl:rounded-tl-none xl:border-b-2 xl:border-t-0" />

            <div className="relative flex w-full flex-col-reverse sm:p-2 xl:left-8 xl:flex-row xl:px-0 xl:py-3">
              {/* Buttons Container */}
              <div className="pointer-events-auto relative m-0 flex flex-row flex-wrap border-x-2 border-sciquelCardBorder bg-sciquelCardBg px-1 py-1 pb-4 sm:flex-nowrap sm:rounded-b-xl sm:border-b-2 sm:pb-2 lg:h-fit xl:top-2 xl:w-max xl:flex-col xl:gap-1 xl:rounded-xl xl:border-2 xl:px-0 xl:pt-2">
                {buttons.map((btn) => (
                  btn.isButton ? (
                    <button
                      key={btn.id}
                      type="button"
                      aria-haspopup={true}
                      aria-expanded={showFull}
                      tabIndex={show ? 0 : -1}
                      onClick={btn.onClick}
                      className={btnClass}
                    >
                      {btn.icon}
                      <span className="sr-only">{btn.label}</span>
                    </button>
                  ) : (
                    <a
                      key={btn.id}
                      href={btn.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={show ? 0 : -1}
                      className={btnClass}
                    >
                      {btn.icon}
                      <span className="sr-only">{btn.label}</span>
                    </a>
                  )
                ))}
              </div>

              {/* URL Copy Section */}
              <div
                className={`m-0 mt-2 flex flex-row justify-center rounded-t-xl border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg transition-all lg:h-fit xl:rounded-xl xl:border-2 ${
                  showFull
                    ? "pointer-events-auto p-4 pb-2 xl:mx-3 xl:mt-2 xl:p-3"
                    : show
                    ? "pointer-events-auto p-4 pb-2 xl:pointer-events-none xl:w-0 xl:-translate-x-3 xl:p-0 xl:opacity-0"
                    : "w-0 -translate-x-3 p-0 opacity-0"
                }`}
              >
                <button
                  type="button"
                  tabIndex={show ? 0 : -1}
                  onClick={handleCopy}
                  className={`${!showFull ? "xl:hidden" : ""} me-3 flex items-center justify-center`}
                >
                  <ClipboardIcon className="m-0 h-11 w-11 p-0" />
                  <span className="sr-only">copy story URL to clipboard</span>
                </button>
                <input
                  tabIndex={show ? 0 : -1}
                  ref={inputRef}
                  readOnly
                  type="text"
                  value={fullUrl}
                  onClick={handleCopy}
                  className={`${!showFull ? "xl:hidden" : ""} w-full rounded-lg border p-1 xl:mt-0 xl:w-96`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Success Toast */}
        <div
          className={`fixed bottom-0 right-0 m-3 mb-44 rounded-md border-2 border-sciquelCardBorder bg-sciquelCardBg px-3 py-2 font-semibold text-zinc-400 transition-opacity after:absolute after:bottom-0 after:left-0 after:z-50 after:h-1 sm:mb-3 ${
            playTimerBar ? "after:w-0 after:animate-[shrink_1900ms_linear] after:bg-sciquelTeal" : "after:w-full"
          } ${justCopied ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          Copied to Clipboard
        </div>
      </>
    );
  }
);

export default SocialMediaPopup;
