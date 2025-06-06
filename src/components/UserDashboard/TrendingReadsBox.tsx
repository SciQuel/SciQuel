"use default";

import Image from "next/image";

export default function TrendingReadsBox() {
  return (
    <div className="m-3 flex w-5/6 flex-col rounded-lg border-2 border-solid border-gray-200 p-4">
      <h1 className="text-xl font-semibold">Trending Reads</h1>

      {/* FIXME:  please replace this with an actual graph*/}
      <Image
        src="https://slidebazaar.com/wp-content/uploads/2023/07/Multiple-Line-Chart-Template.jpg"
        alt="PLACEHOLDER image for line graph"
        width={`${100}`}
        height={`${100}`}
      />
    </div>
  );
}
