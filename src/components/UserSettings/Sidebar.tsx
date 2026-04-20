"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarItem(props: {
  children: React.ReactNode;
  path: string;
  href: string;
  margin?: boolean;
}) {
  const active = props.path === props.href;
  return (
    <Link
      href={props.href}
      className={clsx({
        "hover:font-semibold": true,
        "hover:text-red-800": true,
        "text-red-800": active,
        "font-semibold": active,
        "md:mt-16": props.margin,
      })}
    >
      {props.children}
    </Link>
  );
}

export default function Sidebar() {
  const path: string = usePathname();
  const temp = path.split("/");
  const title = temp[temp.length - 1]
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toUpperCase() : word.toLowerCase();
    })
    .replace(/-/g, " ");
  return (
    <div className="z-10 pt-6 md:fixed md:w-56">
      <h2 className="text-center text-3xl font-semibold text-[#50808e] md:text-left">
        {title}
      </h2>
      <div className="mt-8 flex flex-wrap justify-between gap-4 gap-y-8 text-center text-xl text-[#50808e] md:flex-col md:gap-y-2 md:text-left">
        <SidebarItem href="/user-settings/dashboard" path={path}>
          Dashboard
        </SidebarItem>
        <SidebarItem href="/user-settings/reading-history" path={path}>
          Reading History
        </SidebarItem>
        <SidebarItem href="/user-settings/activity" path={path}>
          Activity
        </SidebarItem>
        <SidebarItem href="/user-settings/quiz-history" path={path}>
          Quiz History
        </SidebarItem>
        <SidebarItem href="/user-settings/annotations" path={path}>
          Annotations
        </SidebarItem>
        <SidebarItem href="/user-settings/comments" path={path}>
          Comments
        </SidebarItem>
        <SidebarItem href="/user-settings/contact-us" path={path} margin={true}>
          Contact Us
        </SidebarItem>
        <SidebarItem href="/user-settings/settings" path={path}>
          Settings
        </SidebarItem>
      </div>
    </div>
  );
}
