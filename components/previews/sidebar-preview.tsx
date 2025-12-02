import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bell,
  Home,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"

export function SidebarDemo() {
  return (
    <SidebarProvider>
      <div className="bg-background flex h-[520px] w-full overflow-hidden rounded-xl border">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold">
                AC
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">
                  Acme Inc
                </span>
                <span className="text-xs text-muted-foreground">
                  Sales dashboard
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LineChart className="mr-2 h-4 w-4" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Products</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Customers</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label="View updates">
                      <Badge
                        variant="outline"
                        className="border-sidebar-border bg-sidebar rounded-md px-1 text-[10px] font-medium"
                      >
                        New
                      </Badge>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium leading-none">
                      Olivia Martin
                    </span>
                    <span className="text-xs text-muted-foreground">
                      olivia@acme.inc
                    </span>
                  </div>
                </SidebarMenuButton>
                <SidebarMenuBadge>4</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex flex-col gap-0.5">
              <h1 className="text-sm font-semibold leading-none">
                Sales overview
              </h1>
              <p className="text-xs text-muted-foreground">
                Track your revenue, customers, and trends.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Open notifications</span>
              </Button>
              <Button size="sm" className="h-8 text-xs">
                New report
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border-muted bg-muted/40 flex flex-col gap-2 rounded-lg border p-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Total revenue
                </span>
                <span className="text-xl font-semibold">$82,450</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  +18.2% compared to last month
                </span>
              </div>
              <div className="border-muted bg-muted/40 flex flex-col gap-2 rounded-lg border p-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Active customers
                </span>
                <span className="text-xl font-semibold">1,204</span>
                <span className="text-xs text-muted-foreground">
                  +86 new this week
                </span>
              </div>
              <div className="border-muted bg-muted/40 flex flex-col gap-2 rounded-lg border p-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Open orders
                </span>
                <span className="text-xl font-semibold">32</span>
                <span className="text-xs text-muted-foreground">
                  7 need attention
                </span>
              </div>
            </div>
            <div className="border-muted bg-muted/40 flex flex-1 flex-col justify-center rounded-lg border p-6 text-center text-xs text-muted-foreground">
              This area represents your main application content. Use{" "}
              <span className="font-medium">SidebarProvider</span>,{" "}
              <span className="font-medium">Sidebar</span>, and{" "}
              <span className="font-medium">SidebarInset</span> together to
              build responsive layouts that work great on both desktop and
              mobile.
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default SidebarDemo


