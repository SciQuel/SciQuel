type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export function PrevButton({ onClick }: Props) {
  return (
    <button
      className="h-8 rounded-lg bg-gray-100 px-2 hover:scale-105 hover:bg-gray-200"
      title="previous"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
}
