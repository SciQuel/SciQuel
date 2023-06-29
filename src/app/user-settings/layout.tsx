"use client";

import Sidebar from "@/components/UserSettings/Sidebar";
import { useSession } from "next-auth/react";

export default function Layout(props: { children: React.ReactNode }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8F8FF] px-8">
        <p>You need to sign in to view this page</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F8F8FF] px-8">
      <Sidebar />
      {props.children}
    </div>
  );
}
