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
        -translate-x-full  transform  bg-[#69a297] transition-all duration-500 "
        style={{ left: showSideBar ? "14rem" : "0" }}
        ref={menuRef}
      >
        <nav className="relative flex flex-col ">
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Read Science</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Listen Science</span>
          </li>

          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Watch Science</span>
          </li>

          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">View Science</span>
          </li>

          <hr className="mx-3 my-2" />

          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center  hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Astronomy</span>
          </li>

          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Biology</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Chemistry</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Computer Science</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Chemical</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Electrical</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Environmental Science</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Geology</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Mathematics</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Mechanical Engineering</span>
          </li>

          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Medicine</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Physics</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Psychology</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Sociology</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Technology</span>
          </li>

          <hr className="mx-3 my-2" />

          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Get Involved</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Leave FeedBack</span>
          </li>
          <li className="text-white-400 my-1.5 flex transform cursor-pointer items-center   hover:bg-sciquelHover">
            <span className="mx-4 font-medium">Behind The Science</span>
          </li>

          <hr className="mx-3 my-2" />

          <li className=" text-white-400 group relative relative my-1.5 flex transform items-center   hover:bg-sciquelHover">
            <a className="mx-4 font-medium">More&rarr;</a>
            <ul className=" absolute bottom-0 left-56 z-50 hidden w-56 bg-[#69a297] group-hover:block">
              <li className="hover-trigger text-white-400 relative relative my-1.5 flex transform items-center   hover:bg-sciquelHover">
                <a className="mx-4 font-medium">Trending</a>
              </li>
              <li className="hover-trigger text-white-400 relative relative my-1.5 flex transform items-center   hover:bg-sciquelHover">
                <a className="mx-4 font-medium">Newsletter</a>
              </li>
              <li className="hover-trigger text-white-400 relative relative my-1.5 flex transform items-center   hover:bg-sciquelHover">
                <a className="mx-4 font-medium">About SciQuel</a>
              </li>
              <li className="hover-trigger text-white-400 relative relative my-1.5 flex transform items-center   hover:bg-sciquelHover">
                <a className="mx-4 font-medium">Contact Us</a>
              </li>
              <li className="hover-trigger text-white-400 relative relative my-1.5 flex transform items-center   hover:bg-sciquelHover">
                <a className="mx-4 font-medium">RSS</a>
              </li>
            </ul>
          </li>
        </nav>
      </div>
    </div>
  );
}
