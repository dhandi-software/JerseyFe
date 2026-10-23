import { ChevronDown, TrendingUp } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from "recharts";
import { cn } from "~/lib/utils";
import type { TimeView, SalesDataItem, MonthOption } from "~/types";

interface OmsetChartCardProps {
    loading: boolean;
    isMounted: boolean;
    activeData: SalesDataItem[];
    currentTotal: number;
    timeView: TimeView;
    setTimeView: (view: TimeView) => void;
    selectedYear?: number;
    setSelectedYear: (year?: number) => void;
    selectedMonth?: number;
    setSelectedMonth: (month?: number) => void;
    showYearDropdown: boolean;
    setShowYearDropdown: (show: boolean) => void;
    showMonthDropdown: boolean;
    setShowMonthDropdown: (show: boolean) => void;
    yearDropdownRef: React.RefObject<HTMLDivElement | null>;
    monthDropdownRef: React.RefObject<HTMLDivElement | null>;
    chartScrollRef: React.RefObject<HTMLDivElement | null>;
    years: number[];
    filteredMonths: MonthOption[];
}

export function OmsetChartCard({
    loading,
    isMounted,
    activeData,
    currentTotal,
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
    yearDropdownRef,
    monthDropdownRef,
    chartScrollRef,
    years,
    filteredMonths
}: OmsetChartCardProps) {
    const isChartEmpty = activeData.length === 0 || currentTotal === 0 || activeData.every(item => Number(item.pv || 0) === 0);

    return (
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[350px]">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Grafik Pergerakan Omset
                    </span>
                    <h3 className="text-slate-900 text-lg font-black mt-1">
                        Tren Transaksi
                        {(selectedYear || selectedMonth) && (
                            <span className="ml-2 text-sm font-normal text-slate-500 normal-case">
                                (Total: <span className="font-bold text-[#D25026]">Rp {currentTotal.toLocaleString('id-ID')}</span>)
                            </span>
                        )}
                    </h3>
                </div>

                {/* Dropdown Filters */}
                <div className="flex items-center gap-2">
                    {/* Filter Tahun */}
                    <div ref={yearDropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setShowYearDropdown(!showYearDropdown);
                                setShowMonthDropdown(false);
                            }}
                            className="flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 px-3 py-2 rounded-xl transition-all duration-200 min-w-[125px] text-left cursor-pointer"
                        >
                            <span className="text-slate-700 text-xs font-bold">
                                {selectedYear ? `Tahun ${selectedYear}` : "Semua Tahun"}
                            </span>
                            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", showYearDropdown && "rotate-180")} />
                        </button>

                        {showYearDropdown && (
                            <div className="absolute right-0 mt-2.5 w-40 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedYear(undefined);
                                        setSelectedMonth(undefined);
                                        setTimeView('monthly');
                                        setShowYearDropdown(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-xs font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
                                        selectedYear === undefined ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                    )}
                                >
                                    Semua Tahun
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
                                            "w-full text-left px-4 py-2 text-xs font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
                                            selectedYear === y ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                        )}
                                    >
                                        Tahun {y}
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
                            className="flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 px-3 py-2 rounded-xl transition-all duration-200 min-w-[130px] text-left cursor-pointer"
                            disabled={!selectedYear}
                        >
                            <span className="text-slate-700 text-xs font-bold">
                                {selectedMonth ? filteredMonths.find(m => m.value === selectedMonth)?.label || "Semua Bulan" : "Semua Bulan"}
                            </span>
                            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", showMonthDropdown && "rotate-180")} />
                        </button>

                        {showMonthDropdown && selectedYear && (
                            <div className="absolute right-0 mt-2.5 w-44 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedMonth(undefined);
                                        setTimeView('monthly');
                                        setShowMonthDropdown(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-xs font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
                                        selectedMonth === undefined ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                    )}
                                >
                                    Semua Bulan
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
                                            "w-full text-left px-4 py-2 text-xs font-semibold transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026]",
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
                <div className="w-full h-[250px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-8 h-8 rounded-full border-4 border-[#D25026] border-t-transparent animate-spin mb-2" />
                    <span className="text-slate-400 text-xs font-semibold">Memuat Grafik...</span>
                </div>
            ) : isChartEmpty ? (
                <div className="w-full h-[250px] flex flex-col items-center justify-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 shrink-0">
                        <TrendingUp className="w-6 h-6 text-slate-400" />
                    </div>
                    <span className="text-slate-800 text-sm font-bold w-full text-center block">Belum ada data transaksi</span>
                    <p className="text-slate-500 text-xs mt-1.5 w-full text-center leading-relaxed">
                        Data grafik omset akan otomatis tampil setelah ada transaksi penjualan.
                    </p>
                </div>
            ) : (
                <div ref={chartScrollRef} className="flex-1 w-full overflow-x-auto pb-2 custom-scrollbar min-w-0">
                    <div className={cn(
                        "h-[250px] relative -ml-4",
                        timeView === 'daily' ? 'w-[900px] min-w-full' :
                        timeView === 'lifetime' ? 'w-[1200px] min-w-full' :
                        timeView === 'monthly' ? 'w-[650px] min-w-full' : 'w-full'
                    )}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                    tickFormatter={(val) => `${val / 1000}k`}
                                />
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
    );
}
