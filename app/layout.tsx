import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/app/components/Header";
import AuthButtons from "@/app/components/AuthButtons";
import UserProfileMenu from "@/app/components/UserProfileMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIGHTRUN",
  description: "Underground car culture and JDM showcase.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("firebase_token")?.value;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Header authSection={token ? <UserProfileMenu /> : <AuthButtons />} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
