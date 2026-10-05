import type { Metadata } from "next";
import { Quicksand, Fredoka } from "next/font/google";
import "./globals.css";
import ClickSpark from "@/components/ui/ClickSpark";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Kindergarten & School",
  },
  description: "Practical teaching & social development for kids",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-gray-800">
        <ClickSpark />
        {children}
      </body>
    </html>
  );
}
