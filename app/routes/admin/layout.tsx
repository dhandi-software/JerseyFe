import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  UserPlus,
  Users,
  Settings,
  FileText,
  BarChart3,
  ShoppingBag,
  Package,
  RotateCcw,
  User
} from "lucide-react";
import { Outlet, useRouteLoaderData } from "react-router";
import { ProtectedRoute } from "~/routes/ProtectedRoute";
import { RoleGuard } from "~/routes/RoleGuard";
import { useAuth } from "~/hooks/useAuth";
import { chatService } from "~/services/chatService";
import { adminApi } from "~/api/admin";
import { orderService } from "~/services/orderService";
import type { ContextType } from "~/root";
import React from "react";
import { MessageSquare } from "lucide-react";

import { SidebarProvider, Sidebar, SidebarContent, useSidebar, SidebarTrigger } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type MenuKey =
  | "dashboard"
  | "users"
  | "monitoring-pesanan"
  | "bahan-baju"
  | "chat"
  | "omset"
  | "retur-barang"
  | "buat-pesanan"
  | "profile"
  | "logout";

const pathToKey = (pathname: string): MenuKey | undefined => {
  if (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/create-account") || pathname.startsWith("/admin/edit-account")) return "users";
  if (pathname.startsWith("/admin/monitoring-pesanan")) return "monitoring-pesanan";
  if (pathname.startsWith("/admin/bahan-baju")) return "bahan-baju";
  if (pathname.startsWith("/admin/chat")) return "chat";
  if (pathname.startsWith("/admin/omset")) return "omset";
  if (pathname.startsWith("/admin/retur-barang")) return "retur-barang";
  if (pathname.startsWith("/admin/buat-pesanan")) return "buat-pesanan";
  if (pathname.startsWith("/admin/profile")) return "profile";
  if (pathname === "/admin" || pathname.endsWith("/admin") || pathname === "/admin/")
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
    key: "buat-pesanan" as MenuKey,
    title: "Buat Pesanan",
    icon: ShoppingBag,
    url: "/admin/buat-pesanan",
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
    key: "omset" as MenuKey,
    title: "Omset Transaksi",
    icon: BarChart3,
    url: "/admin/omset",
  },
  {
    key: "bahan-baju" as MenuKey,
    title: "Bahan Baju",
    icon: Package,
    url: "/admin/bahan-baju",
  },
  {
    key: "retur-barang" as MenuKey,
    title: "Retur Barang",
    icon: RotateCcw,
    url: "/admin/retur-barang",
  },
  {
    key: "chat" as MenuKey,
    title: "Chat",
    icon: MessageSquare,
    url: "/admin/chat",
  },
  {
    key: "profile" as MenuKey,
    title: "Profil Saya",
    icon: User,
    url: "/admin/profile",
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
  const [pendingCount, setPendingCount] = React.useState(0);
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
    const fetchPending = async () => {
      try {
        const data = await orderService.getOrders();
        if (Array.isArray(data)) {
          const count = data.filter((order: any) => {
            const status = (order.status || "").toUpperCase();
            return status === "MENUNGGU" || status === "MENUNGGU VERIFIKASI";
          }).length;
          setPendingCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch pending count:", error);
      }
    };
    fetchUnread();
    fetchPending();
    const interval = setInterval(() => {
        fetchUnread();
        fetchPending();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <Sidebar className="border-r-0 bg-slate-950 overflow-y-hidden">
      <SidebarContent className="bg-slate-950 flex flex-col py-8 px-6 custom-scrollbar text-slate-300">
        {/* Logo Section */}
        <div className="mb-10 flex justify-center w-full px-2">
          <div className="bg-white/5 p-4 rounded-2xl w-full flex justify-center shadow-inner border border-white/10">
            <img
              src="/images/FCSV.png"
              alt="Logo FCSV"
              className="h-16 w-auto object-contain mx-auto"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 flex-1">
          {/* Menu Section */}
          <div className="flex flex-col gap-4">
            <h2 className="px-3 text-xs font-black text-slate-500 tracking-[0.2em] uppercase mb-2">
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
                        "group flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300",
                        isActive ? "bg-[#D25026]/10 text-[#D25026] ring-1 ring-[#D25026]/20 shadow-lg shadow-[#D25026]/10" : "hover:bg-white/5 text-slate-400 hover:text-slate-200",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-xl w-10 h-10 shrink-0 transition-all duration-300",
                          isActive ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/40" : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                        )}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5 text-current" />}
                      </div>
                      <span
                        className={cn(
                          "flex-1 font-bold text-sm transition-colors",
                          isActive ? "text-[#D25026]" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      >
                        {item.title}
                      </span>
                      {item.key === "monitoring-pesanan" && pendingCount > 0 && (
                        <div className="relative flex items-center justify-center shrink-0 ml-auto mr-1">
                          <div className="relative w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-md border border-white">
                            <span className="text-white text-[10px] font-black leading-none">{pendingCount}</span>
                          </div>
                        </div>
                      )}
                      {item.key === "chat" && unreadCount > 0 && (
                        <span className="bg-[#D25026] text-white text-[0.7rem] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shrink-0 ml-2">
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
        <div className="mt-auto flex flex-col gap-2 pt-8">
          <button
            onClick={() => handleNavigate("logout")}
            className="w-full flex items-center gap-4 px-4 py-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
              <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
            </div>
            <span className="font-bold text-sm text-red-400 group-hover:text-red-300 transition-colors">Log Out</span>
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
