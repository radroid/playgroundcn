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

type RightSidebarProps = {
  children: React.ReactNode;
  className?: string;
};

export function RightSidebar({ children, className }: RightSidebarProps) {
  const { isMobile, rightOpen, setRightOpen, rightCollapsed } = useAppLayout();

  if (isMobile) {
    return (
      <Sheet open={rightOpen} onOpenChange={setRightOpen}>
        <SheetContent
          side="right"
          className="w-[var(--sidebar-width-mobile)] p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Global CSS</SheetTitle>
            <SheetDescription>Edit global styles</SheetDescription>
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
        "hidden md:flex shrink-0 flex-col border-l bg-sidebar overflow-hidden",
        rightCollapsed
          ? "w-[var(--right-sidebar-width-collapsed)]"
          : "w-[var(--right-sidebar-width)]",
        className
      )}
    >
      {children}
    </aside>
  );
}
