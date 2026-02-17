import { getServerSession } from "next-auth";
import { RedirectType } from "next/dist/client/components/redirect";
import Image from "next/image";
import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

export default async function LoginPage({ children }: PropsWithChildren) {
  const session = await getServerSession();
  if (session) {
    redirect("/", RedirectType.push);
  }
  return (
    <div className="flex flex-1 flex-row overflow-hidden">
      <div
        id="login-left"
        className="pointer-events-none relative hidden w-5/12 items-center justify-center overflow-hidden
                  bg-gradient-to-t from-[#B1F0E9] to-[#368C9F] md:flex"
      >
        {/* Top-left blob */}
        <div
          className="absolute left-[-10cqw] top-[-30cqw]
                    z-10 h-[40cqw]
                    w-[40cqw]
                    rounded-full bg-gradient-to-t from-[#B1F0E9] to-[#368C9F]"
        />

        {/* Bottom-left blob */}
        <div
          className="absolute bottom-[-15cqw] left-[-10cqw]
                    h-[40cqw] w-[40cqw]
                    rounded-full
                    bg-gradient-to-t from-[#B1F0E9] to-[#368C9F]"
        />

        {/* Bottom-right blob */}
        <div
          className="absolute bottom-[-10cqw] right-[-10cqw]
                    h-[25cqw] w-[25cqw]
                    rounded-full
                    bg-gradient-to-t from-[#B1F0E9] to-[#368C9F]"
        />

        <Image
          src="/assets/images/logoWithNameOnSide.svg"
          alt="SciQuel Logo"
          width={400}
          height={100}
          className="pointer-events-none relative z-10 h-auto w-[30cqw] select-none"
          priority
        />
      </div>

      <div id="login-right" className="flex grow items-center justify-center">
        <div className="w-5/12 min-w-80 max-w-[26rem]">{children}</div>
      </div>
    </div>
  );
}
