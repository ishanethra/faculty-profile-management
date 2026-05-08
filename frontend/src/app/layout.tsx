import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NIT Trichy Faculty Portal",
  description: "Faculty Management Portal for NIT Trichy",
};

import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
