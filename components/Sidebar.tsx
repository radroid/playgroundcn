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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GlobalCssEditor } from "./GlobalCssEditor";

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
    <SidebarRoot variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex h-10 items-center px-2 text-sm font-semibold">
          <Link href="/" className="hover:underline">
            PlaygroundCn
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <Tabs defaultValue="components" className="flex flex-col h-full min-h-0">
          <div className="shrink-0 px-2 pb-2">
            <TabsList className="w-full">
              <TabsTrigger value="components" className="flex-1">
                Components
              </TabsTrigger>
              <TabsTrigger value="global-css" className="flex-1">
                Global CSS
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="components" className="flex-1 min-h-0 overflow-y-auto mt-0 pb-10">
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
                        <Link
                          href={item.href}
                          className="flex w-full items-center"
                        >
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </TabsContent>

          <TabsContent value="global-css" className="flex-1 min-h-0 overflow-hidden mt-0 pb-6 px-2">
            <GlobalCssEditor />
          </TabsContent>
        </Tabs>
      </SidebarContent>
    </SidebarRoot>
  );
}
