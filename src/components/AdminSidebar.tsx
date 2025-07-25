import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Image, 
  Users, 
  Settings, 
  LogOut,
  UserCheck,
  Mail,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/admin", 
    icon: LayoutDashboard,
    exact: true
  },
  { 
    title: "Banners", 
    url: "/admin/banners", 
    icon: Image
  },
  { 
    title: "Recrutamentos", 
    url: "/admin/recruitments", 
    icon: Users
  },
  { 
    title: "Contatos", 
    url: "/admin/contacts", 
    icon: Mail
  },
  { 
    title: "Usuários Admin", 
    url: "/admin/users", 
    icon: UserCheck
  },
  { 
    title: "Segurança", 
    url: "/admin/security", 
    icon: Shield
  },
  { 
    title: "Configurações", 
    url: "/admin/settings", 
    icon: Settings
  },
];

export const AdminSidebar = () => {
  const { logout } = useAdminAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { state } = useSidebar();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">DC</span>
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <h2 className="font-semibold text-sm">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">DreamCore Gaming</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url, item.exact)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};