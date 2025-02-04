interface Props {
  text: string;
  route: string;
}

export default function NavigateLink({ text, route }: Props) {
  return (
    <a href={route} className="ms-auto ">
      <span className="flex flex-row justify-end">
        <p className="mr-2 flex w-fit align-middle text-xl font-medium underline underline-offset-4">
          {text}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className=" block h-8 w-8 align-middle"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
    </a>
  );
}
