import { Toast } from "~/components/ui/toast";
import { useDashboard } from "~/hooks";
import {
    DashboardMetricsCards,
    DashboardRecentCustomers,
    DashboardGrowthChart,
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
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        showDropdown,
        setShowDropdown,
        showYearDropdown,
        setShowYearDropdown,
        showMonthDropdown,
        setShowMonthDropdown,
        dropdownRef,
        yearDropdownRef,
        monthDropdownRef,
        years,
        filteredMonths,
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
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    showYearDropdown={showYearDropdown}
                    setShowYearDropdown={setShowYearDropdown}
                    showMonthDropdown={showMonthDropdown}
                    setShowMonthDropdown={setShowMonthDropdown}
                    dropdownRef={dropdownRef}
                    yearDropdownRef={yearDropdownRef}
                    monthDropdownRef={monthDropdownRef}
                    years={years}
                    filteredMonths={filteredMonths}
                    currentTotal={currentTotal}
                    activeData={activeData}
                    statsData={statsData}
                    loading={loading}
                    isMounted={isMounted}
                    chartScrollRef={chartScrollRef}
                />
            </div>

            {/* TIER 3: Footer Cards */}
            <div className="w-full">
                <DashboardNewOrders newOrders={statsData.newOrders} />
            </div>
        </div>
    );
}
