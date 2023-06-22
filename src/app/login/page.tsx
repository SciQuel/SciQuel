import LoginForm from "@/components/Auth/LoginForm";
import { getServerSession } from "next-auth";
import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/", RedirectType.push);
  }
  return (
    <div className="flex grow flex-row">
      <div className="w-5/12 bg-gradient-to-t from-[#b5bce6] to-[#aeefd0]" />
      <div className="flex grow items-center justify-center">
        <div className="w-5/12 max-w-[26rem]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
