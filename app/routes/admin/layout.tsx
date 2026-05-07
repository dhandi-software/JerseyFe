import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  UserPlus,
  Users,
  Settings,
  FileText,
  BarChart3,
  ShoppingBag
} from "lucide-react";
import { Outlet, useRouteLoaderData } from "react-router";
import { ProtectedRoute } from "~/routes/ProtectedRoute";
import { RoleGuard } from "~/routes/RoleGuard";
import { useAuth } from "~/hooks/useAuth";
import { chatService } from "~/services/chatService";
import type { ContextType } from "~/root";
import React from "react";
import { MessageSquare } from "lucide-react";

import { SidebarProvider, Sidebar, SidebarContent, useSidebar, SidebarTrigger } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type MenuKey =
  | "dashboard"
  | "users"
  | "monitoring-pesanan"
  | "chat"
  | "logout";

const pathToKey = (pathname: string): MenuKey | undefined => {
  if (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/create-account") || pathname.startsWith("/admin/edit-account")) return "users";
  if (pathname.startsWith("/admin/monitoring-pesanan")) return "monitoring-pesanan";
  if (pathname.startsWith("/admin/chat")) return "chat";
  if (pathname === "/admin" || pathname.startsWith("/admin/"))
    return "dashboard";
  return undefined;
};

const menuItems = [
  {
    key: "dashboard" as MenuKey,
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    key: "users" as MenuKey,
    title: "User Management",
    icon: Users,
    url: "/admin/users",
  },
  {
    key: "monitoring-pesanan" as MenuKey,
    title: "Monitoring Pesanan",
    icon: ShoppingBag,
    url: "/admin/monitoring-pesanan",
  },
  {
    key: "chat" as MenuKey,
    title: "Chat",
    icon: MessageSquare,
    url: "/admin/chat",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();
  const rootData = useRouteLoaderData("root") as { isMobile: boolean };
  const active = pathToKey(location.pathname) ?? "dashboard";

  const [unreadCount, setUnreadCount] = React.useState(0);
  const memoizedMenuItems = React.useMemo(() => menuItems, []);

  const handleNavigate = React.useCallback((key: MenuKey) => {
    const item = memoizedMenuItems.find((item) => item.key === key);
    if (item) {
      if (isMobile) setOpenMobile(false);
      navigate(item.url);
      return;
    }

    if (key === "logout") {
        logout();
    }
  }, [isMobile, navigate, logout, setOpenMobile, memoizedMenuItems]);

  React.useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return;
      try {
        const data = await chatService.getUnreadCount(user.id);
        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Failed to fetch unread chat count:", error);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <Sidebar className="border-r border-[#E5E5E5] bg-white overflow-y-hidden">
      <SidebarContent className="bg-[#FAFAFA] flex flex-col py-8 px-6 custom-scrollbar">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center w-full px-2">
          <div className="bg-slate-900 p-4 rounded-xl w-full flex justify-center shadow-lg border border-slate-800">
            <img
              src="/images/FSCV.png"
              alt="Logo FSCV"
              className="h-16 w-auto object-contain mx-auto"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 flex-1">
          {/* Menu Section */}
          <div className="flex flex-col gap-4">
            <h2 className="px-3 text-[1rem] font-bold text-[#A1A1A1] tracking-wider uppercase">
              Admin Menu
            </h2>
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const isActive = active === item.key;
                const IconComponent = item.icon;

                return (
                  <div key={item.key} className="flex flex-col gap-1">
                    <div
                      onClick={() => handleNavigate(item.key)}
                      className={cn(
                        "group flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200",
                        isActive ? "bg-[#FFF0EB]" : "hover:bg-gray-50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full w-8 h-8 shrink-0 transition-colors",
                          isActive ? "bg-[#D25026]" : "bg-[#A1A1A1] group-hover:bg-gray-400"
                        )}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                      </div>
                      <span
                        className={cn(
                          "flex-1 font-medium text-[1rem] transition-colors",
                          isActive ? "text-[#D25026]" : "text-[#A1A1A1] group-hover:text-gray-600"
                        )}
                      >
                        {item.title}
                      </span>
                      {item.key === "chat" && unreadCount > 0 && (
                        <span className="bg-[#D25026] text-white text-[0.7rem] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-auto">
          <button
            onClick={() => handleNavigate("logout")}
            className="w-full flex items-center gap-4 px-4 py-3 bg-white border border-[#E5E5E5] rounded-sm hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-black" />
            <span className="font-medium text-[1rem] text-black">Log Out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const { isMobile } = useRouteLoaderData<ContextType>("root") as ContextType;
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["admin"]}>
        <SidebarProvider isMobile={isMobile}>
          <div className="flex w-full h-screen overflow-hidden bg-neutral-50">
            <AppSidebar />
            <main className={cn(
              "flex-1 w-full h-full overflow-y-auto",
              "pb-12" // simplified
            )}>
              {/* Mobile Header with Hamburger Menu */}
              {isMobile && (
                <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                  <SidebarTrigger className="p-2 -ml-2" />
                  <span className="ml-2 font-bold text-[#119DA4] text-lg tracking-tight">Admin Panel</span>
                </div>
              )}
              <Outlet context={{ isMobile }} />
            </main>
          </div>
        </SidebarProvider>
      </RoleGuard>
    </ProtectedRoute>
  );
}
