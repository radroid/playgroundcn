"use client";

import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { useAppLayout } from "./app-layout-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LeftSidebarProps = {
  children: React.ReactNode;
  className?: string;
};

export function LeftSidebar({ children, className }: LeftSidebarProps) {
  const { isMobile, leftOpen, setLeftOpen, leftCollapsed, toggleLeftCollapse } = useAppLayout();

  if (isMobile) {
    return (
      <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
        <SheetContent
          side="left"
          className="w-(--sidebar-width-mobile) p-0"
          showCloseButton={false}
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

  if (leftCollapsed) {
    return (
      <aside
        className={cn(
          "hidden md:flex w-full h-full shrink-0 flex-col border-r bg-sidebar overflow-hidden",
          className
        )}
        style={{ maxWidth: "var(--left-sidebar-width-collapsed)" }}
      >
        <div className="flex h-full flex-col items-center pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={toggleLeftCollapse}
            aria-label="Expand components sidebar"
          >
            <PanelLeftOpen className="size-4" />
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "hidden md:flex w-full h-full shrink-0 flex-col border-r bg-sidebar overflow-hidden",
        className
      )}
      style={{ 
        minWidth: "var(--left-sidebar-min-width)",
        maxWidth: "var(--left-sidebar-max-width)"
      }}
    >
      {children}
    </aside>
  );
}
