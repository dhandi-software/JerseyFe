import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { cn } from "~/lib/utils";
import type { DashboardRecentCustomer } from "~/types";

interface DashboardRecentCustomersProps {
    recentCustomers: (DashboardRecentCustomer & { isAdminOrder?: boolean })[];
    isMobile?: boolean;
}

export function DashboardRecentCustomers({ recentCustomers, isMobile }: DashboardRecentCustomersProps) {
    return (
        <div className={cn(
            "bg-white rounded-2xl py-6 flex flex-col shadow-sm border border-transparent",
            isMobile ? "p-5" : "h-full min-h-[25rem]"
        )}>
            <div className={cn("flex justify-between items-center mb-6", !isMobile && "px-6")}>
                <div className="text-slate-900 text-xl font-semibold">Customers</div>
                <span className="text-slate-400 text-xs font-medium">Berdasarkan Pesanan Terbaru</span>
            </div>
            
            <div className={cn("flex-1 flex flex-col overflow-y-auto gap-1", !isMobile && "px-4")}>
                {recentCustomers.length > 0 ? (
                    recentCustomers.map((customer, index) => (
                        <div
                            key={`${customer.nama}-${customer.id}-${index}`}
                            onClick={() => {
                                window.location.href = "/admin/monitoring-pesanan";
                            }}
                            className={cn(
                                "p-4 rounded-2xl flex items-center gap-3 transition-all group cursor-pointer",
                                index === 0 ? "bg-[#FFF0E5]" : "hover:bg-orange-50/50"
                            )}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                {customer.nama.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <div className="text-slate-900 text-sm font-semibold truncate">{customer.nama}</div>
                                </div>
                                <div className="text-slate-500 text-[11px] truncate flex items-center gap-1 mt-0.5">
                                    <span className="truncate opacity-70">{customer.category || "Pelanggan"}</span>
                                </div>
                            </div>
                            <div className={cn(
                                "flex items-center gap-2 pr-2 transition-opacity",
                                index === 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = "/admin/monitoring-pesanan";
                                    }}
                                    title="Lihat Pesanan"
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F] hover:bg-[#E85C2F] hover:text-white transition-all shadow-sm"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic py-10">
                        Belum ada data customer
                    </div>
                )}
            </div>

            <div className={cn("mt-4", !isMobile && "px-6")}>
                <button 
                    onClick={() => window.location.href = '/admin/monitoring-pesanan'}
                    className="text-[#E85C2F] text-sm font-medium flex items-center gap-1 hover:underline"
                >
                    Lihat semua pesanan <ArrowUpRight className="w-4 h-4 rotate-45" />
                </button>
            </div>
        </div>
    );
}
