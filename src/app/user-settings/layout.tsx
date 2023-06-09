import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-wrap overflow-auto border-4 border-blue-600 bg-[#F8F8FF]">
      <div className="w-full border-4 border-black p-6 md:w-64">
        <h2 className="text-center text-3xl font-bold text-[#50808e] md:text-left">
          Dashboard
        </h2>
        <div className="mt-8 flex flex-wrap gap-y-8 text-center text-xl text-[#50808e] md:flex-col md:gap-y-2 md:text-left">
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800"
          >
            Dashboard
          </Link>
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800"
          >
            Reading History{" "}
          </Link>
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800"
          >
            Activity{" "}
          </Link>
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800"
          >
            Quiz History{" "}
          </Link>
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800 "
          >
            Annotations{" "}
          </Link>
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800"
          >
            Comments{" "}
          </Link>
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800 md:mt-16 "
          >
            Contact Us{" "}
          </Link>
          <Link
            href="/user-settings"
            className="basis-1/4 hover:font-semibold hover:text-red-800"
          >
            Settings{" "}
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
