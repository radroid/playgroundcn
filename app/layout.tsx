import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import {
  AppLayout,
  AppHeader,
  LeftSidebar,
  RightSidebar,
  MainContent,
  ComponentsList,
  GlobalCssPanel,
} from "../components/layout";
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
  icons: {
    icon: [
      {
        url: "/favicon_light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon_dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
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
          <AppLayout>
            <AppHeader />
            <div className="flex flex-1 overflow-hidden">
              <LeftSidebar>
                <ComponentsList />
              </LeftSidebar>
              <MainContent className="p-4">{children}</MainContent>
              <RightSidebar>
                <GlobalCssPanel />
              </RightSidebar>
            </div>
          </AppLayout>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
