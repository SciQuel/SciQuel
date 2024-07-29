"use client";

import Sidebar from "@/components/UserSettings/Sidebar";
import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

export default function Layout(props: { children: React.ReactNode }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8F8FF] px-8 dark:bg-black">
        <p>You need to sign in to view this page</p>
      </div>
    );
  }
  return (
    <section>
      <div className="bg-[#F8F8FF] dark:bg-sciquelDarkText dark:text-white min-h-screen flex">
        <Sidebar/>
        {props.children}
      </div>
    </section>
  );
}
