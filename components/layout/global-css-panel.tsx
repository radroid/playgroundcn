"use client";

import { GlobalCssEditor } from "@/components/GlobalCssEditor";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollArea } from "@/components/ui/scroll-area";

export function GlobalCssPanel() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold">Global CSS</h2>
        <ThemeToggle />
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          <GlobalCssEditor />
        </div>
      </ScrollArea>
    </div>
  );
}
