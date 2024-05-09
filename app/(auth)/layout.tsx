import { Shell } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-screen overflow-hidden">
      <nav className="h-12 flex px-3 gap-4 items-center bg-background-900">
        <Shell size="36" className="ml-1 mt-1 text-primary-500" />
        <p className="text-primary-500 text-xl font-semibold">Logo</p>
      </nav>
      <div className="flex-1 overflow-auto border-t-[1px] border-background-700 bg-background-950">
        {children}
      </div>
    </div>
  );
}
