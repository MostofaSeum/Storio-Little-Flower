import type { Metadata } from "next";
import { Quicksand, Fredoka } from "next/font/google";
import "./globals.css";
import ClickSpark from "@/components/ui/ClickSpark";
import { getTenantContext, getTemplateLayout } from "@/lib/storio";

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

export async function generateMetadata(): Promise<Metadata> {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));

  return {
    title: {
      template: "%s",
      default: settings?.site_title || "Kindergarten & School",
    },
    description: settings?.site_tagline || "Practical teaching & social development for kids",
    icons: {
      icon: settings?.favicon_url || "/favicon.ico",
      apple: settings?.favicon_url || "/apple-touch-icon.png",
    },
  };
}

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
