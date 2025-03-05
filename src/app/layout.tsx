import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { layoutGetServerSession } from "#app/layoutFunctions";
import clsx from "clsx";
import {
  Alegreya_Sans_SC,
  Besley,
  Quicksand,
  Source_Serif_4,
} from "next/font/google";
import AuthProvider from "./AuthProvider";

export const metadata = {
  title: "SciQuel",
  description: "SciQuel",
};

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  variable: "--font-quicksand",
});

const alegreyaSansSC = Alegreya_Sans_SC({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-alegreya-sans-sc",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-source-serif-4",
  display: "swap",
});

const besley = Besley({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-besley",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await layoutGetServerSession();
  console.log("in layout: ", session);
  return (
    <html lang="en">
      <body
        className={clsx(
          quicksand.variable,
          besley.className,

          alegreyaSansSC.variable,
          sourceSerif4.variable,

          "flex min-h-screen flex-col",
        )}
      >
        <AuthProvider session={session}>
          <a
            href="#main"
            className="skip center absolute overflow-hidden outline focus:static "
          >
            Skip to main content
          </a>
          <div className=" min-h-screen">
            <Header></Header>

            <main className="pt-36 font-quicksand xs:pt-24 sm:pt-10" id="main">
              {children}
            </main>
          </div>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
