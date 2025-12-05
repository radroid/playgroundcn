"use client";

import { GlobalCssProvider } from "@/lib/context/global-css-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GlobalCssProvider>
      {children}
    </GlobalCssProvider>
  );
}

