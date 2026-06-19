import { useState, useEffect, useRef } from "react";
import { adminApi } from "~/api/admin";
import { useSidebar } from "~/components/ui/sidebar";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from "recharts";
import {
    Calendar, TrendingUp, Coins, BarChart3, ChevronDown, Award, Menu, FileText
} from "lucide-react";
import { cn } from "~/lib/utils";
import { downloadOmsetPDF } from "~/lib/sizeUtils";

const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" }
];

export function OmsetMobile() {
    const { setOpenMobile } = useSidebar();
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [timeView, setTimeView] = useState<'daily' | 'monthly' | 'yearly' | 'lifetime'>('monthly');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);

    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const monthDropdownRef = useRef<HTMLDivElement>(null);

    const [statsData, setStatsData] = useState({
        totalCustomer: 0,
        totalStaff: 0,
        totalAdmin: 0,
        totalRevenue: 0,
        salesData: {
            daily: [] as any[],
            monthly: [] as any[],
            yearly: [] as any[],
            lifetime: [] as any[]
        },
        bestMonth: { month: "-", year: "-", pv: 0 },
        bestYear: { year: "-", totalRevenue: 0, totalQuantity: 0 }
    });

    useEffect(() => {
        setIsMounted(true);
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const params: { year?: number; month?: number } = {};
                if (selectedYear) params.year = selectedYear;
                if (selectedMonth) params.month = selectedMonth;

                const statsRes = await adminApi.getDashboardStats(params);
                if (statsRes.status === "success" && statsRes.data) {
                    setStatsData(prev => ({
                        ...prev,
                        totalCustomer: Number(statsRes.data.totalCustomer || 0),
                        totalStaff: Number(statsRes.data.totalStaff || 0),
                        totalAdmin: Number(statsRes.data.totalAdmin || 0),
                        totalRevenue: Number(statsRes.data.totalRevenue || 0),
                        salesData: statsRes.data.salesData || prev.salesData,
                        bestMonth: statsRes.data.bestMonth || prev.bestMonth,
                        bestYear: statsRes.data.bestYear || prev.bestYear
                    }));

                    // Automatically switch view modes depending on filters
                    if (selectedYear && selectedMonth) {
                        setTimeView('daily');
                    } else if (selectedYear) {
                        setTimeView('monthly');
                    }
                }
            } catch (error) {
                console.error("Error fetching omset data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        const curYear = new Date().getFullYear();
        const curMonth = new Date().getMonth() + 1;
        if (selectedYear === curYear && selectedMonth && selectedMonth > curMonth) {
            setSelectedMonth(undefined);
            setTimeView('monthly');
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
                setShowYearDropdown(false);
            }
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
                setShowMonthDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const years = [];
    for (let y = currentYear; y >= startYear; y--) {
        years.push(y);
    }

    const currentMonthVal = new Date().getMonth() + 1;
    const currentDayVal = new Date().getDate();
    
    let activeData = statsData.salesData[timeView] || [];
    const isCurrentYear = !selectedYear || selectedYear === currentYear;
    const isCurrentMonth = !selectedMonth || selectedMonth === currentMonthVal;

    if (timeView === 'monthly' && isCurrentYear) {
        activeData = activeData.slice(0, currentMonthVal);
    } else if (timeView === 'daily' && isCurrentYear && isCurrentMonth) {
        activeData = activeData.filter((item: any) => {
            const dayNum = parseInt(item.name);
            return !isNaN(dayNum) && dayNum <= currentDayVal;
        });
    }

    const currentTotal = activeData.reduce((sum, item) => sum + (item.pv || 0), 0);

    const filteredMonths = selectedYear === currentYear
        ? months.filter(m => m.value <= currentMonthVal)
        : months;

    const handleExportReport = () => {
        let periodText = "Lifetime (Seluruh Waktu)";
        if (selectedYear && selectedMonth) {
            periodText = `Harian - ${months[selectedMonth - 1].label} ${selectedYear}`;
        } else if (selectedYear) {
            periodText = `Bulanan - Tahun ${selectedYear}`;
        } else {
            if (timeView === 'daily') {
                periodText = "Harian (Bulan Ini)";
            } else if (timeView === 'monthly') {
                periodText = `Bulanan - Tahun ${new Date().getFullYear()}`;
            } else if (timeView === 'yearly') {
                periodText = "Tahunan";
            }
        }

        downloadOmsetPDF(activeData, periodText, currentTotal);
    };

    const chartScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartScrollRef.current) {
            chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
        }
    }, [timeView, statsData]);

    return (
        <div className="w-full min-h-screen bg-[#F5F5F3] font-['Inter'] flex flex-col gap-4 p-4 pb-20">

            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpenMobile(true)}
                        className="p-2 -ml-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-slate-900" />
                    </button>
                    <div className="text-slate-900 text-2xl font-black">Omset Transaksi</div>
                </div>

                <button
                    onClick={handleExportReport}
                    className="flex items-center justify-center p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                    title="Unduh Laporan PDF"
                >
                    <FileText className="w-5 h-5 text-[#D25026]" />
                </button>
            </div>

            {/* Total Revenue Card */}
            <div className="w-full bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-transparent">
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Total Akumulasi Omset</div>
                <div className="text-slate-900 text-3xl font-black mt-1">
                    Rp {statsData.totalRevenue.toLocaleString('id-ID')}
                </div>
            </div>



            {/* Timeframe Dropdown Selector / Filter Indicator */}
            {!selectedYear && !selectedMonth ? (
                <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pilih Filter</span>
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-100"
                        >
                            <span className="text-slate-600 text-xs font-bold uppercase tracking-tight">
                                {timeView === 'daily' ? 'Harian' : timeView === 'monthly' ? 'Bulanan' : timeView === 'yearly' ? 'Tahunan' : 'Lifetime'}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showDropdown && "rotate-180")} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {(['daily', 'monthly', 'yearly', 'lifetime'] as const).map((view) => (
                                    <button
                                        key={view}
                                        onClick={() => {
                                            setTimeView(view);
                                            setShowDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 text-xs transition-colors",
                                            timeView === view ? "bg-orange-50 text-[#E85C2F] font-bold" : "text-slate-600 active:bg-slate-50"
                                        )}
                                    >
                                        {view === 'daily' ? 'Harian' : view === 'monthly' ? 'Bulanan' : view === 'yearly' ? 'Tahunan' : 'Lifetime'}
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
                        Terfilter: {selectedYear && `Tahun ${selectedYear}`} {selectedMonth && `- ${months[selectedMonth - 1].label}`}
                    </span>
                </div>
            )}

            {/* Selected View Revenue Card */}
            <div className="w-full bg-white rounded-2xl p-5 flex flex-col shadow-sm border border-transparent">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
                    Omset Periode Terpilih ({timeView === 'daily' ? 'Harian' : timeView === 'monthly' ? 'Bulanan' : timeView === 'yearly' ? 'Tahunan' : 'Lifetime'})
                </span>
                <span className="text-xl font-extrabold text-[#119DA4] block mt-1">
                    Rp {currentTotal.toLocaleString('id-ID')}
                </span>
            </div>

            {/* Chart Container (Mobile layout handles scrollable area) */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-transparent flex flex-col min-h-[220px] min-w-0 overflow-hidden">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grafik Pergerakan</span>
                        {(selectedYear || selectedMonth) && (
                            <span className="text-[11px] font-extrabold text-[#D25026] mt-0.5">
                                Rp {currentTotal.toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>

                    {/* Filters near graph for Mobile */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {/* Filter Tahun */}
                        <div ref={yearDropdownRef} className="relative">
                            <button
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
                                onClick={() => {
                                    if (selectedYear) {
                                        setShowMonthDropdown(!showMonthDropdown);
                                        setShowYearDropdown(false);
                                    }
                                }}
                                className="flex items-center justify-between gap-1 bg-slate-50 border border-slate-200/80 pl-2 pr-5 py-1.5 rounded-lg text-slate-700 text-[10px] font-bold min-w-[85px] text-left cursor-pointer"
                                disabled={!selectedYear}
                            >
                                <span>{selectedMonth ? months[selectedMonth - 1].label.substring(0, 3) : "Semua Bln"}</span>
                                <ChevronDown className={cn("w-3 h-3 text-slate-400 absolute right-1 transition-transform duration-200", showMonthDropdown && "rotate-180")} />
                            </button>

                            {showMonthDropdown && selectedYear && (
                                <div className="absolute right-0 mt-1.5 w-32 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
                                    <button
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

                <div ref={chartScrollRef} className="flex-1 w-full overflow-x-auto pb-2 custom-scrollbar min-w-0">
                    <div className={cn(
                        "h-[180px] relative -ml-6 -mb-2",
                        timeView === 'daily' ? 'w-[650px] min-w-full' :
                            timeView === 'lifetime' ? 'w-[950px] min-w-full' :
                                timeView === 'monthly' ? 'w-[500px] min-w-full' : 'w-full'
                    )}>
                        {loading || !isMounted ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-8 h-8 rounded-full border-4 border-[#E85C2F] border-t-transparent animate-spin mb-2" />
                                <span className="text-slate-400 text-xs font-semibold">Memuat Grafik...</span>
                            </div>
                        ) : activeData.length === 0 ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <span className="text-slate-400 text-xs font-semibold">Tidak Ada Data Transaksi</span>
                            </div>
                        ) : (
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
                        )}
                    </div>
                </div>
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
                    ) : activeData.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs italic">Belum ada data rincian</div>
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
