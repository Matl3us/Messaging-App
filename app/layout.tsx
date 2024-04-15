import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";
import "./globals.css";

import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

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
      <body className="bg-background-950 text-text-400 text-lg h-full">
        <SocketProvider>
          <QueryProvider>{children}</QueryProvider>
        </SocketProvider>
        <Toaster />
      </body>
    </html>
  );
}
