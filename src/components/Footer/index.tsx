"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [step, setStep] = useState<"email" | "name">("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return (
    <div className="z-10 flex w-full flex-col bg-sciquelFooter font-quicksand text-white">
      <div className="relative">
        <div className="flex w-full flex-col px-4 pb-4 pt-4 sm:hidden">
          <p className="max-w-md">
            Get a weekly dose of accessible science delivered to your inbox.
          </p>

          <form
            className="mt-4 flex w-full flex-col sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();

              if (step === "email") {
                setStep("name");
                return;
              }

              // TODO: submit { email, firstName, lastName } here

              // reset
              setEmail("");
              setFirstName("");
              setLastName("");
              setStep("email");
            }}
          >
            <div className="flex w-full overflow-hidden rounded-lg border border-white sm:w-auto">
              {step === "email" ? (
                <>
                  <input
                    id="email-mobile"
                    type="email"
                    placeholder="team@sciquel.org"
                    pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    title="Please provide a valid email to subscribe to our newsletter"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
            h-9 w-full
            bg-sciquelFooter
            pl-2
            text-xs font-medium
            text-white placeholder-white
            outline-none
            sm:w-64
          "
                  />

                  <button
                    type="submit"
                    className="
            h-9 w-28
            whitespace-nowrap
            bg-white text-xs
            text-sciquelFooter
          "
                  >
                    Subscribe
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="First name"
                    required
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="
            h-9 w-full
            bg-sciquelFooter
            pl-2
            text-xs font-medium
            text-white placeholder-white
            outline-none
            sm:w-32
          "
                  />

                  <div className="h-9 w-[1px] shrink-0 bg-white" />

                  <input
                    type="text"
                    placeholder="Last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="
            h-9 w-full
            bg-sciquelFooter
            pl-2
            text-xs font-medium
            text-white placeholder-white
            outline-none
            sm:w-32
          "
                  />

                  <button
                    type="submit"
                    className="
            h-9 w-72
            whitespace-nowrap
            bg-white text-xs
            text-sciquelFooter
          "
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">SciQuel</p>
            <p>125 Western Avenue</p>
            <p>Allston, MA 02163</p>
          </div>
        </div>

        <div className="hidden w-full flex-row items-start justify-center gap-3 px-4 pb-4 align-middle xs:justify-between sm:flex sm:px-10 sm:pt-4">
          <div className="hidden flex-col gap-4 pt-4 xs:flex">
            <p>
              Get a weekly dose of accessible science delivered to your inbox.
            </p>
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();

                if (step === "email") {
                  setStep("name");
                  return;
                }

                // TODO: submit { email, firstName, lastName } to backend here

                // reset
                setEmail("");
                setFirstName("");
                setLastName("");
                setStep("email");
              }}
            >
              {/* One true pill */}
              <div className="flex w-full overflow-hidden rounded-lg border border-white sm:w-fit">
                {step === "email" ? (
                  <>
                    <input
                      id="email-desktop"
                      type="email"
                      className="
            h-9 w-full
            bg-sciquelFooter
            pl-2
            text-xs font-medium
            text-white placeholder-white
            outline-none
            sm:w-64
          "
                      placeholder="team@sciquel.org"
                      pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                      title="Please provide a valid email to subscribe to our newsletter"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="
            h-9 w-28
            bg-white
            text-xs text-sciquelFooter
          "
                    >
                      Subscribe
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="First name"
                      required
                      autoFocus
                      className="
            h-9 w-full
            bg-sciquelFooter
            pl-2
            text-xs font-medium
            text-white placeholder-white
            outline-none
            sm:w-32
          "
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />

                    <div className="h-9 w-[1px] shrink-0 bg-white" />

                    <input
                      type="text"
                      placeholder="Last name"
                      required
                      className="
            h-9 w-full
            bg-sciquelFooter
            pl-2
            text-xs font-medium
            text-white placeholder-white
            outline-none
            sm:w-32
          "
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="
            h-9 w-28
            bg-white
            text-xs text-sciquelFooter
          "
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          <div className="flex flex-col items-end pt-4">
            <p className="w-full text-center text-lg font-semibold xs:w-auto xs:text-end xs:text-base">
              SciQuel
            </p>
            <p className="text-right">125 Western Avenue</p>
            <p className="text-right">Allston, MA 02163</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex w-full justify-center">
        <nav className="flex flex-wrap justify-center gap-3">
          <Link href="/about">About</Link>
          <span className="px-0.5">|</span>
          <Link href="/leave-feedback">Contact Us</Link>
          <span className="px-0.5">|</span>
          <Link className="text-center" href="/privacy-and-terms">
            Privacy Policy and Other Terms
          </Link>
        </nav>
      </div>
    </div>
  );
}
