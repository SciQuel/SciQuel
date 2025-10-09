"use client";

import Sidebar from "@/components/UserSettings/Sidebar";
import { useSession } from "next-auth/react";

// import { useEffect, useState } from "react";

export default function Layout(props: { children: React.ReactNode }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="min-h-screen bg-white px-8 ">
        <p>You need to sign in to view this page</p>
      </div>
    );
  }
  return (
    <section className="h-full">
      <div className=" flex-col md:flex-row flex  h-[calc(100dvh-100px)] bg-white">
        <Sidebar />
        {props.children}
      </div>
    </section>
  );
}
