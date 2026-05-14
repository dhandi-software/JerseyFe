import { 
    Users, UserCheck, Shield, ChevronDown, MessageCircle, Star, Pen, MoreVertical, Plus, ArrowUpRight 
} from "lucide-react";
import { useState, useEffect } from "react";
import { adminApi } from "~/api/admin";
import { Toast } from "~/components/ui/toast";
import { cn } from "~/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts';



export function DashboardDesktop() {
    const [loading, setLoading] = useState(true);
    const [showWelcomeToast, setShowWelcomeToast] = useState(false);
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
        recentCustomers: [] as any[],
        recentChats: [] as any[],
        totalUnreadChat: 0,
        bestMonth: { month: "-", year: "-", pv: 0 },
        bestYear: { year: "-", totalRevenue: 0, totalQuantity: 0 },
        topBuyer: { name: "-", category: "-", initial: "-" },
        newOrders: [] as any[]
    });

    useEffect(() => {
        const justLoggedIn = sessionStorage.getItem("justLoggedIn");
        if (justLoggedIn === "true") {
            setShowWelcomeToast(true);
            sessionStorage.removeItem("justLoggedIn");
        }
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await adminApi.getDashboardStats();
                const adminRes = await adminApi.getUserCountByRole("admin");

                setStatsData(prev => ({
                    ...prev,
                    totalCustomer: Number(statsRes.data?.totalCustomer || 0),
                    totalStaff: Number(statsRes.data?.totalStaff || 0),
                    totalAdmin: Number(statsRes.data?.totalAdmin || adminRes.data?.count || 0),
                    totalRevenue: Number(statsRes.data?.totalRevenue || 0),
                    salesData: statsRes.data?.salesData || prev.salesData,
                    recentCustomers: statsRes.data?.recentCustomers || [],
                    recentChats: statsRes.data?.recentChats || [],
                    totalUnreadChat: statsRes.data?.totalUnreadChat || 0,
                    bestMonth: statsRes.data?.bestMonth || prev.bestMonth,
                    bestYear: statsRes.data?.bestYear || prev.bestYear,
                    topBuyer: statsRes.data?.topBuyer || prev.topBuyer,
                    newOrders: statsRes.data?.newOrders || prev.newOrders
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
        <div className="w-full min-h-[100vh] p-8 bg-[#F5F5F3] font-['Inter'] flex flex-col gap-6">
            {showWelcomeToast && <Toast title="Welcome back, Admin!" duration={5000} variant="success" />}

            {/* TIER 1: Top Metrics */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* Total Pendapatan Card */}
                <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                    <div>
                        <div className="text-slate-900 text-xl font-semibold mb-2">Total Pendapatan</div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-slate-900 text-3xl font-bold">
                                Rp {statsData.totalRevenue.toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm mt-1">Akumulasi omset bruto</div>
                    </div>
                </div>
                {/* Total Customer Card */}
                <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                    <div>
                        <div className="text-slate-900 text-xl font-semibold mb-2">Total Customer</div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-slate-900 text-5xl font-medium">
                                {loading ? "..." : statsData.totalCustomer}
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm mt-1">Total customer aktif di sistem</div>
                    </div>
                </div>

                {/* Total Designer Card */}
                <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                    <div>
                        <div className="text-slate-900 text-xl font-semibold mb-2">Total Designer</div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-slate-900 text-5xl font-medium">
                                {loading ? "..." : statsData.totalStaff}
                            </div>
                        </div>
                        <div className="text-slate-500 text-sm mt-1">Desainer dan Staff aktif</div>
                    </div>
                </div>

                {/* Total Gudang Card */}
                <div className="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-transparent">
                    <div>
                        <div className="text-slate-900 text-xl font-semibold mb-2">Total Gudang (Admin)</div>
                        <div className="text-slate-900 text-5xl font-medium">
                            {loading ? "..." : statsData.totalAdmin}
                        </div>
                        <div className="text-slate-500 text-sm mt-1">Admin yang mengelola pesanan</div>
                    </div>
                </div>
            </div>

            {/* TIER 2: Customers & Growth */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-6">
                
                {/* Customers List Section */}
                <div className="bg-white rounded-2xl py-6 flex flex-col shadow-sm border border-transparent h-full min-h-[25rem]">
                    <div className="px-6 flex justify-between items-center mb-6">
                        <div className="text-slate-900 text-xl font-semibold">Customers</div>
                        <div className="flex items-center gap-1 cursor-pointer">
                            <span className="text-slate-500 text-sm">Sort by </span>
                            <span className="text-slate-700 text-sm font-medium">Newest</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                    <div className="flex-1 px-4 flex flex-col overflow-y-auto gap-1">
                        {statsData.recentCustomers.length > 0 ? (
                            statsData.recentCustomers.map((customer, index) => (
                                <div 
                                    key={customer.id}
                                    className={cn(
                                        "p-4 rounded-2xl flex items-center gap-3 transition-all group cursor-pointer",
                                        index === 0 ? "bg-[#FFF0E5]" : "hover:bg-orange-50/50"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-100 shadow-sm">
                                        {customer.nama.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <div className="text-slate-900 text-sm font-semibold truncate">{customer.nama}</div>
                                            {customer.lastMessageAt && (
                                                <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                                    {new Date(customer.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-slate-500 text-[11px] truncate flex items-center gap-1 mt-0.5">
                                            {customer.lastMessageContent ? (
                                                <>
                                                    <span className="shrink-0 text-orange-500">💬</span>
                                                    <span className="truncate italic font-medium">{customer.lastMessageContent}</span>
                                                </>
                                            ) : (
                                                <span className="truncate opacity-70">{customer.category || "General Customer"}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/admin/chat?userId=${customer.id}`;
                                            }}
                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F] hover:bg-[#E85C2F] hover:text-white transition-all shadow-sm"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:border-[#E85C2F] hover:text-[#E85C2F] transition-all">
                                            <Star className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {index === 0 && (
                                         <div className="flex items-center gap-2 pr-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/admin/chat?userId=${customer.id}`;
                                                }}
                                                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F] hover:bg-[#E85C2F] hover:text-white transition-all shadow-sm"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-[#E85C2F] text-[#E85C2F] hover:bg-[#E85C2F] hover:text-white transition-all">
                                                <Star className="w-4 h-4" />
                                            </button>
                                            <div className="w-[1px] h-4 bg-[#E85C2F] opacity-30 mx-1"></div>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-800">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic py-10">
                                Belum ada data customer
                            </div>
                        )}
                    </div>
                    <div className="px-6 mt-4">
                        <button className="text-[#E85C2F] text-sm font-medium flex items-center gap-1 hover:underline">
                            All customers <ArrowUpRight className="w-4 h-4 rotate-45" />
                        </button>
                    </div>
                </div>

                {/* Growth Chart Section */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-transparent flex-1 flex flex-col min-h-[20rem]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-slate-900 text-xl font-semibold">Omset Transaksi</div>
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-100"
                                >
                                    <span className="text-slate-700 text-sm font-medium capitalize">
                                        {timeView === 'weekly' ? 'Mingguan' : timeView === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                    </span>
                                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showDropdown && "rotate-180")} />
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                                        {(['weekly', 'monthly', 'yearly'] as const).map((view) => (
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
                                                {view === 'weekly' ? 'Mingguan' : view === 'monthly' ? 'Bulanan' : 'Tahunan'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full h-full relative -ml-4">
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
                                    <Area type="linear" dataKey="pv" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bottom Stats of Chart */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-transparent">
                            <div className="text-slate-500 text-sm font-semibold mb-6">Bulan Terlaris</div>
                            <div className="text-[#E85C2F] text-2xl font-semibold">{statsData.bestMonth.month}</div>
                            <div className="text-[#E85C2F] text-sm font-medium mt-1">{statsData.bestMonth.year}</div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between">
                            <div className="text-slate-500 text-sm font-semibold mb-6">Tahun Terbaik</div>
                            <div>
                                <div className="text-[#E85C2F] text-2xl font-semibold">{statsData.bestYear.year}</div>
                                <div className="text-slate-500 text-sm mt-1">{statsData.bestYear.totalQuantity >= 1000 ? (statsData.bestYear.totalQuantity/1000).toFixed(1) + 'K' : statsData.bestYear.totalQuantity} jersey terjual</div>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-transparent flex flex-col justify-between">
                            <div className="text-slate-500 text-sm font-semibold mb-4">Top Buyer</div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#119DA4] flex justify-center items-center text-white text-sm font-bold truncate px-1">{statsData.topBuyer.initial}</div>
                                <div className="min-w-0">
                                    <div className="text-slate-900 text-sm font-medium truncate">{statsData.topBuyer.name}</div>
                                    <div className="text-slate-400 text-xs truncate">{statsData.topBuyer.category}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* TIER 3: Footer Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Chats Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-transparent flex flex-col">
                    <div className="mb-4">
                        <div className="text-slate-900 text-xl font-semibold">Chats</div>
                        <div className="text-slate-500 text-sm">{statsData.totalUnreadChat} pesan belum dibaca</div>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-6">
                        {statsData.recentChats.length > 0 ? (
                            statsData.recentChats.map((chat) => (
                                <div key={chat.id} className="flex gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0 shadow-sm border border-orange-50">
                                        {chat.senderName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-slate-900 text-sm font-semibold truncate">{chat.senderName}</div>
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider shrink-0">{chat.senderRole}</div>
                                        </div>
                                        <div className="text-slate-500 text-xs truncate pr-4">{chat.content}</div>
                                    </div>
                                    {!chat.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-[#E85C2F] mt-2 shrink-0 shadow-sm"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic py-10">
                                Belum ada chat masuk
                            </div>
                        )}
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-50">
                        <button 
                            onClick={() => window.location.href = '/admin/chat'}
                            className="text-[#E85C2F] text-sm font-medium hover:underline"
                        >
                            Semua pesan &rarr;
                        </button>
                    </div>
                </div>

                {/* Top States Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-transparent flex flex-col justify-between">
                    <div className="text-slate-900 text-xl font-semibold mb-6">Kota Teratas</div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center w-full relative">
                            <div className="w-full max-w-[90%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                                <span className="text-slate-900 text-sm font-semibold uppercase">JKT</span>
                            </div>
                            <span className="absolute right-0 text-slate-800 text-xs font-semibold">120k</span>
                        </div>
                        <div className="flex items-center w-full relative">
                            <div className="w-full max-w-[70%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                                <span className="text-slate-900 text-sm font-semibold uppercase">BDG</span>
                            </div>
                            <span className="absolute right-0 text-slate-800 text-xs font-semibold">80k</span>
                        </div>
                        <div className="flex items-center w-full relative">
                            <div className="w-full max-w-[60%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                                <span className="text-slate-900 text-sm font-semibold uppercase">SBY</span>
                            </div>
                            <span className="absolute right-0 text-slate-800 text-xs font-semibold">70k</span>
                        </div>
                         <div className="flex items-center w-full relative">
                            <div className="w-full max-w-[45%] bg-gradient-to-r from-[#FDE8DF] to-transparent py-2 px-3 rounded-lg flex items-center justify-between">
                                <span className="text-slate-900 text-sm font-semibold uppercase">SMR</span>
                            </div>
                            <span className="absolute right-0 text-slate-800 text-xs font-semibold">50k</span>
                        </div>
                    </div>
                </div>

                {/* New Deals Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-transparent">
                    <div className="text-slate-900 text-xl font-semibold mb-4">Pesanan Baru</div>
                    <div className="flex flex-wrap gap-2">
                        {statsData.newOrders.length > 0 ? (
                            statsData.newOrders.map((order, i) => (
                                <div key={i} className="px-3 py-2 bg-[#FFF0E5] text-[#E85C2F] rounded-xl flex items-center gap-2 text-sm">
                                    <Plus className="w-4 h-4" /> {order.name}
                                </div>
                            ))
                        ) : (
                            <div className="text-slate-400 text-sm italic">Belum ada pesanan baru</div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
