import { useState } from "react";
import { useSidebar } from "~/components/ui/sidebar";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from "recharts";
import {
    TrendingUp, BarChart3, ChevronDown, Menu, FileText
} from "lucide-react";
import { cn } from "~/lib/utils";
import { FinancialReportModal } from "~/components/FinancialReportModal";
import { useOmset } from "~/hooks";
import { TIME_VIEW_TABS, MONTHS } from "./constants";
import type { TimeView } from "~/types";

export function OmsetMobile() {
    const { setOpenMobile } = useSidebar();
    const [showDropdown, setShowDropdown] = useState(false);

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
        filteredMonths,
        exportOmsetPDF
    } = useOmset();

    const timeViewLabel = timeView === 'daily' 
        ? 'Harian' 
        : timeView === 'monthly' 
        ? 'Bulanan' 
        : timeView === 'yearly' 
        ? 'Tahunan' 
        : 'Lifetime';

    return (
        <div className="w-full min-h-screen bg-[#F5F5F3] font-['Inter'] flex flex-col gap-4 p-4 pb-20">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setOpenMobile(true)}
                        className="p-2 -ml-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                        aria-label="Buka menu"
                    >
                        <Menu className="w-6 h-6 text-slate-900" />
                    </button>
                    <div className="text-slate-900 text-2xl font-black">Omset Transaksi</div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center justify-center p-2.5 bg-[#D25026] hover:bg-[#b0401d] text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                        title="Cetak Laporan Keuangan"
                    >
                        <FileText className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={exportOmsetPDF}
                        className="flex items-center justify-center p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                        title="Unduh Laporan Grafik PDF"
                    >
                        <BarChart3 className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </div>

            {/* Total Revenue Card */}
            <div className="w-full bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-transparent">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider block">
                    Total Akumulasi Omset
                </div>
                <div className="text-slate-900 text-3xl font-black mt-1">
                    Rp {statsData.totalRevenue.toLocaleString('id-ID')}
                </div>
            </div>

            <FinancialReportModal 
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />

            {/* Timeframe Dropdown Selector / Filter Indicator */}
            {!selectedYear && !selectedMonth ? (
                <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                        Pilih Filter
                    </span>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-100"
                        >
                            <span className="text-slate-600 text-xs font-bold uppercase tracking-tight">
                                {timeViewLabel}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showDropdown && "rotate-180")} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {TIME_VIEW_TABS.map((tab) => (
                                    <button
                                        type="button"
                                        key={tab.id}
                                        onClick={() => {
                                            setTimeView(tab.id);
                                            setShowDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 text-xs transition-colors",
                                            timeView === tab.id ? "bg-orange-50 text-[#E85C2F] font-bold" : "text-slate-600 active:bg-slate-50"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-[#D25026]/10 text-[#D25026] px-4 py-3 rounded-2xl border border-[#D25026]/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D25026] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        Terfilter: {selectedYear && `Tahun ${selectedYear}`} {selectedMonth && `- ${MONTHS[selectedMonth - 1]?.label}`}
                    </span>
                </div>
            )}

            {/* Selected View Revenue Card */}
            <div className="w-full bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-transparent">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                    Omset Periode Terpilih ({timeViewLabel})
                </span>
                <span className="text-xl font-extrabold text-[#119DA4] block mt-1">
                    Rp {currentTotal.toLocaleString('id-ID')}
                </span>
            </div>

            {/* Chart Container */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-transparent flex flex-col min-h-[220px] min-w-0 overflow-hidden">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Grafik Pergerakan
                        </span>
                        {(selectedYear || selectedMonth) && (
                            <span className="text-[11px] font-extrabold text-[#D25026] mt-0.5">
                                Rp {currentTotal.toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>

                    {/* Filters near graph */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {/* Filter Tahun */}
                        <div ref={yearDropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowYearDropdown(!showYearDropdown);
                                    setShowMonthDropdown(false);
                                }}
                                className="flex items-center justify-between gap-1 bg-slate-50 border border-slate-200/80 pl-2 pr-5 py-1.5 rounded-lg text-slate-700 text-[10px] font-bold min-w-[80px] text-left cursor-pointer"
                            >
                                <span>{selectedYear ? `${selectedYear}` : "Semua Thn"}</span>
                                <ChevronDown className={cn("w-3 h-3 text-slate-400 absolute right-1 transition-transform duration-200", showYearDropdown && "rotate-180")} />
                            </button>

                            {showYearDropdown && (
                                <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedYear(undefined);
                                            setSelectedMonth(undefined);
                                            setTimeView('monthly');
                                            setShowYearDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-1.5 text-[10px] font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
                                            selectedYear === undefined ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                        )}
                                    >
                                        Semua Thn
                                    </button>
                                    {years.map((y) => (
                                        <button
                                            type="button"
                                            key={y}
                                            onClick={() => {
                                                setSelectedYear(y);
                                                setShowYearDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-3 py-1.5 text-[10px] font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
                                                selectedYear === y ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                            )}
                                        >
                                            Thn {y}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filter Bulan */}
                        <div ref={monthDropdownRef} className={cn("relative", !selectedYear && "opacity-50 pointer-events-none")}>
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedYear) {
                                        setShowMonthDropdown(!showMonthDropdown);
                                        setShowYearDropdown(false);
                                    }
                                }}
                                className="flex items-center justify-between gap-1 bg-slate-50 border border-slate-200/80 pl-2 pr-5 py-1.5 rounded-lg text-slate-700 text-[10px] font-bold min-w-[85px] text-left cursor-pointer"
                                disabled={!selectedYear}
                            >
                                <span>{selectedMonth ? filteredMonths.find(m => m.value === selectedMonth)?.label || "Semua Bln" : "Semua Bln"}</span>
                                <ChevronDown className={cn("w-3 h-3 text-slate-400 absolute right-1 transition-transform duration-200", showMonthDropdown && "rotate-180")} />
                            </button>

                            {showMonthDropdown && selectedYear && (
                                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedMonth(undefined);
                                            setTimeView('monthly');
                                            setShowMonthDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-1.5 text-[10px] font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
                                            selectedMonth === undefined ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                        )}
                                    >
                                        Semua Bln
                                    </button>
                                    {filteredMonths.map((m) => (
                                        <button
                                            type="button"
                                            key={m.value}
                                            onClick={() => {
                                                setSelectedMonth(m.value);
                                                setShowMonthDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-3 py-1.5 text-[10px] font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
                                                selectedMonth === m.value ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                            )}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading || !isMounted ? (
                    <div className="w-full h-[180px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-6 h-6 rounded-full border-2 border-[#D25026] border-t-transparent animate-spin mb-2" />
                        <span className="text-slate-400 text-xs font-semibold">Memuat Grafik...</span>
                    </div>
                ) : activeData.length === 0 || currentTotal === 0 || activeData.every(item => Number(item.pv || 0) === 0) ? (
                    <div className="w-full h-[180px] flex flex-col items-center justify-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2 shrink-0">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-slate-800 text-xs font-bold w-full text-center block">Belum ada data transaksi</span>
                        <p className="text-slate-500 text-xs mt-1 w-full text-center leading-relaxed">
                            Grafik omset akan tampil setelah ada transaksi penjualan.
                        </p>
                    </div>
                ) : (
                    <div ref={chartScrollRef} className="flex-1 w-full overflow-x-auto pb-2 custom-scrollbar min-w-0">
                        <div className={cn(
                            "h-[180px] relative -ml-6 -mb-2",
                            timeView === 'daily' ? 'w-[650px] min-w-full' :
                            timeView === 'lifetime' ? 'w-[950px] min-w-full' :
                            timeView === 'monthly' ? 'w-[500px] min-w-full' : 'w-full'
                        )}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis hide={true} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Omset']}
                                        labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <Area
                                        type="linear"
                                        dataKey="pv"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorPv)"
                                        dot={(props: any) => {
                                            const { cx, cy, payload, index } = props;
                                            if (index === 0) {
                                                return <circle key={`dot-${index}`} cx={cx} cy={cy} r={3} fill="#22c55e" stroke="#fff" strokeWidth={1} />;
                                            }
                                            const prevVal = activeData[index - 1]?.pv || 0;
                                            const currentVal = payload.pv || 0;
                                            const isPointDecrease = currentVal < prevVal;
                                            return (
                                                <circle
                                                    key={`dot-${index}`}
                                                    cx={cx}
                                                    cy={cy}
                                                    r={3}
                                                    fill={isPointDecrease ? "#ef4444" : "#22c55e"}
                                                    stroke="#fff"
                                                    strokeWidth={1}
                                                />
                                            );
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* List Breakdown Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-transparent flex flex-col h-[300px]">
                <div className="mb-3 flex justify-between items-center">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Rincian Laporan</span>
                    <span className="text-[9px] bg-slate-50 px-2 py-0.5 rounded text-slate-400 font-bold">Terbaru</span>
                </div>

                <div className="flex-1 w-full overflow-y-auto custom-scrollbar pr-1">
                    {loading || !isMounted ? (
                        <div className="py-8 text-center text-slate-400 text-xs italic">Memuat rincian...</div>
                    ) : activeData.length === 0 || currentTotal === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs italic">Belum ada data transaksi</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {activeData.slice().reverse().map((item, idx) => {
                                const prevVal = activeData[activeData.length - idx - 2]?.pv || 0;
                                const currentVal = item.pv || 0;
                                const isDecrease = currentVal < prevVal;

                                return (
                                    <div
                                        key={idx}
                                        className="p-3 bg-slate-50 hover:bg-[#FFF0EB]/10 border border-slate-100 rounded-xl flex items-center justify-between transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-700 text-xs font-bold">{item.name}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-slate-900 text-xs font-extrabold">
                                                Rp {currentVal.toLocaleString('id-ID')}
                                            </span>
                                            <span className={cn(
                                                "text-[9px] font-bold mt-0.5",
                                                currentVal === 0 ? "text-slate-400" : isDecrease ? "text-red-500" : "text-emerald-500"
                                            )}>
                                                {currentVal === 0 ? "Neutral" : isDecrease ? "↓ Turun" : "↑ Naik"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
