import "./globals.css";
import Header from "@/components/Header";
import { authOptions } from "@/lib/auth";
import clsx from "clsx";
import { getServerSession } from "next-auth";
import { Alegreya_Sans_SC, Quicksand, Source_Serif_4 } from "next/font/google";
import AuthProvider from "./AuthProvider";

export const metadata = {
  title: "SciQuel",
  description: "SciQuel",
};

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body
        className={
          clsx(
            quicksand.className,
            alegreyaSansSC.variable,
            sourceSerif4.variable,
            'min-h-screen',
          )
        }
      >
        <AuthProvider session={session}>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
