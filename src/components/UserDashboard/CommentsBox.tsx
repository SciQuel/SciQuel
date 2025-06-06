"use default";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

export default function CommentsBox() {
  /*
    const session = useSession();
  const ID = session.data?.user.id;
  const URL = `http://localhost:3000/api/comments?userId=${ID}` // lol zhiyan hasn't pushed her code to the main branch yet </3

  [totalCommentsCount, setTotal] = useState(0);

  const response = fetch(URL, {
    method: "GET",
  })
  .then(response => {
    return response.json()})
  .then(data => {
    setTotal(data.length);
  })
  */

  // 🚨 FOLKS THIS ISN'T RIGHT USE A .then PLEASE

  return (
    <div className="m-3 flex w-fit flex-col rounded-lg border-2 border-solid border-gray-200 p-4">
      <h1 className="text-xl font-semibold">Comments</h1>
      {/* <h1 className="text-4xl font-semibold">{totalCommentsCount}</h1> FIXME: need 2 code */}
      <h1 className="text-4xl font-semibold">14</h1>

      <br></br>

      <div className="flex items-center">
        <p className="rounded-xl bg-[#68a297] px-3 text-xl font-bold text-white">
          9
        </p>{" "}
        {/* FIXME: need 2 code */}
        <p className="px-3 text-sm text-black">Replies</p>
        <p className="rounded-xl bg-[#e2964f] px-3 text-xl font-bold text-white">
          14
        </p>{" "}
        {/* FIXME: need 2 code */}
        <p className="whitespace-nowrap px-3 text-sm text-black">
          Contributor Replies
        </p>
      </div>
    </div>
  );
}
