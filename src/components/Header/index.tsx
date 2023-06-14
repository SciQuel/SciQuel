"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import logo from "./logo.png";

export default function Header() {
  const session = useSession();
  return (
    <div className="flex flex-col bg-sciquelTeal text-white">
      <div className="absolute top-0 flex w-full justify-center px-10 py-4 text-xl font-thin leading-[2rem]">
        <Image src={logo} className="h-[2rem] w-auto" alt="SciQuel" />
        <p>SCIQUEL</p>
      </div>
      <div className="relative">
        <div className="flex w-full flex-row gap-4 px-10 py-4 align-middle">
          <button className="h-[2rem]">
            <i className="symbol text-2xl leading-[2rem]">menu</i>
          </button>
          <button className="h-[2rem]">
            <i className="symbol text-2xl leading-[2rem]">search</i>
          </button>
          <div className="h-[2rem] grow" />
          {session.status === "authenticated" ? (
            <a
              href="#"
              onClick={() => void signOut()}
              className="font-bold leading-[2rem]"
            >
              SIGN OUT
            </a>
          ) : (
            <a
              href="#"
              onClick={() => void signIn()}
              className="font-bold leading-[2rem]"
            >
              LOGIN
            </a>
          )}
        </div>
      </div>
      <div className="flex flex-row px-40 text-center">
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          LATEST
        </div>
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          READ
        </div>
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          TOPIC
        </div>
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          ABOUT
        </div>
      </div>
    </div>
  );
}
