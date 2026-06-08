import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { jakarta, neirizi, cormorant } from "./pages/fonts";
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
  title: "Hadis Berdasarkan Tema Kehidupan",
  description: "Temukan petunjuk Rasulullah ﷺ berdasarkan tema kehidupan sehari-hari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${neirizi.variable} ${cormorant.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans" cz-shortcut-listen="true">{children}</body>
    </html>
  );
}
