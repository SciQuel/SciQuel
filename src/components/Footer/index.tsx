import Link from "next/link";

// import FooterIcon from "./FooterIcon";

export default function Footer() {
  return (
    <div className=" z-10 flex w-full flex-col bg-sciquelFooter font-quicksand text-white ">
      <div className="relative">
        <div className=" flex w-full flex-row justify-center gap-4 px-4 pb-4 align-middle xs:justify-between sm:px-10 sm:pt-4">
          <div className="hidden flex-col gap-4 pt-4 xs:flex">
            <p>Get a weekly dose of accessible science delivered to your inbox.</p>
            <form className="w-full">
              <input
                id="email"
                type="email"
                className="h-9 w-full rounded-l-lg rounded-r-lg border border-solid
                 bg-sciquelFooter pl-2 text-xs font-medium
                  text-white placeholder-white outline-1
                   sm:w-64 sm:rounded-r-none"
                placeholder="team@sciquel.org"
                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                title="Please provide a valid email to subscribe to our newsletter"
                required
              />
              <button
                type="submit"
                className="mx-auto mt-3 h-9 w-28 
                rounded-l-lg rounded-r-lg
                 bg-white text-xs text-sciquelFooter sm:mx-0 sm:mt-0 sm:rounded-l-none"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="flex flex-col items-end pt-4 ">
            <p className="w-full text-center text-lg font-semibold xs:w-auto xs:text-end xs:text-base">
              Sciquel
            </p>
            {/* <div className="flex flex-row">
              <FooterIcon type="instagram" />
              <FooterIcon type="facebook" />
              <FooterIcon type="youtube" />
              <FooterIcon type="arrow" />
            </div> */}
            <p>125 Western Ave.</p>
            <p>Allston, MA 02163</p>
          </div>
        </div>
      </div>
      <div className="mb-4 flex w-full justify-center">
        <nav className="flex flex-wrap justify-center gap-3">
          <Link href="/about">About</Link>
          {/* <Link href="/">Team</Link> */}
          {/* <Link href="/">Terms & Conditions</Link> */}

          <Link href="/leave-feedback">Contact Us</Link>
          <Link className="text-center" href="/privacy-and-terms">
            Privacy Policy and Other Terms
          </Link>
        </nav>
      </div>
    </div>
  );
}
