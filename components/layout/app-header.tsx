"use client";

import Link from "next/link";
import Image from "next/image";
import { MenuIcon, PanelRightIcon, Code, ImageIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { useAppLayout } from "./app-layout-provider";
import { GlobalSearch } from "@/components/GlobalSearch";
import { HeaderActions } from "@/components/HeaderActions";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function AppHeader() {
  const { isMobile, toggleLeft, toggleRight } = useAppLayout();
  const { resolvedTheme } = useTheme();

  const handleCopySvg = async () => {
    const svgPath = resolvedTheme === "dark" ? "/logo_dark.svg" : "/logo_light.svg";
    try {
      const response = await fetch(svgPath);
      const svgText = await response.text();
      await navigator.clipboard.writeText(svgText);
    } catch (error) {
      console.error("Failed to copy SVG:", error);
    }
  };

  const handleCopyPng = async () => {
    const pngPath = resolvedTheme === "dark" ? "/logo_dark.png" : "/logo_light.png";
    try {
      const response = await fetch(pngPath);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    } catch (error) {
      console.error("Failed to copy PNG:", error);
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <div className="max-w-[1440px] flex items-center justify-between mx-auto w-full">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={toggleLeft}
              aria-label="Open components sidebar"
            >
              <MenuIcon className="size-4" />
            </Button>
          )}
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Link href="/" className="flex items-center gap-1 text-sm font-semibold">
                <Image
                  src="/logo_light.svg"
                  alt="PlaygroundCn logo"
                  height={28}
                  width={28}
                  className="dark:hidden"
                />
                <Image
                  src="/logo_dark.svg"
                  alt="PlaygroundCn logo"
                  width={28}
                  height={28}
                  className="hidden dark:block"
                />
                <span className="text-md font-medium">Playground<span className="text-md font-bold text-muted-foreground">CN</span></span>
              </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onSelect={handleCopySvg}>
                <Code className="size-4" />
                Copy as .svg
              </ContextMenuItem>
              <ContextMenuItem onSelect={handleCopyPng}>
                <ImageIcon className="size-4" />
                Copy as .png
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>

        {!isMobile && (
          <div className="w-full max-w-xs">
            <GlobalSearch />
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          <HeaderActions />
          {isMobile && (
            <>
              <GlobalSearch />
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={toggleRight}
                aria-label="Open CSS sidebar"
              >
                <PanelRightIcon className="size-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
