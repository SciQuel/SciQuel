"use client";

import Link from "next/link";
import HeaderLogo from "../../../../public/assets/images/logoWithNameOnSide.svg";

export default function LogoLink() {
  return (
    <Link className=" pointer-events-auto" href="/">
      <HeaderLogo className="h-8 w-auto fill-white sm:h-10" />
      <span className="sr-only">Go to home page</span>
    </Link>
  );
}
