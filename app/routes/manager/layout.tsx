import { useLocation, useNavigate } from "react-router";
import {
  LogOut,
  BarChart3,
  UserPlus,
  LayoutDashboard,
  Users,
  User
} from "lucide-react";
import { Outlet, useRouteLoaderData } from "react-router";
import { ProtectedRoute } from "~/routes/ProtectedRoute";
import { RoleGuard } from "~/routes/RoleGuard";
import { useAuth } from "~/hooks/useAuth";
import type { ContextType } from "~/root";
import React from "react";

import { SidebarProvider, Sidebar, SidebarContent, useSidebar, SidebarTrigger } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type MenuKey =
  | "dashboard"
  | "omset"
  | "users"
  | "create-account"
  | "profile"
  | "logout";

const pathToKey = (pathname: string): MenuKey | undefined => {
  if (pathname === "/manager" || pathname === "/manager/" || pathname.startsWith("/manager/dashboard"))
    return "dashboard";
  if (pathname.startsWith("/manager/omset")) return "omset";
  if (pathname.startsWith("/manager/users")) return "users";
  if (pathname.startsWith("/manager/create-account")) return "create-account";
  if (pathname.startsWith("/manager/profile")) return "profile";
  return undefined;
};

const menuItems = [
  {
    key: "dashboard" as MenuKey,
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/manager/dashboard",
  },
  {
    key: "users" as MenuKey,
    title: "Manajemen Pengguna",
    icon: Users,
    url: "/manager/users",
  },
  {
    key: "omset" as MenuKey,
    title: "Omset Transaksi",
    icon: BarChart3,
    url: "/manager/omset",
  },
  {
    key: "create-account" as MenuKey,
    title: "Buat Akun",
    icon: UserPlus,
    url: "/manager/create-account",
  },
  {
    key: "profile" as MenuKey,
    title: "Profil Saya",
    icon: User,
    url: "/manager/profile",
  },
];

export function ManagerSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();
  const active = pathToKey(location.pathname) ?? "omset";

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

  return (
    <Sidebar className="border-r-0 bg-slate-950 overflow-y-hidden">
      <SidebarContent className="bg-slate-950 flex flex-col py-8 px-6 custom-scrollbar text-slate-300">
        {/* Logo Section */}
        <div className="mb-10 flex justify-center w-full px-2">
          <div className="bg-white/5 p-4 rounded-2xl w-full flex justify-center shadow-inner border border-white/10">
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
            <h2 className="px-3 text-xs font-black text-slate-500 tracking-[0.2em] uppercase mb-2">
              Manager Menu
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

export default function ManagerLayout() {
  const { isMobile } = useRouteLoaderData<ContextType>("root") as ContextType;
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["manager"]}>
        <SidebarProvider isMobile={isMobile}>
          <div className="flex w-full h-screen overflow-hidden bg-neutral-50">
            <ManagerSidebar />
            <main className={cn(
              "flex-1 w-full h-full overflow-y-auto",
              "pb-12"
            )}>
              {/* Mobile Header with Hamburger Menu */}
              {isMobile && (
                <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                  <SidebarTrigger className="p-2 -ml-2" />
                  <span className="ml-2 font-bold text-[#119DA4] text-lg tracking-tight">Manager Panel</span>
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
