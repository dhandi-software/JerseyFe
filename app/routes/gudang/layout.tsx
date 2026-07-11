import { useLocation, useNavigate } from "react-router";
import {
  LogOut,
  Package,
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
  | "packing"
  | "logout";

const pathToKey = (pathname: string): MenuKey | undefined => {
  if (
    pathname === "/gudang" ||
    pathname.startsWith("/gudang/dashboard") ||
    pathname.startsWith("/gudang/bahan-baju")
  )
    return "dashboard";
  if (pathname.startsWith("/gudang/packing")) return "packing";
  return undefined;
};

const menuItems = [
  {
    key: "dashboard" as MenuKey,
    title: "Management Bahan",
    icon: Package,
    url: "/gudang",
  },
  {
    key: "packing" as MenuKey,
    title: "Packing Pesanan",
    icon: Package,
    url: "/gudang/packing",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setOpenMobile, isMobile } = useSidebar();
  const active = pathToKey(location.pathname) ?? "dashboard";

  const handleNavigate = React.useCallback((key: MenuKey) => {
    const item = menuItems.find((item) => item.key === key);
    if (item) {
      if (isMobile) setOpenMobile(false);
      navigate(item.url);
      return;
    }

    if (key === "logout") {
        logout();
    }
  }, [isMobile, navigate, logout, setOpenMobile]);

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
              Warehouse Menu
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-auto flex flex-col gap-2">
           <div className="px-4 py-3 bg-slate-100 rounded-xl border border-slate-200">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Login Sebagai:</p>
               <p className="text-sm font-black text-slate-900">{(user as any)?.staff?.nama || (user as any)?.username || "Staf Gudang"}</p>
           </div>
          <button
            onClick={() => handleNavigate("logout")}
            className="w-full flex items-center gap-4 px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-black" />
            <span className="font-medium text-[1rem] text-black">Log Out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function WarehouseLayout() {
  const data = useRouteLoaderData<ContextType>("root");
  const isMobile = data ? (data as ContextType).isMobile : false;
  
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["gudang", "admin"]}>
        <SidebarProvider isMobile={isMobile}>
          <div className="flex w-full h-screen bg-slate-50 font-geist">
            <AppSidebar />
            <main className={cn(
              "flex-1 w-full h-full overflow-y-auto"
            )}>
              {/* Mobile Header */}
              {isMobile && (
                <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                  <SidebarTrigger className="p-2 -ml-2" />
                  <span className="ml-2 font-bold text-[#D25026] text-lg tracking-tight uppercase italic">Portal Gudang</span>
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
