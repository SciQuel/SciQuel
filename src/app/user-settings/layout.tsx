"use client";

import Sidebar from "@/components/UserSettings/Sidebar";
import { useSession } from "next-auth/react";

// import { useEffect, useState } from "react";

export default function Layout(props: { children: React.ReactNode }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="min-h-screen bg-white px-8 dark:bg-black">
        <p>You need to sign in to view this page</p>
      </div>
    );
  }
  return (
    <section>
      <div className="flex min-h-screen bg-white dark:bg-sciquelDarkText dark:text-white">
        <Sidebar />
        {props.children}
      </div>
    </section>
  );
}
