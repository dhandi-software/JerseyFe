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
    <Sidebar className="border-r border-[#E5E5E5] bg-white overflow-y-hidden">
      <SidebarContent className="bg-[#FAFAFA] flex flex-col py-8 px-6 custom-scrollbar">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center w-full px-2">
          <div className="bg-slate-900 p-4 rounded-xl w-full flex justify-center shadow-lg border border-slate-800">
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
            <h2 className="px-3 text-[1rem] font-bold text-[#A1A1A1] tracking-wider uppercase">
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
                        <IconComponent className="w-5 h-5 text-white" />
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

export default function CustomerLayout() {
  const location = useLocation();
  const { isMobile } = useRouteLoaderData<ContextType>("root") as ContextType;
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["mahasiswa", "customer"]}>
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
