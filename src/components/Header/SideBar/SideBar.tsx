import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SideBar() {
  const [showSideBar, setShowSideBar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (event: Event) => {
      if (menuRef.current != null) {
        if (!menuRef.current.contains(event.target as Node)) {
          setShowSideBar(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div>
      <button
        className="h-[2rem] cursor-pointer"
        onClick={() => setShowSideBar((showSideBar) => !showSideBar)}
      >
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
      </button>

      <div
        className="fixed top-0 z-40 h-screen w-56  
        -translate-x-full  transform  bg-sciquelTeal transition-all duration-100 "
        style={{ left: showSideBar ? "14rem" : "0" }}
        ref={menuRef}
      >
        <nav className="relative flex flex-col ">
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Read Science
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Listen Science
            </Link>
          </li>

          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Watch Science
            </Link>
          </li>

          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              View Science
            </Link>
          </li>

          <hr
            className="mx-3 my-2"
            style={{ display: showSideBar ? "block" : "none" }}
          />

          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Astronomy
            </Link>
          </li>

          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Biology
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Chemistry
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Computer Science
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Chemical
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Electrical
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Environmental Science
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Geology
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Mathematics
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Mechanical Engineering
            </Link>
          </li>

          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Medicine
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Physics
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Psychology
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Sociology
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Technology
            </Link>
          </li>

          <hr
            className="mx-3 my-2"
            style={{ display: showSideBar ? "block" : "none" }}
          />

          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Get Involved
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Leave FeedBack
            </Link>
          </li>
          <li
            className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <Link href="/" className="mx-4 font-medium">
              Behind The Science
            </Link>
          </li>

          <hr
            className="mx-3 my-2"
            style={{ display: showSideBar ? "block" : "none" }}
          />

          <li
            className=" text-white-400 group relative my-1.5 flex transform items-center   hover:bg-sciquelHover"
            style={{ display: showSideBar ? "block" : "none" }}
          >
            <a className="mx-4 font-medium">More&rarr;</a>
            <ul className=" absolute bottom-0 left-56 z-50 hidden w-56 bg-sciquelTeal group-hover:block">
              <li
                className="hover-trigger text-white-400 relative my-1.5 flex transform items-center   hover:bg-sciquelHover"
                style={{ display: showSideBar ? "block" : "none" }}
              >
                <Link href="/" className="mx-4 font-medium">
                  Trending
                </Link>
              </li>
              <li
                className="hover-trigger text-white-400 relative my-1.5 flex transform items-center   hover:bg-sciquelHover"
                style={{ display: showSideBar ? "block" : "none" }}
              >
                <Link href="/" className="mx-4 font-medium">
                  Newsletter
                </Link>
              </li>
              <li
                className="hover-trigger text-white-400 relative my-1.5 flex transform items-center   hover:bg-sciquelHover"
                style={{ display: showSideBar ? "block" : "none" }}
              >
                <Link href="/" className="mx-4 font-medium">
                  About SciQuel
                </Link>
              </li>
              <li
                className="hover-trigger text-white-400 relative my-1.5 flex transform items-center   hover:bg-sciquelHover"
                style={{ display: showSideBar ? "block" : "none" }}
              >
                <Link href="/" className="mx-4 font-medium">
                  Contact Us
                </Link>
              </li>
              <li
                className="hover-trigger text-white-400 relative my-1.5 flex transform items-center   hover:bg-sciquelHover"
                style={{ display: showSideBar ? "block" : "none" }}
              >
                <Link href="/" className="mx-4 font-medium">
                  RSS
                </Link>
              </li>
            </ul>
          </li>
        </nav>
      </div>
    </div>
  );
}
