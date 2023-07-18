"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import logo from "./logo.png";
import Search from "./search.svg";
import SideBar from "./SideBar/SideBar";
import Topic from "./Topic/Topic";

export default function Header() {
  const session = useSession();
  const [scroll, setScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [y, setY] = useState(0);
  const [counter, setCounter] = useState(0);
  const router = useRouter();
  const handleNavigation = useCallback(
    (e: Event) => {
      const window = e.currentTarget as Window;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (window.location.pathname.split("/")[1] === "stories") {
        /**
         * y > window.scrollY : last saved Y > current scrollY means scrolling up
         * window.scrollY > 800(height of imag): scrolling event only apply after 800(heigh of imag )
         * window.scrollY == 0 : if scroll Y  = 0 means hit the top apply the scroll up.
         */
        if (y > window.scrollY && window.scrollY > 650) {
          // console.log("scrolling up");

          /**
           * Safari case
           * if Y greather maxY( whole page ) set as scrolling down style
           */
          if (y > maxY) {
            // console.log("scrolling down");
            setScroll(true);
          } else if (window.scrollY - y > 50 || window.scrollY - y < -50) {
            setScroll(false);
          }
        } else {
          /**
           * Safari case
           * if Y is less than equal to 0 (top of page)  set as scrolling up style
           * else
           * regular case scrolling down style
           */
          if (window.scrollY <= 10) {
            if (window.scrollY > 2) {
              setCounter(0);
              setScroll(true);
            } else if (window.scrollY <= 0) {
              window.scrollTo(0, 1);
              if (counter >= 20) {
                setScroll(false);
              } else {
                setCounter(counter + 1);
              }
            }
          } else {
            setScroll(true);
          }
        }
      } else {
        if (y > window.scrollY) {
          if (y > maxY) {
            // console.log("scrolling down");
            setScroll(true);
          } else if (
            window.scrollY - y > 50 ||
            window.scrollY - y < -50 ||
            window.scrollY === 0
          ) {
            // console.log("scrolling up");
            setScroll(false);
          }
        } else if (y < window.scrollY) {
          if (window.scrollY <= 0) {
            // console.log("scrolling up");
            setScroll(false);
          } else {
            // console.log("scrolling down");
            setScroll(true);
          }
        }
      }
      if (window.scrollY - y > 50 || window.scrollY - y < -50) {
        setY(window.scrollY);
      }
    },
    [counter, y],
  );
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
    console.log("current query ", encodedSearchQuery);
  };
  /** useEffect tell React that your component needs to do something after render.
   * EventListener for function handleNavigation
   * and clean up after it.
   */
  useEffect(() => {
    setY(window.scrollY);
    window.addEventListener("scroll", handleNavigation);
    console;
    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);
  return (
    <div className="sticky top-0 z-10 flex flex-col bg-sciquelTeal text-white">
      <div className="absolute top-0 flex w-full justify-center px-10 py-4 text-xl font-thin leading-[2rem]">
        <Image src={logo} className="h-[2rem] w-auto" alt="SciQuel" />
        <p>SCIQUEL</p>
      </div>
      <div className="relative">
        <div className="flex w-full flex-row gap-4 px-10 py-4 align-middle">
          <SideBar />
          <div className="top-0 flex">
            <Search className="h-[2rem] w-auto " />

            <form onSubmit={onSearch}>
              <input
                className=" w-auto border border-x-transparent border-y-transparent bg-transparent outline-none focus:border-b-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div className="h-[2rem] grow" />
          {session.status === "authenticated" ? (
            <a
              href="#"
              onClick={() => void signOut()}
              className="font-bold leading-[2rem]"
            >
              SIGN OUT
            </a>
          ) : (
            <a
              href="#"
              onClick={() => void signIn()}
              className="font-bold leading-[2rem]"
            >
              LOGIN
            </a>
          )}
        </div>
      </div>
      <div
        className=" duration-350 z-10 flex flex-row px-40 text-center transition-all"
        style={{ height: scroll ? "0" : "40px" }}
      >
        <div
          className=" grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover"
          style={{ display: scroll ? "none" : "block" }}
        >
          <Link href="/">LATEST</Link>
        </div>
        <div
          className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover"
          style={{ display: scroll ? "none" : "block" }}
        >
          <Link href="/">READ</Link>
        </div>
        <div
          className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover"
          style={{ display: scroll ? "none" : "block" }}
        >
          <Topic></Topic>
        </div>
        <div
          className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover"
          style={{ display: scroll ? "none" : "block" }}
        >
          <Link href="/">ABOUT</Link>
        </div>
      </div>
    </div>
  );
}
