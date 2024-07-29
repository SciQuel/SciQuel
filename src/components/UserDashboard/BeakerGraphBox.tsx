"use client";

export default function BeakerGraphBox() {
  return (
    <div className="flex flex-col border-2 border-solid border-gray-200 rounded-lg p-4 m-3 w-1/2 h-full">
      <div>
        <h1 className="text-xl font-semibold">Lights, Camera, Action!</h1>
        <p className="text-xs mb-1.5 text-black">Last Studied: March 2, 2023</p>
      </div>
      <div className="text-sm mt-1.5">
        <h2 className="text-black font-semibold">Topics last studied:</h2>
        <p>Biology</p>
      </div>

      <img src="https://static.vecteezy.com/system/resources/previews/026/628/264/original/erlenmeyer-flask-icon-symbol-design-illustration-vector.jpg"></img> {/* FIXME: insert!!! */}

      <div>
        <h2 className="text-sm text-black font-semibold">Trivia studied this week: </h2>

        <div className="flex text-[.6rem] text-black"> {/* FIXME: all need to be fixed!! */}
          <p className="mx-1">🔴 Geology</p>
          <p className="mx-1">🟠 Physics</p>
          <p className="mx-1">🟡 Biology</p>
        </div>
      </div>
    </div>
  )
}