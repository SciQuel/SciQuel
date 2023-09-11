"use client";

import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import facebookIcon from "../../../public/assets/images/story-facebook.png";
import instagramIcon from "../../../public/assets/images/story-ig.png";
import shareIcon from "../../../public/assets/images/story-share.png";
import { PrintContext, PrintToggleContext } from "./PrintContext";

type modalOptions = "none" | "brain-login" | "bookmark-login" | "share";

interface Props {
  storyId: string;
}

export default function ShareLinks({ storyId }: Props) {
  const [showOptions, setShowOptions] = useState<modalOptions>("none");
  const [optionText, setOptionText] = useState<" bookmark " | " brain ">(
    " bookmark ",
  );
  const [isBrained, setIsBrained] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const popupRef2 = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
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
      setOptionText(" brain ");
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
      setOptionText(" bookmark ");
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
      <button
        onClick={handleBrain}
        className="pointer-events-auto h-fit w-fit rounded-full p-3 "
      >
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
        <p>{isBrained ? "un-brain" : "Brain"}</p>
      </button>
      <button
        onClick={handleBookmark}
        className="pointer-events-auto h-fit w-fit rounded-full p-3"
      >
        <Image
          src={shareIcon}
          alt="share to a link to this story"
          width={45}
          height={45}
        />
        <p>{isBookmarked ? "un-book" : "book"}</p>
      </button>
      <button
        className="pointer-events-auto h-fit w-fit rounded-full p-3"
        onClick={() => {
          setShowOptions("share");
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
          showOptions == "brain-login" || showOptions == "bookmark-login"
            ? "opacity-1 pointer-events-auto"
            : "opacity-0 sm:-translate-y-2"
        }  fixed bottom-0 left-0 h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all sm:absolute sm:top-16 sm:mt-3 sm:h-auto sm:min-h-fit sm:overflow-visible sm:bg-transparent`}
      >
        {/* brain / bookmark login modal */}
        <div
          ref={popupRef2}
          className={
            (showOptions == "brain-login"
              ? " sm:before:left-16 xl:-top-1 "
              : "") +
            (showOptions == "bookmark-login"
              ? " sm:before:right-28 xl:top-20 xl:mt-[1.1rem] "
              : "") +
            `absolute bottom-0 h-fit w-screen rounded-t border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg px-5 py-5 sm:relative sm:ml-2 sm:mt-3 sm:w-fit sm:rounded sm:border-2 sm:before:absolute sm:before:-top-4 sm:before:z-[2] sm:before:ml-4 sm:before:h-7 sm:before:w-7 sm:before:rotate-45 sm:before:border-l-2 sm:before:border-t-2 sm:before:border-sciquelCardBorder sm:before:bg-sciquelCardBg xl:left-24 xl:before:-left-7 xl:before:top-1/2 xl:before:ml-[0.9rem]  xl:before:h-6 xl:before:w-6 xl:before:-translate-y-1/2 xl:before:-rotate-45`
          }
        >
          {/**/}
          <p className="text-center text-lg">
            <a
              href="#"
              onClick={() => signIn()}
              className=" text-xl font-bold underline"
            >
              login
            </a>{" "}
            to {optionText} this article
          </p>
        </div>
      </div>

      <div
        className={`${
          showOptions == "share" ? "opacity-1" : "opacity-0 sm:-translate-y-2"
        }  fixed bottom-0  left-0 h-screen w-screen items-end overflow-hidden bg-neutral-800/75 transition-all sm:absolute   sm:top-0 sm:-ml-2 sm:mt-20 sm:h-fit sm:w-fit sm:items-start sm:justify-center sm:bg-transparent xl:static xl:mt-3`}
      >
        <div
          ref={popupRef}
          className={`${
            showOptions == "share"
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
              className={`pointer-events-auto m-0 mt-2 rounded-t border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg p-4 pb-2 lg:h-fit xl:mx-3 xl:mt-7 xl:rounded xl:border-2 xl:p-3`}
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
