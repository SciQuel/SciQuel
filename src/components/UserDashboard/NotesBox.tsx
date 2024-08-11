"use default";

import Image from "next/image";

export default function NotesBox() {
  return (
    <div className="m-3 flex w-full flex-col rounded-lg border-2 border-solid border-gray-200 p-4">
      <h1 className="text-xl font-semibold">Notes</h1>

      <br></br>

      <div className="flex items-center">
        <Image
          src="https://pngimg.com/uploads/letter_f/letter_f_PNG5.png"
          className="h-8 w-8"
          alt="image of the letter F"
        />

        <div className="ml-3 flex flex-col">
          <h2 className="mt-1 text-sm font-semibold">Title</h2>
          <p className="mt-1 text-xs text-[#252525]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            .....
          </p>
        </div>
      </div>

      <hr className="solid my-2 border-[#D6D6D6]"></hr>

      <div className="flex items-center">
        <Image
          src="https://pngimg.com/uploads/letter_f/letter_f_PNG5.png"
          className="h-8 w-8"
          alt="image of the letter F"
        />

        <div className="ml-3 flex flex-col">
          <h2 className="mt-1 text-sm font-semibold">Title</h2>
          <p className="mt-1 text-xs text-[#252525]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            .....
          </p>
        </div>
      </div>

      <hr className="solid my-2 border-[#D6D6D6]"></hr>

      <div className="flex items-center">
        <Image
          src="https://pngimg.com/uploads/letter_f/letter_f_PNG5.png"
          width={`${100}`}
          height={`${100}`}
          className="h-8 w-8"
          alt="image of the letter F"
        />

        <div className="ml-3 flex flex-col">
          <h2 className="mt-1 text-sm font-semibold">Title</h2>
          <p className="mt-1 text-xs text-[#252525]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            .....
          </p>
        </div>
      </div>
    </div>
  );
}
