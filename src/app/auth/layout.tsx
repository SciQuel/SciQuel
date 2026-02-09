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
    <div className="flex min-h-screen grow flex-row">
      <div
        id="login-left"
        className="relative hidden md:flex w-5/12 items-center justify-center overflow-hidden
                  bg-gradient-to-t from-[#B1F0E9] to-[#368C9F]"
      >
        {/* Top-left blob */}
        <div
          className="absolute top-[-25cqw] left-[-15cqw]
                    h-[50cqw] w-[50cqw]
                    rounded-full
                    bg-gradient-to-t from-[#B1F0E9] to-[#368C9F] z-10"
        />

        {/* Bottom blobs – shared gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#B1F0E9] to-[#368C9F]">
          {/* Bottom-left blob */}
          <div
            className="absolute bottom-[-10cqw] left-[-10cqw]
                      h-[40cqw] w-[40cqw]
                      rounded-full
                      bg-inherit"
          />

          {/* Bottom-right blob */}
          <div
            className="absolute bottom-[-10cqw] right-[-10cqw]
                      h-[30cqw] w-[30cqw]
                      rounded-full
                      bg-inherit"
          />
        </div>

        <Image
          src="/assets/images/logo_with_name_2.svg"
          alt="SciQuel Logo"
          width={400}
          height={400}
          className="relative z-10 pointer-events-none"
        />
      </div>

      <div id="login-right" className="flex grow items-center justify-center">
        <div className="w-5/12 max-w-[26rem]">{children}</div>
      </div>
    </div>
  );
}
