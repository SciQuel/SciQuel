export default function TrueFalse() {
  return (
    <div>
      <div className="true-false-selection mb-3 flex flex-col items-start gap-3 text-black">
        <p className="text-left">
          <strong className="">Mark each statement as true or false.</strong>
        </p>
        <div className="true-false-letters mb-[-35px] mt-[-35px] flex h-[-100px] w-full flex-row items-center justify-center gap-6 md-qz:mt-0">
          <div className="blankspace flex aspect-[8/1] basis-[80%] items-center justify-between gap-5"></div>
          <div className="true-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            T
          </div>
          <div className="false-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            F
          </div>
        </div>

        {/* Map of true false questions */}
        <div className="true-false-container flex h-full w-full flex-row items-center justify-center gap-6">
          <div className="true-false-statement flex aspect-[8/1] basis-[80%] flex-row items-center justify-between gap-5 rounded-md border border-black p-5 text-base font-medium md-qz:p-0">
            <p>T/F 1</p>
          </div>
          <button className="select-box-true flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300 "></button>

          <button className="select-box-false flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300"></button>
        </div>

        <div className="true-false-container flex h-full w-full flex-row items-center justify-center gap-6">
          <div className="true-false-statement flex aspect-[8/1] basis-[80%] flex-row items-center justify-between gap-5 rounded-md border border-black p-5 text-base font-medium md-qz:p-0">
            <p>T/F 2</p>
          </div>
          <button className="select-box-true flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-auto w-auto"
              style={{ display: "none" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </button>

          <button className="select-box-false flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300"></button>
        </div>

        <div className="true-false-container flex h-full w-full flex-row items-center justify-center gap-6">
          <div className="true-false-statement flex aspect-[8/1] basis-[80%] flex-row items-center justify-between gap-5 rounded-md border border-black p-5 text-base font-medium md-qz:p-0">
            <p>T/F 3</p>
          </div>
          <button className="select-box-true flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300 "></button>

          <button className="select-box-false flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300"></button>
        </div>
      </div>
    </div>
  );
}
