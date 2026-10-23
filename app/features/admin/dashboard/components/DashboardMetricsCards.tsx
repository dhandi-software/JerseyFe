import type { DashboardStatsData } from "~/types";

interface DashboardMetricsCardsProps {
    statsData: DashboardStatsData;
    loading: boolean;
}

export function DashboardMetricsCards({ statsData, loading }: DashboardMetricsCardsProps) {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Total Pendapatan Card */}
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                <div>
                    <div className="text-slate-900 text-xl font-semibold mb-2">Total Pendapatan</div>
                    <div className="flex items-baseline gap-2">
                        <div className="text-slate-900 text-3xl font-bold">
                            Rp {statsData.totalRevenue.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm mt-1">
                        {statsData.totalRevenue > 0 ? "Akumulasi omset bruto" : "Belum ada data transaksi"}
                    </div>
                </div>
            </div>

            {/* Total Customer Card */}
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                <div>
                    <div className="text-slate-900 text-xl font-semibold mb-2">Total Customer</div>
                    <div className="flex items-baseline gap-2">
                        <div className="text-slate-900 text-5xl font-medium">
                            {loading ? "..." : statsData.totalCustomer}
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Total customer aktif di sistem</div>
                </div>
            </div>

            {/* Total Designer Card */}
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                <div>
                    <div className="text-slate-900 text-xl font-semibold mb-2">Total Designer</div>
                    <div className="flex items-baseline gap-2">
                        <div className="text-slate-900 text-5xl font-medium">
                            {loading ? "..." : statsData.totalStaff}
                        </div>
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Desainer dan Staff aktif</div>
                </div>
            </div>

            {/* Total Gudang Card */}
            <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                <div>
                    <div className="text-slate-900 text-xl font-semibold mb-2">Total Gudang (Admin)</div>
                    <div className="text-slate-900 text-5xl font-medium">
                        {loading ? "..." : statsData.totalAdmin}
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Admin yang mengelola pesanan</div>
                </div>
            </div>
        </div>
    );
}
