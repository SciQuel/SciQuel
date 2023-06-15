export default function SideBar() {
  return (
    <div>
      <div className="h-[2rem] cursor-pointer">
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
        <div className="mx-3.5 my-1.5 h-1 w-8 bg-white"></div>
      </div>

      <nav
        className="w-63 fixed left-0 top-0 z-40 h-screen -translate-x-full overflow-y-auto 
      bg-[#69a297] p-4 transition-transform dark:bg-gray-800"
      >
        <ul>
          <li className="mx-2 my-2 cursor-pointer hover:bg-sciquelHover">
            Read Science
          </li>
          <li className="my-2 cursor-pointer hover:bg-sciquelHover">
            Listen Science
          </li>
          <li className="my-2 cursor-pointer hover:bg-sciquelHover">
            Watch Science
          </li>
          <li className="my-2 cursor-pointer hover:bg-sciquelHover">
            View Science
          </li>
        </ul>
      </nav>
    </div>
  );
}
