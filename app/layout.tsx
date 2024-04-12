import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Messaging app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background-950 text-text-400 text-lg overflow-hidden">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
