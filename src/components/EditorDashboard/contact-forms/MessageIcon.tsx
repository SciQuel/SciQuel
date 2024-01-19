"use client";

import { type GetContactCountResult } from "@/app/api/contact/count/route";
import env from "@/lib/env";
import { useEffect, useState } from "react";

export default function MessageIcon() {
  const [newMessageCount, setNewMessageCount] = useState<undefined | number>(
    undefined,
  );

  useEffect(() => {
    (async () => {
      const count = await fetch(
        `${env.NEXT_PUBLIC_SITE_URL}/api/contact/count`,
      );
      const { new_messages } = (await count.json()) as GetContactCountResult;
      setNewMessageCount(new_messages);
    })()
      .then(() => {})
      .catch((err) => {
        console.error(err);
        setNewMessageCount(undefined);
      });
  }, []);

  if (newMessageCount) {
    return (
      <span className="rounded-full bg-sciquelTeal px-2 text-white">
        {newMessageCount} new
      </span>
    );
  } else {
    return <></>;
  }
}
