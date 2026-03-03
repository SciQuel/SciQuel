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
    <section className="h-full overflow-hidden">
      <div className="flex h-[calc(100dvh-100px)] flex-col overflow-hidden bg-white md:flex-row">
        <Sidebar />
        <div
          data-user-settings-content="true"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          {props.children}
        </div>
      </div>
    </section>
  );
}
