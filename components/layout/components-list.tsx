"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAppLayout } from "./app-layout-provider";
import { components } from "@/lib/registry/components";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarItem = {
  href: string;
  label: string;
};

export function ComponentsList() {
  const pathname = usePathname();
  const { isMobile, setLeftOpen } = useAppLayout();

  const registryItems: SidebarItem[] = components.map((component) => ({
    href: `/component/${component.id}`,
    label: component.displayName,
  }));

  const handleClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("tweakcn:before-component-change"));
    }
    // Close sidebar on mobile after selection
    if (isMobile) {
      setLeftOpen(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <h2 className="text-sm font-semibold">
          Components
        </h2>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2">

          <nav className="flex flex-col gap-1">
            {registryItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClick}
                  className={cn(
                    "flex items-center rounded-md px-2 py-1.5 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive &&
                      "bg-accent font-medium text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
}
