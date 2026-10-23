import { Toast } from "~/components/ui/toast";
import { useDashboard } from "~/hooks";
import {
    DashboardMetricsCards,
    DashboardRecentCustomers,
    DashboardGrowthChart,
    DashboardRecentChats,
    DashboardTopCities,
    DashboardNewOrders
} from "./components";

export function DashboardDesktop() {
    const {
        isMounted,
        loading,
        showWelcomeToast,
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
        <div className="w-full min-h-[100vh] p-8 bg-[#F5F5F3] font-['Inter'] flex flex-col gap-6">
            {showWelcomeToast && <Toast title="Welcome back, Admin!" duration={5000} variant="success" />}

            {/* TIER 1: Top Metrics */}
            <DashboardMetricsCards statsData={statsData} loading={loading} />

            {/* TIER 2: Customers & Growth */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-6">
                <DashboardRecentCustomers recentCustomers={statsData.recentCustomers} />
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
                />
            </div>

            {/* TIER 3: Footer Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardRecentChats 
                    recentChats={statsData.recentChats} 
                    totalUnreadChat={statsData.totalUnreadChat} 
                />
                <DashboardTopCities />
                <DashboardNewOrders newOrders={statsData.newOrders} />
            </div>
        </div>
    );
}
