export default function StatsButton() {
  return (
    <div className="flex h-[40px] w-[140px] items-center justify-center gap-1 rounded-2xl bg-[#A3C9A8] p-2 px-4 backdrop-blur-md hover:scale-105 hover:bg-sciquelMuted">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="mr-1 h-4 w-4 text-[#69A297]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <span className="flex items-center text-sm">
        <span className="text-white">VIEW</span>
        <span className="ml-1 mr-1 text-white"> </span>
        <span className="text-white">STATS</span>
      </span>
    </div>
  );
}
