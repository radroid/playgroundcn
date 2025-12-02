"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { components } from "../lib/registry/components";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

type SidebarItem = {
  href: string;
  label: string;
};

export function Sidebar() {
  const pathname = usePathname();

  const registryItems: SidebarItem[] = components.map((component) => ({
    href: `/component/${component.id}`,
    label: component.displayName,
  }));

  return (
    <SidebarRoot collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex h-10 items-center px-2 text-sm font-semibold">
          PlaygroundCn
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarMenu>
            {registryItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    size="sm"
                    isActive={isActive}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new Event("tweakcn:before-component-change"),
                        );
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{
                        backgroundColor: "rgba(15, 23, 42, 0.06)",
                      }}
                      transition={{
                        type: "tween",
                        ease: "easeInOut",
                        duration: 0.18,
                      }}
                      className="rounded-md"
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </motion.div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </SidebarRoot>
  );
}
