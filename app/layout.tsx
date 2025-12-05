import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { GlobalSearch } from "../components/GlobalSearch";
import { HeaderActions } from "../components/HeaderActions";
import { Providers } from "../components/Providers";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Toaster } from "../components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlaygroundCn",
  description: "Static Shadcn UI playground.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider>
            <Sidebar />
            <div className="fixed right-4 top-4 z-40">
              <HeaderActions />
            </div>
            <SidebarInset>
              <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-4">
                <div className="mb-4 flex items-center gap-6">
                  <SidebarTrigger />
                  <div className="w-full max-w-xs">
                    <GlobalSearch />
                  </div>
                </div>
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

