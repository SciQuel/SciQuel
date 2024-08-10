"use default";

export default function HighlightsBox() {
  return (
    <div className="m-3 flex flex-col rounded-lg border-2 border-solid border-gray-200 p-4">
      <h1 className="mb-1.5 text-xl font-semibold">Highlight</h1>

      {/* FIXME: this is a mess, u gotta fix this */}
      <div className="flex items-center">
        <svg
          width="10"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.2929 2.29289C16.6834 1.90237 17.3166 1.90237 17.7071 2.29289L21.7071 6.29289C22.0976 6.68342 22.0976 7.31658 21.7071 7.70711L8.70711 20.7071C8.51957 20.8946 8.26522 21 8 21H4C3.44772 21 3 20.5523 3 20V16C3 15.7348 3.10536 15.4804 3.29289 15.2929L16.2929 2.29289ZM5 16.4142V19H7.58579L19.5858 7L17 4.41421L5 16.4142Z"
            fill="#50808E"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289L18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071C18.3166 11.0976 17.6834 11.0976 17.2929 10.7071L13.2929 6.70711C12.9024 6.31658 12.9024 5.68342 13.2929 5.29289Z"
            fill="#50808E"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.2929 2.29289C16.6834 1.90237 17.3166 1.90237 17.7071 2.29289L21.7071 6.29289C22.0976 6.68342 22.0976 7.31658 21.7071 7.70711L8.70711 20.7071C8.51957 20.8946 8.26522 21 8 21H4C3.44772 21 3 20.5523 3 20V16C3 15.7348 3.10536 15.4804 3.29289 15.2929L16.2929 2.29289ZM5 16.4142V19H7.58579L19.5858 7L17 4.41421L5 16.4142Z"
            fill="#50808E"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289L18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071C18.3166 11.0976 17.6834 11.0976 17.2929 10.7071L13.2929 6.70711C12.9024 6.31658 12.9024 5.68342 13.2929 5.29289Z"
            fill="#50808E"
          />
        </svg>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
            <p className="mx-3 p-1.5 text-[.6rem] text-[#50808E]">
              7 Highlights
            </p>{" "}
            {/* obvi gotta fix this */}
          </div>

          <p className="text-xs text-[#252525]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod temp or incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <hr className="solid my-2 border-[#D6D6D6]"></hr>

      <div className="flex items-center">
        <svg
          className="mr-3 h-10 w-10 text-[#50808E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
            <p className="mx-3 p-1.5 text-[.6rem] text-[#50808E]">
              7 Highlights
            </p>{" "}
            {/* obvi gotta fix this */}
          </div>

          <p className="text-xs text-[#252525]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod temp or incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <hr className="solid my-2 border-[#D6D6D6]"></hr>

      <div className="flex items-center">
        <svg
          className="mr-3 h-10 w-10 text-[#50808E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Lights, Camera, Action!</h2>
            <p className="mx-3 p-1.5 text-[.6rem] text-[#50808E]">
              7 Highlights
            </p>{" "}
            {/* obvi gotta fix this */}
          </div>

          <p className="text-xs text-[#252525]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod temp or incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
}
