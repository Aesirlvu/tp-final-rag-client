import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import { useNavigateTo } from "@/hooks/use-navigate";
import { Calendar, Home, Inbox, Box, Table, GitGraph } from "lucide-react";
import { useLocation } from "react-router-dom";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive?: boolean;
}

const items: SidebarItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: "Data Table",
    url: "/data-table",
    icon: Table,
  },
  {
    title: "Feature",
    url: "/feature",
    icon: Calendar,
  },
  {
    title: "Container Demo",
    url: "/container-demo",
    icon: Box,
  },
  {
    title: "Visualizador",
    url: "/visualizer",
    icon: GitGraph,
  },
];

export function AppSidebar() {
  const navigate = useNavigateTo();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className={isActive ? "border border-primary" : ""}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
