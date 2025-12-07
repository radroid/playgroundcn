"use client";

import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { GlobalCssEditor } from "@/components/GlobalCssEditor";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAppLayout } from "./app-layout-provider";

export function GlobalCssPanel() {
  const { rightCollapsed, toggleRightCollapse } = useAppLayout();

  if (rightCollapsed) {
    return (
      <div className="flex h-full flex-col items-center pt-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={toggleRightCollapse}
          aria-label="Expand CSS sidebar"
        >
          <PanelRightOpen className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={toggleRightCollapse}
            aria-label="Collapse CSS sidebar"
          >
            <PanelRightClose className="size-4" />
          </Button>
          <h2 className="text-sm font-semibold">Global CSS</h2>
        </div>
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
