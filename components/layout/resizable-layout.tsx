"use client";

import * as React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useAppLayout } from "./app-layout-provider";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { MainContent } from "./main-content";
import { ComponentsList } from "./components-list";
import { GlobalCssPanel } from "./global-css-panel";

type ResizableLayoutProps = {
  children: React.ReactNode;
};

export function ResizableLayout({ children }: ResizableLayoutProps) {
  const { leftCollapsed, leftWidth, setLeftWidth, isMobile } = useAppLayout();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate min/max sizes in percentage based on CSS variables
  // 12rem = 192px, 30rem = 480px, 3rem = 48px
  // IMPORTANT: All hooks (including useCallback) must be called before any early returns
  const getSizeConstraints = React.useCallback(() => {
    if (!mounted || typeof window === "undefined") {
      return { min: 15, max: 30, default: 20 };
    }
    
    const viewportWidth = window.innerWidth;
    
    if (leftCollapsed) {
      // Collapsed: 3rem = 48px
      const collapsedSize = (48 / viewportWidth) * 100;
      return {
        min: Math.max(2, collapsedSize),
        max: Math.max(2, collapsedSize),
        default: Math.max(2, collapsedSize)
      };
    }
    
    // Expanded: 12rem (192px) to 30rem (480px)
    const minPixels = 192; // 12rem
    const maxPixels = 480; // 30rem
    const minPercent = (minPixels / viewportWidth) * 100;
    const maxPercent = (maxPixels / viewportWidth) * 100;
    
    // Calculate default based on stored width or default 18rem (288px)
    const defaultPixels = leftWidth > 0 ? leftWidth : 288;
    const defaultPercent = (defaultPixels / viewportWidth) * 100;
    
    return {
      min: Math.max(10, Math.min(25, minPercent)),
      max: Math.max(20, Math.min(40, maxPercent)),
      default: Math.max(minPercent, Math.min(maxPercent, defaultPercent))
    };
  }, [mounted, leftCollapsed, leftWidth]);

  const sizeConstraints = getSizeConstraints();

  const handleResize = React.useCallback((size: number) => {
    if (typeof window !== "undefined" && !leftCollapsed) {
      // Convert percentage to pixels for storage
      const widthInPixels = (size / 100) * window.innerWidth;
      setLeftWidth(widthInPixels);
    }
  }, [setLeftWidth, leftCollapsed]);

  // Don't use resizable on mobile - but all hooks must be called first
  if (isMobile) {
    return (
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar>
          <ComponentsList />
        </LeftSidebar>
        <MainContent className="p-4">{children}</MainContent>
        <RightSidebar>
          <GlobalCssPanel />
        </RightSidebar>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex flex-1 overflow-hidden h-full">
      <ResizablePanel
        defaultSize={sizeConstraints.default}
        minSize={sizeConstraints.min}
        maxSize={sizeConstraints.max}
        onResize={handleResize}
        collapsible={false}
        className="h-full"
      >
        <LeftSidebar>
          <ComponentsList />
        </LeftSidebar>
      </ResizablePanel>
      {!leftCollapsed && <ResizableHandle />}
      <ResizablePanel defaultSize={undefined} minSize={30} className="h-full">
        <div className="flex flex-1 overflow-hidden h-full">
          <MainContent className="p-4">{children}</MainContent>
          <RightSidebar>
            <GlobalCssPanel />
          </RightSidebar>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
