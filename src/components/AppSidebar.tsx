import {
  LayoutDashboard,
  Trophy,
  Database,
  Info,
  Search,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Risk Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Data Sources", url: "/data-sources", icon: Database },
  { title: "About", url: "/about", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive">
            <Search className="h-4 w-4 text-destructive-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-sidebar-primary">
                Follow the Money
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                Procurement Tracker
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground/80 hover:text-sidebar-primary"
                      activeClassName="text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        {!collapsed && user && (
          <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/40 px-2 py-1.5">
            <User className="h-3.5 w-3.5 text-sidebar-foreground/60 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-sidebar-foreground/80">{user.email}</p>
              <p className="text-[9px] uppercase tracking-widest text-sidebar-foreground/40">{user.role}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2 text-[10px] text-sidebar-foreground/40">
              <Shield className="h-3 w-3" />
              <span>TI-Kenya Compliant</span>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10"
                onClick={() => logout()}
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
