"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type MainContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainContent({ children, className }: MainContentProps) {
  return (
    <ScrollArea className="flex-1 min-h-0 min-w-0">
      <main className={cn("max-w-[1440px] mx-auto w-full min-w-0", className)}>
        {children}
      </main>
    </ScrollArea>
  );
}
