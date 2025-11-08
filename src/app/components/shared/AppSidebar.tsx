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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/app/components/ui/sidebar";
import { useNavigateTo } from "@/hooks/use-navigate";
import {
  AppWindow,
  Calendar,
  CalendarDays,
  ChevronDown,
  GitGraph,
  Home,
  Inbox,
  Search,
  Table,
  BarChart3,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType;
  subItems?: SidebarItem[];
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
    subItems: [
      {
        title: "Subitem 1",
        url: "/dashboard/subitem1",
        icon: Inbox,
      },
      {
        title: "Subitem 2",
        url: "/dashboard/subitem2",
        icon: Inbox,
      },
    ],
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
    subItems: [
      {
        title: "Subitem 1",
        url: "/dashboard/subitem1",
        icon: Inbox,
      },
      {
        title: "Subitem 2",
        url: "/dashboard/subitem2",
        icon: Inbox,
      },
    ],
  },
  // {
  //   title: "Container Demo",
  //   url: "/container-demo",
  //   icon: Box,
  // },
  {
    title: "Visualizador",
    url: "/visualizer",
    icon: GitGraph,
  },
  {
    title: "Turnos",
    url: "/appointments",
    icon: CalendarDays,
    subItems: [
      {
        title: "Subitem 1",
        url: "/dashboard/subitem1",
        icon: Inbox,
      },
      {
        title: "Subitem 2",
        url: "/dashboard/subitem2",
        icon: Inbox,
      },
    ],
  },
  {
    title: "Documentos",
    url: "/sources/viewer",
    icon: AppWindow,
  },
  {
    title: "Busqueda semantica",
    url: "/semantic-search",
    icon: Search,
  },
  {
    title: "Dashboard 3D",
    url: "/dashboard-3d",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const navigate = useNavigateTo();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center h-12">
          <span className="text-lg font-bold">Mi App</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              const isActive = location.pathname === item.url;
              const hasSubItems = item.subItems && item.subItems.length > 0;

              if (hasSubItems) {
                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => navigate(item.url)}
                          className={isActive ? "border border-primary" : ""}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems!.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                onClick={() => navigate(subItem.url)}
                              >
                                <subItem.icon />
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              } else {
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
              }
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
