import { useState, useEffect, useRef } from "react";
import { adminApi } from "~/api/admin";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from "recharts";
import { 
    Calendar, TrendingUp, Coins, BarChart3, ArrowUpRight, ChevronDown, Award
} from "lucide-react";
import { cn } from "~/lib/utils";

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

export function OmsetDesktop() {
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [timeView, setTimeView] = useState<'daily' | 'monthly' | 'yearly' | 'lifetime'>('monthly');
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

    const activeData = statsData.salesData[timeView] || [];
    const currentTotal = activeData.reduce((sum, item) => sum + (item.pv || 0), 0);

    const currentMonthVal = new Date().getMonth() + 1;
    const filteredMonths = selectedYear === currentYear 
        ? months.filter(m => m.value <= currentMonthVal)
        : months;

    const chartScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartScrollRef.current) {
            chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
        }
    }, [timeView, statsData]);

    return (
        <div className="w-full min-h-screen p-8 bg-[#F5F5F3] font-['Inter'] flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-slate-900 text-3xl font-black italic uppercase tracking-tighter">
                        Omset & <span className="text-[#D25026]">Transaksi</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Laporan dan analisis omset penjualan jersey kustom FCSV Apparel.</p>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D25026]" />
                    <span className="text-xs font-bold text-slate-700">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Revenue Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-[#D25026]/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-[#D25026]/10">
                        <Coins className="w-8 h-8 text-[#D25026] opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Akumulasi Omset</span>
                        <h3 className="text-slate-900 text-2xl font-black mt-2">
                            Rp {statsData.totalRevenue.toLocaleString('id-ID')}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">Seluruh pendapatan bersih di sistem</p>
                    </div>
                </div>

                {/* Selected Period Total Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-[#119DA4]/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-[#119DA4]/10">
                        <TrendingUp className="w-8 h-8 text-[#119DA4] opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">
                            Omset ({timeView === 'daily' ? 'Harian' : timeView === 'monthly' ? 'Bulanan' : timeView === 'yearly' ? 'Tahunan' : 'Lifetime'})
                        </span>
                        <h3 className="text-slate-900 text-2xl font-black mt-2 text-[#119DA4]">
                            Rp {currentTotal.toLocaleString('id-ID')}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">Berdasarkan tab data yang aktif</p>
                    </div>
                </div>

                {/* Best Month Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-[#E85C2F]/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-[#E85C2F]/10">
                        <Award className="w-8 h-8 text-[#E85C2F] opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Bulan Terlaris</span>
                        <h3 className="text-slate-900 text-xl font-black mt-2 text-[#E85C2F]">
                            {statsData.bestMonth.month} {statsData.bestMonth.year !== '-' && `'${statsData.bestMonth.year.substring(2)}`}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                            Rp {statsData.bestMonth.pv.toLocaleString('id-ID')} omset bulanan
                        </p>
                    </div>
                </div>

                {/* Best Year Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-neutral-900/5 rounded-bl-[5rem] flex items-center justify-center transition-all duration-300 group-hover:bg-neutral-900/10">
                        <BarChart3 className="w-8 h-8 text-neutral-800 opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Tahun Terbaik</span>
                        <h3 className="text-slate-900 text-2xl font-black mt-2 text-slate-800">
                            {statsData.bestYear.year}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                            Rp {statsData.bestYear.totalRevenue.toLocaleString('id-ID')} ({statsData.bestYear.totalQuantity} jersey)
                        </p>
                    </div>
                </div>

            </div>

            {/* Tabs for Timeframes / Filter Indicator */}
            {!selectedYear && !selectedMonth ? (
                <div className="flex gap-2 bg-white/60 p-1.5 rounded-2xl border border-slate-200/50 w-fit self-center lg:self-start">
                    {(['daily', 'monthly', 'yearly', 'lifetime'] as const).map((view) => (
                        <button
                            key={view}
                            onClick={() => setTimeView(view)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer",
                                timeView === view 
                                    ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/20" 
                                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                            )}
                        >
                            {view === 'daily' ? 'Harian' : view === 'monthly' ? 'Bulanan' : view === 'yearly' ? 'Tahunan' : 'Lifetime'}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-[#D25026]/10 text-[#D25026] px-4 py-2.5 rounded-xl border border-[#D25026]/20 w-fit self-center lg:self-start flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D25026] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        Rincian Terfilter: {selectedYear && `Tahun ${selectedYear}`} {selectedMonth && `- ${months[selectedMonth - 1].label}`} ({selectedMonth ? 'Harian' : 'Bulanan'})
                    </span>
                </div>
            )}

            {/* Main Content: Chart & Table Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Chart (Visual representation) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[350px]">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Grafik Pergerakan Omset</span>
                            <h3 className="text-slate-900 text-lg font-black mt-1">
                                Tren Transaksi
                                {(selectedYear || selectedMonth) && (
                                    <span className="ml-2 text-sm font-normal text-slate-500 normal-case">
                                        (Total: <span className="font-bold text-[#D25026]">Rp {currentTotal.toLocaleString('id-ID')}</span>)
                                    </span>
                                )}
                            </h3>
                        </div>
                        
                        {/* Custom Dropdown Filters near the Graph */}
                        <div className="flex items-center gap-2">
                            {/* Filter Tahun */}
                            <div ref={yearDropdownRef} className="relative">
                                <button
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
                                        {selectedMonth ? months[selectedMonth - 1].label : "Semua Bulan"}
                                    </span>
                                    <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", showMonthDropdown && "rotate-180")} />
                                </button>

                                {showMonthDropdown && selectedYear && (
                                    <div className="absolute right-0 mt-2.5 w-44 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-150">
                                        <button
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

                    <div ref={chartScrollRef} className="flex-1 w-full overflow-x-auto pb-2 custom-scrollbar min-w-0">
                        <div className={cn(
                            "h-[250px] relative -ml-4",
                            timeView === 'daily' ? 'w-[900px] min-w-full' : 
                            timeView === 'lifetime' ? 'w-[1200px] min-w-full' : 
                            timeView === 'monthly' ? 'w-[650px] min-w-full' : 'w-full'
                        )}>
                            {loading || !isMounted ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <div className="w-8 h-8 rounded-full border-4 border-[#D25026] border-t-transparent animate-spin mb-2" />
                                    <span className="text-slate-400 text-xs font-semibold">Memuat Grafik...</span>
                                </div>
                            ) : activeData.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <span className="text-slate-400 text-xs font-semibold">Tidak Ada Data Transaksi</span>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94a3b8', fontSize: 10}}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94a3b8', fontSize: 10}}
                                            tickFormatter={(val) => `${val/1000}k`}
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
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Tabular/Text Breakdown (The user's direct request) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-[380px] lg:h-[420px]">
                    <div className="mb-4 flex justify-between items-center">
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rincian Riwayat Omset</span>
                            <h3 className="text-slate-900 text-lg font-black mt-1">Laporan Angka</h3>
                        </div>
                        <span className="text-[10px] bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full text-slate-500 font-bold uppercase tracking-wider">
                            Terbaru di atas
                        </span>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto custom-scrollbar pr-2">
                        {loading || !isMounted ? (
                            <div className="w-full h-full flex flex-col items-center justify-center py-20 text-slate-400 text-sm italic">
                                <div className="w-6 h-6 rounded-full border-2 border-[#D25026] border-t-transparent animate-spin mb-2" />
                                Memuat rincian...
                            </div>
                        ) : activeData.length === 0 ? (
                            <div className="w-full h-full flex flex-col items-center justify-center py-20 text-slate-400 text-sm italic">
                                Belum ada data rincian
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {activeData.slice().reverse().map((item, idx) => {
                                    const prevVal = activeData[activeData.length - idx - 2]?.pv || 0;
                                    const currentVal = item.pv || 0;
                                    const isDecrease = currentVal < prevVal;

                                    return (
                                        <div 
                                            key={idx} 
                                            className="p-4 bg-slate-50 hover:bg-[#FFF0EB]/20 hover:border-[#FFF0EB] border border-slate-100 rounded-2xl flex items-center justify-between transition-all duration-300 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-600 font-bold text-xs border border-slate-100">
                                                    {activeData.length - idx}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-slate-800 text-sm font-bold group-hover:text-[#D25026] transition-colors">{item.name}</span>
                                                    <span className="text-slate-400 text-[10px] font-bold uppercase mt-0.5">FCSV Jersey</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-slate-900 text-sm font-black italic uppercase tracking-tighter">
                                                    Rp {currentVal.toLocaleString('id-ID')}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] font-bold mt-1 flex items-center gap-0.5",
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

        </div>
    );
}
