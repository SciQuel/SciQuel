"use client";

export default function BeakerGraphBox() {
  // 📝: this is very, very rough and practically a placeholder, but the intention is that this box presents the user's trivia history.
  //     you'll see on the figma that there' supposed to be a bar graph (?) representing the %s of the different topics the user studies.
  //     less realistic, but there was also a hope of presenting the same info in a beaker graph. dw about that, since it's mainly design/svg work.

  return (
    <div className="m-3 flex w-full flex-col rounded-lg border-2 border-solid border-gray-200 p-4">
      <div>
        {/* FIXME: need to automate! */}
        <h1 className="text-xl font-semibold">Lights, Camera, Action!</h1>
        <p className="mb-1.5 text-xs text-black">Last Studied: March 2, 2023</p>
      </div>

      <br></br>

      {/* N.B.: would be where you put the bar graph */}
      {/* <div className="text-sm mt-1.5">
        <h2 className="text-black font-semibold">Topics last studied:</h2>
        <p>Biology</p>
      </div> */}

      <div>
        <h2 className="text-sm font-semibold text-black">
          Trivia studied this week:{" "}
        </h2>

        {/* FIXME: once api is available, use TopicTag to assign colors and change these text vals */}
        <div className="flex text-[.6rem] text-black">
          <p className="mx-1">🔴 Geology</p>
          <p className="mx-1">🟠 Physics</p>
          <p className="mx-1">🟡 Biology</p>
        </div>
      </div>
    </div>
  );
}
