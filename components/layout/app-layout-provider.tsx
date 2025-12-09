"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const LEFT_SIDEBAR_WIDTH = "18rem";
const LEFT_SIDEBAR_WIDTH_COLLAPSED = "3rem";
const LEFT_SIDEBAR_MIN_WIDTH = "12rem";
const LEFT_SIDEBAR_MAX_WIDTH = "30rem";
const RIGHT_SIDEBAR_WIDTH = "18rem";
const RIGHT_SIDEBAR_WIDTH_COLLAPSED = "3rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";

type AppLayoutContextProps = {
  leftOpen: boolean;
  rightOpen: boolean;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  leftWidth: number;
  isMobile: boolean;
  setLeftOpen: (open: boolean) => void;
  setRightOpen: (open: boolean) => void;
  setLeftCollapsed: (collapsed: boolean) => void;
  setRightCollapsed: (collapsed: boolean) => void;
  setLeftWidth: (width: number) => void;
  toggleLeft: () => void;
  toggleRight: () => void;
  toggleLeftCollapse: () => void;
  toggleRightCollapse: () => void;
};

const AppLayoutContext = React.createContext<AppLayoutContextProps | null>(
  null
);

export function useAppLayout() {
  const context = React.useContext(AppLayoutContext);
  if (!context) {
    throw new Error("useAppLayout must be used within an AppLayoutProvider.");
  }
  return context;
}

type AppLayoutProviderProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppLayoutProvider({ children, className }: AppLayoutProviderProps) {
  const isMobile = useIsMobile();
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [rightOpen, setRightOpen] = React.useState(false);
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);
  // Default left sidebar width: 18rem = 288px (assuming 1rem = 16px)
  const [leftWidth, setLeftWidth] = React.useState(288);

  const toggleLeft = React.useCallback(() => {
    setLeftOpen((prev) => !prev);
  }, []);

  const toggleRight = React.useCallback(() => {
    setRightOpen((prev) => !prev);
  }, []);

  const toggleLeftCollapse = React.useCallback(() => {
    setLeftCollapsed((prev) => !prev);
  }, []);

  const toggleRightCollapse = React.useCallback(() => {
    setRightCollapsed((prev) => !prev);
  }, []);

  const contextValue = React.useMemo<AppLayoutContextProps>(
    () => ({
      leftOpen,
      rightOpen,
      leftCollapsed,
      rightCollapsed,
      leftWidth,
      isMobile,
      setLeftOpen,
      setRightOpen,
      setLeftCollapsed,
      setRightCollapsed,
      setLeftWidth,
      toggleLeft,
      toggleRight,
      toggleLeftCollapse,
      toggleRightCollapse,
    }),
    [leftOpen, rightOpen, leftCollapsed, rightCollapsed, leftWidth, isMobile, toggleLeft, toggleRight, toggleLeftCollapse, toggleRightCollapse]
  );

  return (
    <AppLayoutContext.Provider value={contextValue}>
      <div
        style={
          {
            "--left-sidebar-width": LEFT_SIDEBAR_WIDTH,
            "--left-sidebar-width-collapsed": LEFT_SIDEBAR_WIDTH_COLLAPSED,
            "--left-sidebar-min-width": LEFT_SIDEBAR_MIN_WIDTH,
            "--left-sidebar-max-width": LEFT_SIDEBAR_MAX_WIDTH,
            "--right-sidebar-width": RIGHT_SIDEBAR_WIDTH,
            "--right-sidebar-width-collapsed": RIGHT_SIDEBAR_WIDTH_COLLAPSED,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
          } as React.CSSProperties
        }
        className={cn("flex h-screen w-full flex-col overflow-hidden", className)}
      >
        {children}
      </div>
    </AppLayoutContext.Provider>
  );
}
