import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Exclusive",
  description: "Your one-stop shop for exclusive deals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${inter.variable} antialiased`}
      >
        <Providers>
          <LayoutShell headerSlot={<Header />} footerSlot={<Footer />}>
            {children}
          </LayoutShell>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}