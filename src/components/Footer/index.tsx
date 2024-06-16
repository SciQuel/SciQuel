import Link from "next/link";
import FooterIcon from "./FooterIcon";

export default function Footer() {
  return (
    <div className=" z-10 flex w-full flex-col bg-sciquelFooter text-white ">
      <div className="relative">
        <div className=" flex w-full flex-row justify-between gap-4 px-10 py-4 align-middle">
          <div className="flex flex-col gap-4 pt-4 ">
            <p>Get a weekly dose of accessible science to your inbox</p>
            <form>
              <input
                id="email"
                type="email"
                className="h-9 w-64 rounded-l-lg border border-solid bg-sciquelFooter pl-2 text-xs font-medium text-sciquelFooter placeholder-white outline-1"
                placeholder="team@sciquel.org"
                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                title="Please provide a valid email"
                required
              />
              <button
                type="submit"
                className="h-9 w-28 rounded-r-lg bg-white text-xs text-sciquelFooter"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="flex flex-col items-end pt-4 ">
            <p>Sciquel</p>
            <div className="flex flex-row">
              <FooterIcon type="instagram" />
              <FooterIcon type="facebook" />
              <FooterIcon type="youtube" />
              <FooterIcon type="arrow" />
            </div>
            <p>125 Western Ave.</p>
            <p>Allston, MA 02163</p>
          </div>
        </div>
      </div>
      <div className="mb-4 flex w-full justify-center">
        <nav className="flex gap-3">
          <Link href="/">About</Link>
          <Link href="/">Team</Link>
          <Link href="/">Terms & Conditions</Link>
          <Link href="/">Privacy Policy</Link>
          <Link href="/">Contact Us</Link>
        </nav>
      </div>
    </div>
  );
}
