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
    <div className="flex flex-row overflow-hidden flex-1">
      <div
        id="login-left"
        className="relative hidden md:flex w-5/12 items-center justify-center overflow-hidden
                  bg-gradient-to-t from-[#B1F0E9] to-[#368C9F] pointer-events-none"
      >
        {/* Top-left blob */}
        <div
          className="absolute top-[-30cqw] left-[-10cqw]
                    h-[40cqw] w-[40cqw]
                    rounded-full
                    bg-gradient-to-t from-[#B1F0E9] to-[#368C9F] z-10"
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
          className="w-[30cqw] h-auto pointer-events-none select-none relative z-10"
          priority
        />
      </div>

      <div id="login-right" className="flex grow items-center justify-center">
        <div className="w-5/12 max-w-[26rem] min-w-80">{children}</div>
      </div>
    </div>
  );
}
