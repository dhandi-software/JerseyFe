// Customer Layout
import { Outlet, useLocation, useNavigate, useRouteLoaderData } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Trophy,
  User,
  ShoppingBag,
  Truck
} from "lucide-react";
import { ProtectedRoute } from "~/routes/ProtectedRoute";
import { RoleGuard } from "~/routes/RoleGuard";
import { useAuth } from "~/hooks/useAuth";
import type { ContextType } from "~/root";
import { chatService } from "~/services/chatService";
import { profileApi } from "~/api/profileApi";
import React from "react";
import { io } from "socket.io-client";
import { UPLOADS_URL } from "~/api/client";

import { SidebarProvider, Sidebar, SidebarContent, useSidebar, SidebarTrigger } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type MenuKey =
  | "dashboard"
  | "chat"
  | "profile"
  | "custom-jersey"
  | "progress-pesanan"
  | "logout";

const pathToKey = (pathname: string): MenuKey | undefined => {
  if (pathname.startsWith("/customer/chat")) return "chat";
  if (pathname.startsWith("/customer/profile")) return "profile";
  if (pathname.startsWith("/customer/custom-jersey")) return "custom-jersey";
  if (pathname.startsWith("/customer/progress-pesanan")) return "progress-pesanan";
  if (pathname === "/customer" || pathname.startsWith("/customer/"))
    return "dashboard";
  return undefined;
};

const menuItems = [
  {
    key: "dashboard" as MenuKey,
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/customer",
  },
  {
    key: "chat" as MenuKey,
    title: "Konsultasi Desain",
    icon: MessageCircle,
    url: "/customer/chat",
  },
  {
    key: "custom-jersey" as MenuKey,
    title: "Custom Jersey",
    icon: ShoppingBag,
    url: "/customer/custom-jersey",
  },
  {
    key: "progress-pesanan" as MenuKey,
    title: "Progress Pesanan",
    icon: Truck,
    url: "/customer/progress-pesanan",
  },
  {
    key: "profile" as MenuKey,
    title: "Profil Saya",
    icon: User,
    url: "/customer/profile",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();
  const rootData = useRouteLoaderData("root") as { isMobile: boolean };
  const _isMobile = rootData?.isMobile ?? isMobile;
  const active = pathToKey(location.pathname) ?? "dashboard";
  const { user } = useAuth(); // Needed for ID
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Fetch Chat Unread Count
      chatService.getUnreadCount(user.id)
        .then(data => setUnreadCount(data.count || 0))
        .catch(err => console.error("Sidebar Chat Error:", err));
    };
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  // Socket logic removed as academic timeline (acara) is disabled.
  // We can re-add for chat notifications if needed, but keeping it simple for now.

  const handleNavigate = (key: MenuKey) => {
    const item = menuItems.find((item) => item.key === key);
    if (item) {
      if (isMobile) setOpenMobile(false);
      navigate(item.url);
      return;
    }

    if (key === "logout") {
        logout();
    }
  };

  return (
    <Sidebar className="border-r-0 bg-slate-950 overflow-y-hidden">
      <SidebarContent className="bg-slate-950 flex flex-col py-8 px-6 custom-scrollbar text-slate-300">
        {/* Logo Section */}
        <div className="mb-10 flex justify-center w-full px-2">
          <div className="bg-white/5 p-4 rounded-2xl w-full flex justify-center shadow-inner border border-white/10">
            <img
              src="/images/FSCV.png"
              alt="Logo FSCV"
              className="h-14 w-auto object-contain mx-auto"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 flex-1">
          {/* Menu Section */}
          <div className="flex flex-col gap-4">
            <h2 className="px-3 text-xs font-black text-slate-500 tracking-[0.2em] uppercase mb-2">
              Menu Utama
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
                        <IconComponent className="w-5 h-5 text-current" />
                      </div>
                      <span
                        className={cn(
                          "flex-1 font-bold text-sm transition-colors",
                          isActive ? "text-[#D25026]" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      >
                        {item.title}
                      </span>
                      {item.key === "chat" && unreadCount > 0 && (
                        <div className="bg-[#00a884] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center shrink-0 min-w-[20px]">
                          {unreadCount}
                        </div>
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
           <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/10 mb-2">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Login Sebagai:</p>
               <p className="text-sm font-bold text-slate-200">{(user as any)?.nama || (user as any)?.username || "Customer"}</p>
           </div>
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

export default function CustomerLayout() {
  const location = useLocation();
  const { isMobile } = useRouteLoaderData<ContextType>("root") as ContextType;
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["customer"]}>
        <SidebarProvider isMobile={isMobile}>
          <div className="flex w-full h-screen overflow-hidden bg-neutral-50">
            <AppSidebar />
            <main className={cn(
              "flex-1 w-full h-full overflow-y-auto",
              location.pathname.includes("/chat") ? "pb-0" : "pb-12"
            )}>
              {/* Mobile Header with Hamburger Menu */}
              {isMobile && !location.pathname.includes("/chat") && (
                <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                  <SidebarTrigger className="p-2 -ml-2 text-gray-700" />
                  <span className="ml-2 font-bold text-[#D25026] text-lg tracking-tight">FSCV Customer</span>
                </div>
              )}
              {isMobile && location.pathname.includes("/chat") && (
                <div className="md:hidden absolute top-4 left-4 z-50">
                   <SidebarTrigger className="p-2 bg-white rounded-full shadow-md text-gray-700" />
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
