export default function MultipleChoice() {
  return (
    <div>
      <div className=" text-black">
        <p className="text-left">
          <strong>What are microglia?</strong>
        </p>
        <div className="flex flex-col ">
          {/* Map all choices and change base on the correctness of the choice*/}

          <button className="`multiple-choice-option my-1.5 flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-md border border-black px-5 py-5 text-base font-medium transition duration-300 ease-in-out hover:bg-gray-200">
            <p
              className="mt-2 pl-1 text-left text-sm"
              style={{ fontFamily: "quicksand" }}
            >
              The star-shaped cell that supports communication between neurons
            </p>
          </button>
          <button className="`multiple-choice-option my-1.5 flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-md border border-black px-5 py-5 text-base font-medium transition duration-300 ease-in-out hover:bg-gray-200">
            <p
              className="mt-2 pl-1 text-left text-sm"
              style={{ fontFamily: "quicksand" }}
            >
              The smallest type of glial cell that makes up about 10% of all
              brain cells
            </p>
          </button>
          <button className="`multiple-choice-option my-1.5 flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-md border border-black px-5 py-5 text-base font-medium transition duration-300 ease-in-out hover:bg-gray-200">
            <p
              className="mt-2 pl-1 text-left text-sm"
              style={{ fontFamily: "quicksand" }}
            >
              Microglia are the smallest type of glial cell that make up about
              10% of all brain cells.
            </p>
          </button>
        </div>
        {/* Base on the correctness of the choice, to display correct and incorrect massage*/}
        <div className="col my-2 text-center"></div>
      </div>
    </div>
  );
}
