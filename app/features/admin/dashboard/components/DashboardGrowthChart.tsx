import { ChevronDown, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "~/lib/utils";
import type { TimeView, DashboardStatsData, ChartDataPoint } from "~/types";
import React from "react";

interface DashboardGrowthChartProps {
    timeView: TimeView;
    setTimeView: (view: TimeView) => void;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
    currentTotal: number;
    activeData: ChartDataPoint[];
    statsData: DashboardStatsData;
    loading: boolean;
    isMounted: boolean;
    chartScrollRef?: React.RefObject<HTMLDivElement | null>;
    isMobile?: boolean;
}

export function DashboardGrowthChart({
    timeView,
    setTimeView,
    showDropdown,
    setShowDropdown,
    currentTotal,
    activeData,
    statsData,
    loading,
    isMounted,
    chartScrollRef,
    isMobile = false
}: DashboardGrowthChartProps) {
    const isChartEmpty = activeData.length === 0 || currentTotal === 0 || activeData.every(item => Number(item.pv || 0) === 0);

    return (
        <div className="flex flex-col gap-6 min-w-0 overflow-hidden">
            <div className={cn(
                "bg-white rounded-2xl shadow-sm border border-transparent flex-1 flex flex-col min-h-[20rem] min-w-0 overflow-hidden",
                isMobile ? "p-5" : "p-6"
            )}>
                <div className="flex justify-between items-center mb-4">
                    <div className="text-slate-900 text-xl font-semibold">Omset Transaksi</div>
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-100"
                        >
                            <span className="text-slate-700 text-sm font-medium capitalize">
                                {timeView === 'daily' ? 'Harian' : timeView === 'monthly' ? 'Bulanan' : timeView === 'yearly' ? 'Tahunan' : 'Lifetime'}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showDropdown && "rotate-180")} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                                {(['daily', 'monthly', 'yearly', 'lifetime'] as const).map((view) => (
                                    <button
                                        key={view}
                                        onClick={() => {
                                            setTimeView(view);
                                            setShowDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2 text-sm transition-colors",
                                            timeView === view ? "bg-orange-50 text-[#E85C2F] font-bold" : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {view === 'daily' ? 'Harian' : view === 'monthly' ? 'Bulanan' : view === 'yearly' ? 'Tahunan' : 'Lifetime'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Simple Compact Revenue Label */}
                <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Pendapatan ({timeView === 'daily' ? 'Harian' : timeView === 'monthly' ? 'Bulanan' : timeView === 'yearly' ? 'Tahunan' : 'Lifetime'})
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">
                        Rp {currentTotal.toLocaleString('id-ID')}
                    </span>
                </div>

                {loading || !isMounted ? (
                    <div className="w-full h-[220px] flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-8 h-8 rounded-full border-4 border-[#E85C2F] border-t-transparent animate-spin mb-2" />
                        <span className="text-slate-400 text-xs font-semibold">Memuat Grafik...</span>
                    </div>
                ) : isChartEmpty ? (
                    <div className="w-full h-[220px] flex flex-col items-center justify-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 shrink-0">
                            <TrendingUp className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="text-slate-800 text-sm font-bold w-full text-center block">Belum ada data transaksi</span>
                        <p className="text-slate-500 text-xs mt-1.5 w-full text-center leading-relaxed">
                            Data omset dan grafik penjualan akan otomatis tampil setelah ada transaksi yang tercatat.
                        </p>
                    </div>
                ) : (
                    <div ref={chartScrollRef} className="flex-1 w-full overflow-x-auto pb-2 custom-scrollbar min-w-0">
                        <div className={cn(
                            "h-[220px] relative -ml-4",
                            timeView === 'daily' ? 'w-[900px] min-w-full' :
                            timeView === 'lifetime' ? 'w-[1200px] min-w-full' :
                            timeView === 'monthly' ? 'w-[650px] min-w-full' : 'w-full'
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

            {/* Bottom Stats of Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-transparent">
                    <div className="text-slate-500 text-sm font-semibold mb-6">Bulan Terlaris</div>
                    {statsData.bestMonth.pv > 0 ? (
                        <>
                            <div className="text-[#E85C2F] text-2xl font-semibold">{statsData.bestMonth.month}</div>
                            <div className="text-[#E85C2F] text-sm font-medium mt-1">{statsData.bestMonth.year}</div>
                        </>
                    ) : (
                        <>
                            <div className="text-slate-700 text-base font-bold">Belum ada data</div>
                            <div className="text-slate-400 text-xs font-medium mt-1">Belum ada data transaksi</div>
                        </>
                    )}
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between">
                    <div className="text-slate-500 text-sm font-semibold mb-6">Tahun Terbaik</div>
                    <div>
                        {statsData.bestYear.totalRevenue > 0 ? (
                            <>
                                <div className="text-[#E85C2F] text-2xl font-semibold">{statsData.bestYear.year}</div>
                                <div className="text-slate-500 text-sm mt-1">
                                    {statsData.bestYear.totalQuantity >= 1000 ? (statsData.bestYear.totalQuantity / 1000).toFixed(1) + 'K' : statsData.bestYear.totalQuantity} jersey terjual
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-slate-700 text-base font-bold">Belum ada data</div>
                                <div className="text-slate-400 text-xs font-medium mt-1">Belum ada data transaksi</div>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between">
                    <div className="text-slate-500 text-sm font-semibold mb-4">Top Buyer</div>
                    {statsData.topBuyer.name !== '-' && statsData.topBuyer.name !== 'Belum ada' ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#119DA4] flex justify-center items-center text-white text-sm font-bold truncate px-1">
                                {statsData.topBuyer.initial}
                            </div>
                            <div className="min-w-0">
                                <div className="text-slate-900 text-sm font-medium truncate">{statsData.topBuyer.name}</div>
                                <div className="text-slate-400 text-xs truncate">{statsData.topBuyer.category}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex justify-center items-center text-slate-400 text-sm font-bold">-</div>
                            <div className="min-w-0">
                                <div className="text-slate-700 text-sm font-bold">Belum ada data</div>
                                <div className="text-slate-400 text-xs">Belum ada data transaksi</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
