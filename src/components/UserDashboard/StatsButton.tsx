export default function StatsButton() {
  return (
    <div className="flex items-center justify-center gap-1 bg-[#A3C9A8] rounded-2xl p-2 px-4 backdrop-blur-md hover:scale-105 hover:bg-sciquelMuted w-[140px] h-[40px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4 text-[#69A297] mr-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <span className="text-sm flex items-center">
        <span className="text-white">VIEW</span>
        <span className="text-white ml-1 mr-1"> </span>
        <span className="text-white">STATS</span>
      </span>
    </div>
  );
}
