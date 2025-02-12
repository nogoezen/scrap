import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Scraper Pro",
  description: "A modern, feature-rich web scraping application",
  metadataBase: new URL('https://scrap-nogoezen.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
