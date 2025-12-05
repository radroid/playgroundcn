"use client";

import * as React from "react";

import { useAppLayout } from "./app-layout-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type LeftSidebarProps = {
  children: React.ReactNode;
  className?: string;
};

export function LeftSidebar({ children, className }: LeftSidebarProps) {
  const { isMobile, leftOpen, setLeftOpen } = useAppLayout();

  if (isMobile) {
    return (
      <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
        <SheetContent
          side="left"
          className="w-[var(--sidebar-width-mobile)] p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Components</SheetTitle>
            <SheetDescription>Browse available components</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col overflow-hidden">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden md:flex w-[var(--left-sidebar-width)] shrink-0 flex-col border-r bg-sidebar overflow-hidden",
        className
      )}
    >
      {children}
    </aside>
  );
}
