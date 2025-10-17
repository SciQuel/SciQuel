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
      <div className=" flex h-[calc(100dvh-100px)] flex-col  bg-white md:flex-row">
        <Sidebar />
        {props.children}
      </div>
    </section>
  );
}
