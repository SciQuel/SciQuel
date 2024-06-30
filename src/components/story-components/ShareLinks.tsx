"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import DictionaryIcon from "../../../public/assets/images/book.svg";
import shareIcon from "../../../public/assets/images/story-share.png";
import DictionaryButton from "./dictionary/DictionaryButton";
import { DictionaryContext } from "./dictionary/DictionaryContext";
import { PrintContext, PrintToggleContext } from "./PrintContext";
import SocialMediaPopup from "./SocialMediaPopup";

type modalOptions = "none" | "brain-login" | "bookmark-login" | "share";

interface Props {
  storyId: string;
  observe: boolean;
}

const PrintModeIcon = () => (
  <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#76a89f]">
    <p className="sr-only">Switch to print mode</p>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 2V8H20"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 13H8"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 17H8"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 9H9H8"
        stroke="#F8F8FF"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
);

export default function ShareLinks({ storyId, observe }: Props) {
  const [showOptions, setShowOptions] = useState<modalOptions>("none");

  const [isBrained, setIsBrained] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const popupRef2 = useRef<HTMLDivElement>(null);
  const popupRef3 = useRef<HTMLDivElement>(null);

  const isPrintMode = useContext(PrintContext);
  const toggleFunction = useContext(PrintToggleContext);
  const { data: session, status } = useSession();

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    if (status == "authenticated") {
      getBookmark();
      getBrain();
    }
  }, [status]);

  async function getBookmark() {
    if (status == "authenticated" && session.user.email) {
      try {
        const bookmarkResponse = await axios.get("/api/user/bookmark", {
          params: {
            story_id: storyId,
            user_email: session.user.email,
          },
        });

        if (bookmarkResponse.status == 200) {
          setIsBookmarked(true);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status == 404) {
          setIsBookmarked(false);
          //not bookmarked
        } else {
          console.log("get bookmark error: ", err);
        }
      }
    }
  }

  async function getBrain() {
    if (status == "authenticated" && session.user.email) {
      try {
        const brainResponse = await axios.get("/api/user/brains", {
          params: {
            story_id: storyId,
            user_email: session.user.email,
          },
        });

        if (brainResponse.status == 200) {
          setIsBrained(true);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status == 404) {
          setIsBrained(false);
          //not brained
        } else {
          console.log("get brain error: ", err);
        }
      }
    }
  }

  function handleClick(e: MouseEvent) {
    let shouldShut = true;

    if (popupRef.current?.contains(e.target as Node)) {
      shouldShut = false;
    }

    if (popupRef2.current?.contains(e.target as Node)) {
      shouldShut = false;
    }

    if (shouldShut) {
      setShowOptions("none");
    }
  }

  async function handleBrain() {
    if (status != "authenticated") {
      setShowOptions("brain-login");
    } else if (session.user.email) {
      if (isBrained == false) {
        try {
          const response = await axios.post("/api/user/brains", {
            story_id: storyId,
            user_email: session.user.email,
          });

          if (response.status == 200) {
            setIsBrained(true);
          }
        } catch (err) {
          if (
            axios.isAxiosError(err) &&
            err.response?.data.error ==
              "story_id and user_id combination already exists"
          ) {
            setIsBrained(true);
          }
        }
      } else {
        // already brained, un-brain
        try {
          const response = await axios.delete("/api/user/brains", {
            params: {
              story_id: storyId,
              user_email: session.user.email,
            },
          });
          if (response.status == 200) {
            setIsBrained(false);
          }
        } catch (err) {
          if (
            axios.isAxiosError(err) &&
            err.response?.data.error == "No entries found"
          ) {
            setIsBrained(false);
          }
        }
      }
    }
  }

  async function handleBookmark() {
    if (status != "authenticated") {
      setShowOptions("bookmark-login");
    } else if (session.user.email) {
      console.log(session.user.email);

      if (isBookmarked == false) {
        try {
          const response = await axios.post("/api/user/bookmark", {
            story_id: storyId,
            user_email: session.user.email,
          });

          if (response.status == 200) {
            setIsBookmarked(true);
          }
        } catch (err) {
          if (
            axios.isAxiosError(err) &&
            err.response?.data.error ==
              "story_id and user_id combination already exists"
          ) {
            setIsBookmarked(true);
          }
        }
      } else {
        //already booked, un-book
        try {
          const response = await axios.delete("/api/user/bookmark", {
            params: {
              story_id: storyId,
              user_email: session.user.email,
            },
          });
          if (response.status == 200) {
            setIsBookmarked(false);
          }
        } catch (err) {
          if (
            axios.isAxiosError(err) &&
            err.response?.data.error == "No entries found"
          ) {
            setIsBookmarked(false);
          }
        }
      }
    }
  }

  return (
    <>
      {/* <button
        type="button"
        onClick={handleBookmark}
        className="pointer-events-auto h-fit w-fit rounded-full px-0 py-0.5 pr-3 xl:mb-2 xl:px-3"
      >
        <Image
          src={shareIcon}
          alt={
            isBookmarked
              ? "remove bookmark from this article"
              : "bookmark this article"
          }
          width={45}
          height={45}
        />
         <p className="h-0 w-0 overflow-visible">
          {isBookmarked ? "un-book" : "book"}
        </p>  
      </button>
      <div
        className={
          `${
            showOptions == "bookmark-login"
              ? "opacity-1 pointer-events-auto"
              : "opacity-0 sm:-translate-y-2"
          }  fixed bottom-0 left-0 z-10 h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all sm:absolute sm:top-16 sm:mt-3 sm:h-auto sm:min-h-fit sm:overflow-visible sm:bg-transparent` +
          ` xl:left-[100%] xl:top-[calc(100vh_+_6.25rem)] xl:mt-0 xl:h-fit xl:w-fit`
        }
      >
          bookmark login modal  
        <div
          ref={popupRef3}
          className={
            (showOptions == "bookmark-login" ? " sm:before:left-16 " : "") +
            `absolute bottom-0 h-fit w-screen rounded-t border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg px-5 py-5 ` +
            `sm:relative sm:ml-3 sm:mt-3 sm:w-fit sm:rounded sm:border-2` +
            ` sm:before:absolute sm:before:-top-4 sm:before:left-36 sm:before:z-[2] sm:before:h-7 sm:before:w-7 sm:before:rotate-45 sm:before:border-l-2 sm:before:border-t-2 sm:before:border-sciquelCardBorder sm:before:bg-sciquelCardBg` +
            ` xl:-bottom-5 xl:left-2 xl:before:-left-7 xl:before:top-1/2  xl:before:ml-[0.9rem] xl:before:h-6 xl:before:w-6 xl:before:-translate-y-1/2 xl:before:-rotate-45 `
          }
        >
          <p className="w-full text-center text-lg sm:w-max">
            <a
              href="#"
              onClick={() => signIn()}
              className=" text-xl font-bold underline"
              tabIndex={showOptions == "bookmark-login" ? 0 : -1}
            >
              login
            </a>{" "}
            to bookmark this article
          </p>
        </div>
      </div> */}

      <div
        onMouseLeave={() => {
          setShowOptions("none");
        }}
        onMouseEnter={() => {
          if (window.innerWidth > 640) {
            setShowOptions("share");
          }
        }}
        className={`pointer-events-auto absolute left-[4rem] flex h-fit w-fit flex-col  xl:left-[calc(100%_-_4.3rem)]  xl:top-[3.5rem]  xl:items-start `}
      >
        <button
          type="button"
          aria-haspopup={true}
          aria-expanded={showOptions == "share"}
          className="pointer-events-auto h-fit w-fit rounded-full py-0.5 pr-3 xl:ml-0 xl:pr-0"
          onClick={() => {
            if (showOptions == "share") {
              setShowOptions("none");
            } else {
              setShowOptions("share");
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
        <div className="ml-[0.25rem]">
          <SocialMediaPopup show={showOptions == "share"} ref={popupRef} />
        </div>
      </div>

      {/* <button
        type="button"
        onClick={handleBrain}
        className="pointer-events-auto ml-[4.2rem] h-fit w-fit rounded-full px-3 py-0.5   xl:mb-2 xl:ml-0  xl:mt-[3.4rem]"
      >
        <Image
          src={shareIcon}
          alt={
            isBrained ? "remove brain from this article" : "brain this article"
          }
          width={45}
          height={45}
        />
        
      </button>
      <div
        className={
          `${
            showOptions == "brain-login"
              ? "opacity-1 pointer-events-auto"
              : "opacity-0 sm:-translate-y-2"
          }  fixed bottom-0 left-0 z-10 h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all sm:absolute sm:top-16 sm:mt-3 sm:h-auto sm:min-h-fit sm:overflow-visible sm:bg-transparent` +
          ` xl:left-[100%] xl:top-[calc(100vh_+_0.5rem)] xl:mt-0 xl:h-fit xl:w-fit`
        }
      >
        brain  login modal 
        <div
          ref={popupRef2}
          className={
            (showOptions == "brain-login" ? " sm:before:left-16 " : "") +
            `absolute bottom-0 h-fit w-screen rounded-t border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg px-5 py-5 ` +
            `sm:relative sm:ml-3 sm:mt-3 sm:w-fit sm:rounded sm:border-2` +
            ` sm:before:absolute sm:before:-top-4 sm:before:left-[4.75rem] sm:before:z-[2] sm:before:ml-0 sm:before:h-7 sm:before:w-7 sm:before:rotate-45 sm:before:border-l-2 sm:before:border-t-2 sm:before:border-sciquelCardBorder sm:before:bg-sciquelCardBg` +
            ` xl:-bottom-5 xl:left-2 xl:before:-left-7 xl:before:top-1/2  xl:before:ml-[0.9rem] xl:before:h-6 xl:before:w-6 xl:before:-translate-y-1/2 xl:before:-rotate-45 `
          }
        >
          
          <p className="w-full text-center text-lg sm:w-max">
            <a
              href="#"
              onClick={() => signIn()}
              className=" text-xl font-bold underline"
              tabIndex={showOptions == "brain-login" ? 0 : -1}
            >
              login
            </a>{" "}
            to brain this article
          </p>
        </div>
      </div>
       */}

      <button
        type="button"
        className="pointer-events-auto h-fit w-fit rounded-full py-0.5  xl:mb-2 xl:px-3"
        onClick={() => {
          if (toggleFunction) {
            window.scrollTo(0, 0);
            toggleFunction(!isPrintMode);
          }
        }}
      >
        <PrintModeIcon />
      </button>

      {/* <DictionaryButton observe={observe} /> */}
    </>
  );
}
