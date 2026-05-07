import { 
    Users, UserCheck, Shield, ChevronDown, MessageCircle, Star, Pen, MoreVertical, Plus, ArrowUpRight, Menu 
} from "lucide-react";
import { useState, useEffect } from "react";
import { adminApi } from "~/api/admin";
import { useSidebar } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts';



export function DashboardMobile() {
    const { setOpenMobile } = useSidebar();
    const [loading, setLoading] = useState(true);
    const [timeView, setTimeView] = useState<'weekly' | 'monthly' | 'yearly'>('yearly');
    const [showDropdown, setShowDropdown] = useState(false);
    const [statsData, setStatsData] = useState({
        totalCustomer: 0,
        totalStaff: 0,
        totalAdmin: 0,
        totalRevenue: 0,
        salesData: {
            weekly: [] as any[],
            monthly: [] as any[],
            yearly: [] as any[]
        },
        recentCustomers: [] as any[]
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await adminApi.getDashboardStats();

                setStatsData(prev => ({
                    ...prev,
                    totalCustomer: Number(statsRes.data?.totalCustomer || 0),
                    totalStaff: Number(statsRes.data?.totalStaff || 0),
                    totalAdmin: Number(statsRes.data?.totalAdmin || 0),
                    totalRevenue: Number(statsRes.data?.totalRevenue || 0),
                    salesData: statsRes.data?.salesData || prev.salesData,
                    recentCustomers: statsRes.data?.recentCustomers || []
                }));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                <div className="text-slate-500 text-sm mt-1">Akumulasi omset bruto</div>
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
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-transparent flex flex-col h-[22rem]">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-slate-900 text-lg font-semibold">Omset Transaksi</div>
                    <div className="relative">
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-100"
                        >
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-tight">
                                {timeView === 'weekly' ? 'Mingguan' : timeView === 'monthly' ? 'Bulanan' : 'Tahunan'}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showDropdown && "rotate-180")} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {(['weekly', 'monthly', 'yearly'] as const).map((view) => (
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
                                        {view === 'weekly' ? 'Mingguan' : view === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 w-full h-full relative -ml-6 -mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={statsData.salesData[timeView]} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
                            <YAxis hide={true} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Omset']}
                                labelStyle={{ color: '#64748b', fontWeight: 'bold' }}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <Area type="linear" dataKey="pv" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

             {/* Bottom Stats of Chart (Mobile specific layout) */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-transparent">
                    <div className="text-slate-500 text-xs font-semibold mb-2">Bulan Terlaris</div>
                    <div className="text-[#E85C2F] text-lg font-bold">Nov 2026</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-transparent">
                    <div className="text-slate-500 text-xs font-semibold mb-2">Tahun Terbaik</div>
                    <div className="text-[#E85C2F] text-lg font-bold">2026</div>
                </div>
                <div className="col-span-2 bg-white p-4 rounded-2xl shadow-sm border border-transparent flex justify-between items-center">
                    <div>
                        <div className="text-slate-500 text-xs font-semibold mb-1">Top Buyer</div>
                        <div className="text-slate-900 text-sm font-medium">SMK Bisa 1</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#119DA4] flex justify-center items-center text-white text-xs font-bold">S</div>
                </div>
            </div>

            {/* Customers List Section */}
            <div className="bg-white rounded-2xl py-6 mt-2 flex flex-col shadow-sm border border-transparent">
                <div className="px-5 flex justify-between items-center mb-6">
                    <div className="text-slate-900 text-lg font-semibold">Customers</div>
                </div>
                <div className="flex-1 px-3 flex flex-col gap-1">
                    {statsData.recentCustomers.length > 0 ? (
                        statsData.recentCustomers.map((customer, index) => (
                            <div 
                                key={customer.id}
                                className={cn(
                                    "p-3 rounded-2xl flex items-center gap-3 transition-all flex-wrap",
                                    index === 0 ? "bg-[#FFF0E5]" : "hover:bg-orange-50/50"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-100 shadow-sm">
                                    {customer.nama.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <div className="text-slate-900 text-sm font-medium">{customer.nama}</div>
                                    <div className="text-slate-500 text-xs">{customer.category || "General Customer"}</div>
                                </div>
                                 {/* Action Buttons wrapped for mobile */}
                                <div className={cn(
                                    "w-full flex items-center gap-2 pt-2 border-t justify-end",
                                    index === 0 ? "border-orange-200/50" : "border-slate-100 opacity-0 group-hover:opacity-100"
                                )}>
                                    <button 
                                        onClick={() => window.location.href = `/admin/chat?userId=${customer.id}`}
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F]"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F]">
                                        <Star className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic py-10">
                            Belum ada data customer
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Stack */}
            <div className="flex flex-col gap-4 mt-2">
                {/* Top States Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-transparent">
                    <div className="text-slate-900 text-lg font-semibold mb-4">Kota Teratas</div>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center w-full relative">
                            <div className="w-full max-w-[90%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-1.5 px-3 rounded text-sm font-semibold uppercase">JKT</div>
                            <span className="absolute right-0 text-xs font-semibold">120k</span>
                        </div>
                        <div className="flex items-center w-full relative">
                            <div className="w-full max-w-[70%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-1.5 px-3 rounded text-sm font-semibold uppercase">BDG</div>
                            <span className="absolute right-0 text-xs font-semibold">80k</span>
                        </div>
                        <div className="flex items-center w-full relative">
                            <div className="w-full max-w-[60%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-1.5 px-3 rounded text-sm font-semibold uppercase">SBY</div>
                            <span className="absolute right-0 text-xs font-semibold">70k</span>
                        </div>
                    </div>
                </div>

                {/* New Deals Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-transparent">
                    <div className="text-slate-900 text-lg font-semibold mb-4">Pesanan Baru</div>
                    <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 bg-[#FFF0E5] text-[#E85C2F] rounded-lg text-xs font-medium flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Tim Futsal JKT
                        </div>
                        <div className="px-3 py-1.5 bg-[#FFF0E5] text-[#E85C2F] rounded-lg text-xs font-medium flex items-center gap-1">
                            <Plus className="w-3 h-3" /> SMA 1 BDG
                        </div>
                        <div className="px-3 py-1.5 bg-[#FFF0E5] text-[#E85C2F] rounded-lg text-xs font-medium flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Kantor Telkom
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
