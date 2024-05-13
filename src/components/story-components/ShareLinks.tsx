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
      <button
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
        {/* <p className="h-0 w-0 overflow-visible">
          {isBookmarked ? "un-book" : "book"}
        </p> */}
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
        {/*  bookmark login modal */}
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
      </div>

      <div
        onMouseLeave={() => {
          setShowOptions("none");
        }}
        onMouseEnter={() => {
          if (window.innerWidth > 640) {
            setShowOptions("share");
          }
        }}
        className={`pointer-events-auto absolute left-[4.25rem] flex h-fit w-fit flex-col md:left-[4.25rem] xl:left-[calc(100%_-_4.3rem)]  xl:top-[3.5rem]  xl:items-start `}
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
        <SocialMediaPopup show={showOptions == "share"} ref={popupRef} />{" "}
      </div>

      <button
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
        {/* <p className="h-0 w-0 overflow-visible">
          {isBrained ? "un-brain" : "Brain"}
        </p> */}
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
        {/* brain  login modal */}
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
          {/**/}
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

      <button
        type="button"
        className="pointer-events-auto h-fit w-fit rounded-full px-3  py-0.5 xl:mb-2"
        onClick={() => {
          if (toggleFunction) {
            window.scrollTo(0, 0);
            toggleFunction(!isPrintMode);
          }
        }}
      >
        <Image
          src={shareIcon}
          alt="switch to print-mode"
          width={45}
          height={45}
        />
      </button>

      <DictionaryButton observe={observe} />
    </>
  );
}
