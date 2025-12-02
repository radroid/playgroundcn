"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const NAV_ITEMS: SidebarItem[] = [{ href: "/", label: "Home" }];

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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>{item.label}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarMenu>
            {registryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild size="sm" isActive={isActive}>
                    <Link href={item.href}>{item.label}</Link>
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
