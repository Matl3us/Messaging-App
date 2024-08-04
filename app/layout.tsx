import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";
import "./globals.css";

import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "Messaging app",
  description: "Messaging app PWA application",
  generator: "Next.js",
  manifest: "/static/manifest.json",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  icons: [{ rel: "icon", url: "icons/icon-128x128.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background-950 text-text-400 text-lg h-full overflow-hidden">
        <SocketProvider>
          <QueryProvider>{children}</QueryProvider>
        </SocketProvider>
        <Toaster />
      </body>
    </html>
  );
}
