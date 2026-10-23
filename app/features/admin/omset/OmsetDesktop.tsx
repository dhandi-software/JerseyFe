import { Calendar, FileText } from "lucide-react";
import { FinancialReportModal } from "~/components/FinancialReportModal";
import { cn } from "~/lib/utils";
import { useOmset } from "~/hooks";
import { OmsetOverviewCards } from "./components/OmsetOverviewCards";
import { OmsetChartCard } from "./components/OmsetChartCard";
import { OmsetHistoryCard } from "./components/OmsetHistoryCard";
import { TIME_VIEW_TABS, MONTHS } from "./constants";

export function OmsetDesktop() {
    const {
        loading,
        isMounted,
        timeView,
        setTimeView,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        showYearDropdown,
        setShowYearDropdown,
        showMonthDropdown,
        setShowMonthDropdown,
        isReportModalOpen,
        setIsReportModalOpen,
        yearDropdownRef,
        monthDropdownRef,
        chartScrollRef,
        statsData,
        years,
        activeData,
        currentTotal,
        filteredMonths
    } = useOmset();

    return (
        <div className="w-full min-h-screen p-8 bg-[#F5F5F3] font-['Inter'] flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-slate-900 text-3xl font-black italic uppercase tracking-tighter">
                        Omset & <span className="text-[#D25026]">Transaksi</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Laporan dan analisis omset penjualan jersey kustom FCSV Apparel.
                    </p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D25026]" />
                    <span className="text-xs font-bold text-slate-700">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <OmsetOverviewCards
                statsData={statsData}
                currentTotal={currentTotal}
                timeView={timeView}
            />

            {/* Tabs for Timeframes / Filter Indicator & Report Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
                {!selectedYear && !selectedMonth ? (
                    <div className="flex gap-2 bg-white/60 p-1.5 rounded-2xl border border-slate-200/50 w-fit self-center lg:self-start">
                        {TIME_VIEW_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setTimeView(tab.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer",
                                    timeView === tab.id
                                        ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/20"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#D25026]/10 text-[#D25026] px-4 py-2.5 rounded-xl border border-[#D25026]/20 w-fit self-center lg:self-start flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D25026] animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Rincian Terfilter: {selectedYear && `Tahun ${selectedYear}`} {selectedMonth && `- ${MONTHS[selectedMonth - 1]?.label}`} ({selectedMonth ? 'Harian' : 'Bulanan'})
                        </span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                >
                    <FileText className="w-4 h-4 text-[#D25026]" />
                    Cetak Laporan Lengkap
                </button>
            </div>

            {/* Main Content: Chart & Table Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <OmsetChartCard
                    loading={loading}
                    isMounted={isMounted}
                    activeData={activeData}
                    currentTotal={currentTotal}
                    timeView={timeView}
                    setTimeView={setTimeView}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    showYearDropdown={showYearDropdown}
                    setShowYearDropdown={setShowYearDropdown}
                    showMonthDropdown={showMonthDropdown}
                    setShowMonthDropdown={setShowMonthDropdown}
                    yearDropdownRef={yearDropdownRef}
                    monthDropdownRef={monthDropdownRef}
                    chartScrollRef={chartScrollRef}
                    years={years}
                    filteredMonths={filteredMonths}
                />

                <OmsetHistoryCard
                    loading={loading}
                    isMounted={isMounted}
                    activeData={activeData}
                />
            </div>

            <FinancialReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
            />
        </div>
    );
}
