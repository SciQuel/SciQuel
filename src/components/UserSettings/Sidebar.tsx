import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="z-10 pt-6 md:fixed md:w-56">
      <h2 className="text-center text-3xl font-semibold text-[#50808e] md:text-left">
        Dashboard
      </h2>
      <div className="mt-8 flex flex-wrap justify-between gap-4 gap-y-8 text-center text-xl text-[#50808e] md:flex-col md:gap-y-2 md:text-left">
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800"
        >
          Dashboard
        </Link>
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800"
        >
          Reading History{" "}
        </Link>
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800"
        >
          Activity{" "}
        </Link>
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800"
        >
          Quiz History{" "}
        </Link>
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800 "
        >
          Annotations{" "}
        </Link>
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800"
        >
          Comments{" "}
        </Link>
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800 md:mt-16 "
        >
          Contact Us{" "}
        </Link>
        <Link
          href="/user-settings"
          className="hover:font-semibold hover:text-red-800"
        >
          Settings{" "}
        </Link>
      </div>
    </div>
  );
}
