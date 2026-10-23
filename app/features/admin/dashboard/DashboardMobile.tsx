import { Menu } from "lucide-react";
import { useSidebar } from "~/components/ui/sidebar";
import { useDashboard } from "~/hooks";
import {
    DashboardRecentCustomers,
    DashboardGrowthChart,
    DashboardRecentChats,
    DashboardTopCities,
    DashboardNewOrders
} from "./components";

export function DashboardMobile() {
    const { setOpenMobile } = useSidebar();
    const {
        isMounted,
        loading,
        timeView,
        setTimeView,
        showDropdown,
        setShowDropdown,
        statsData,
        activeData,
        currentTotal,
        chartScrollRef
    } = useDashboard();

    return (
        <div className="w-full min-h-screen bg-[#F5F5F3] font-['Inter'] flex flex-col gap-4 p-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={() => setOpenMobile(true)}
                    className="p-2 -ml-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                >
                    <Menu className="w-6 h-6 text-slate-900" />
                </button>
                <div className="text-slate-900 text-2xl font-black">Overview</div>
            </div>

            {/* Total Pendapatan Card */}
            <div className="w-full bg-white rounded-2xl p-6 flex flex-col shadow-sm border border-transparent">
                <div className="text-slate-900 text-xl font-semibold mb-2">Total Pendapatan</div>
                <div className="text-slate-900 text-4xl font-bold">
                    Rp {statsData.totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="text-slate-500 text-sm mt-1">
                    {statsData.totalRevenue > 0 ? "Akumulasi omset bruto" : "Belum ada data transaksi"}
                </div>
            </div>

            {/* Total Customer Card */}
            <div className="w-full bg-white rounded-2xl p-6 flex flex-col shadow-sm border border-transparent">
                <div className="text-slate-900 text-xl font-semibold mb-2">Total Customer</div>
                <div className="text-slate-900 text-5xl font-medium">
                    {loading ? "..." : statsData.totalCustomer}
                </div>
                <div className="text-slate-500 text-sm mt-1">Total customer aktif</div>
            </div>

            {/* Total Designer & Gudang Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-transparent">
                    <div className="text-slate-900 text-base font-semibold mb-2">Designer</div>
                    <div className="text-slate-900 text-4xl font-medium">
                        {loading ? "..." : statsData.totalStaff}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-transparent">
                    <div className="text-slate-900 text-base font-semibold mb-2">Gudang</div>
                    <div className="text-slate-900 text-4xl font-medium">
                        {loading ? "..." : statsData.totalAdmin}
                    </div>
                </div>
            </div>

            {/* Growth Chart Section */}
            <DashboardGrowthChart
                timeView={timeView}
                setTimeView={setTimeView}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                currentTotal={currentTotal}
                activeData={activeData}
                statsData={statsData}
                loading={loading}
                isMounted={isMounted}
                chartScrollRef={chartScrollRef}
                isMobile={true}
            />

            {/* Customers Section */}
            <DashboardRecentCustomers 
                recentCustomers={statsData.recentCustomers} 
                isMobile={true} 
            />

            {/* Recent Chats Section */}
            <DashboardRecentChats 
                recentChats={statsData.recentChats} 
                totalUnreadChat={statsData.totalUnreadChat} 
            />

            {/* Top Cities */}
            <DashboardTopCities />

            {/* New Orders */}
            <DashboardNewOrders newOrders={statsData.newOrders} />
        </div>
    );
}
