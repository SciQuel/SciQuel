"use default";

export default function NotesBox() {
  return (
    <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-full">
      <h1 className="text-xl font-semibold">Notes</h1>

      <br></br>

      <div className="flex items-center">
        <img src="https://pngimg.com/uploads/letter_f/letter_f_PNG5.png"
        className="h-8 w-8">
        </img>

        <div className="flex flex-col ml-3">
          <h2 className="text-sm mt-1 font-semibold">Title</h2>
          <p className="text-xs mt-1 text-[#252525]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do .....</p>
        </div>

      </div>

      <hr className="solid my-2 border-[#D6D6D6]"></hr>

      <div className="flex items-center">
        <img src="https://pngimg.com/uploads/letter_f/letter_f_PNG5.png"
        className="h-8 w-8">
        </img>

        <div className="flex flex-col ml-3">
          <h2 className="text-sm mt-1 font-semibold">Title</h2>
          <p className="text-xs mt-1 text-[#252525]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do .....</p>
        </div>

      </div>

      <hr className="solid my-2 border-[#D6D6D6]"></hr>

      <div className="flex items-center">
        <img src="https://pngimg.com/uploads/letter_f/letter_f_PNG5.png"
        className="h-8 w-8">
        </img>

        <div className="flex flex-col ml-3">
          <h2 className="text-sm mt-1 font-semibold">Title</h2>
          <p className="text-xs mt-1 text-[#252525]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do .....</p>
        </div>

      </div>
    </div>
  )
}