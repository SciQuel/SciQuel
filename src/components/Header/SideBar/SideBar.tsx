import { useEffect, useRef, useState } from "react";

export default function SideBar() {
  const [showSideBar, setShowSideBar] = useState(false);
  let menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let handler = (event: any) => {
      if (menuRef.current != null) {
        if (!menuRef.current.contains(event.target)) {
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
      <div
        className="h-[2rem] cursor-pointer"
        onClick={() => setShowSideBar((showSideBar) => !showSideBar)}
      >
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
      </div>

      <div
        className="fixed top-0 z-40 h-screen w-56  
        -translate-x-full  transform overflow-y-auto bg-[#69a297] transition-all duration-500 "
        style={{ left: showSideBar ? "14rem" : "0" }}
        ref={menuRef}
      >
        <nav className="relative flex flex-col ">
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Read Science</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Listen Science</span>
          </a>

          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Watch Science</span>
          </a>

          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">View Science</span>
          </a>

          <hr className="mx-3 mt-4" />

          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Astronomy</span>
          </a>

          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Biology</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Chemistry</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Computer Science</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Chemical</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Electrical</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Environmental Science</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Geology</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Mathematics</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Mechanical Engineering</span>
          </a>

          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Medicine</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Physics</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Psychology</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Sociology</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Technology</span>
          </a>

          <hr className="mx-3 mt-4" />

          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Get Involved</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Leave FeedBack</span>
          </a>
          <a className="text-white-400 mt-3 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Behind The Science</span>
          </a>
          <hr className="mx-3 mt-4" />
          <a className="text-white-400 mt-3 flex transform items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">More&rarr;</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
