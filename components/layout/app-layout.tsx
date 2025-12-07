"use client";

import { AppLayoutProvider } from "./app-layout-provider";

type AppLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <AppLayoutProvider className={className}>{children}</AppLayoutProvider>
  );
}
