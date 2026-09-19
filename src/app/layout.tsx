import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "MyData Social",
  description: "Profiles, relationships, and community",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const embedded =
    headerStore.get("x-social-embed") === "1" ||
    cookieStore.get("social-embed")?.value === "1";

  return (
    <html lang="en" className={`${geist.variable} antialiased`} data-embed={embedded ? "1" : undefined}>
      <body className={embedded ? "embed-mode" : "min-h-full"}>{children}</body>
    </html>
  );
}
