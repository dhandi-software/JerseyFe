import { Plus } from "lucide-react";
import type { DashboardNewOrder } from "~/types";

interface DashboardNewOrdersProps {
    newOrders: DashboardNewOrder[];
}

export function DashboardNewOrders({ newOrders }: DashboardNewOrdersProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-transparent">
            <div className="text-slate-900 text-xl font-semibold mb-4">Pesanan Baru</div>
            <div className="grid grid-cols-2 gap-2">
                {newOrders.length > 0 ? (
                    newOrders.map((order, i) => (
                        <div 
                            key={i} 
                            onClick={() => window.location.href = '/admin/monitoring-pesanan'}
                            className="w-full flex justify-between items-center px-4 py-3 bg-[#FFF0E5] text-[#E85C2F] rounded-xl text-sm font-semibold transition-all hover:bg-[#FDE8DF] cursor-pointer"
                        >
                            <span className="truncate pr-2">{order.name}</span>
                            <Plus className="w-4 h-4 shrink-0 text-[#E85C2F]" />
                        </div>
                    ))
                ) : (
                    <div className="text-slate-400 text-sm italic col-span-2">Belum ada pesanan baru</div>
                )}
            </div>
        </div>
    );
}
