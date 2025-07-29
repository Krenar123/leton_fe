
import { useState } from "react";
import { LayoutDashboard, FolderOpen, Calendar, Users, Building2, FileText, User, UserCheck } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const navigationItems = [{
  title: "Dashboard",
  url: "/",
  icon: LayoutDashboard
}, {
  title: "Projects",
  url: "/projects",
  icon: FolderOpen
}, {
  title: "Calendar",
  url: "/calendar",
  icon: Calendar
}, {
  title: "Team",
  url: "/team",
  icon: UserCheck
}, {
  title: "Clients",
  url: "/clients",
  icon: Users
}, {
  title: "Vendors",
  url: "/suppliers",
  icon: Building2
}, {
  title: "Reports",
  url: "/reports",
  icon: FileText
}, {
  title: "Profile",
  url: "/settings",
  icon: User
}];

export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) ? "bg-blue-100 text-blue-800 font-medium border-r-3 border-blue-600" : "text-white hover:bg-slate-700 hover:text-gray-100";
  };

  return <Sidebar className={isCollapsed ? "w-14" : "w-56"} collapsible="icon">
      <SidebarContent className="border-r border-slate-700 bg-gradient-to-br from-[#0a1f44] via-[#0a1f44] to-[#0d2654] relative">
        {/* Subtle overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 opacity-50" />
        
        {/* Content with higher z-index */}
        <div className="relative z-10">
          <div className="p-4 border-b border-slate-700">
            {!isCollapsed ? <h1 className="text-lg font-bold text-white">Leton</h1> : <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PF</span>
              </div>}
          </div>
          
          <SidebarGroup className="px-2 py-3">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10 px-3">
                      <NavLink to={item.url} end={item.url === "/"} className={`flex items-center rounded-lg transition-all duration-200 ${getNavClassName(item.url)}`}>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>;
}
