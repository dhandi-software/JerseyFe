import { useAuth } from "~/context/AuthContext";
import { LayoutDashboard, MessageCircle, User, ShoppingBag, Clock, CheckCircle, Package, Truck, Loader2, Bell } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { orderService } from "~/services/orderService";
import { cn } from "~/lib/utils";

export function DashboardDesktop() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      try {
        const data = await orderService.getCustomerOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const activeOrders = orders.filter(o => o.status !== "SELESAI" && o.status !== "DITOLAK");

  return (
    <div className="p-6 md:p-10 w-full mx-auto space-y-10 animate-in fade-in duration-500 font-geist">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Welcome, <span className="text-[#D25026]">{user?.name || user?.username || "Player"}!</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">
            Dashboard Panel & Information Center
          </p>
        </div>
        <div className="hidden md:block">
            <div className="bg-slate-900 px-6 py-3 rounded-2xl shadow-xl shadow-slate-200">
                <p className="text-white font-black italic uppercase tracking-widest text-[10px] flex items-center gap-3">
                   <LayoutDashboard size={14} className="text-[#D25026]" /> Notification Center
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                        Buat Jersey Custom<br />Impian Kamu
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
                        Tim kami siap mewujudkan desain jersey terbaik untuk tim Anda. Mulai sekarang!
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link 
                            to="/customer/custom-jersey"
                            className="inline-flex items-center gap-3 bg-[#D25026] hover:bg-[#B34320] text-slate-900 px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#D25026]/20"
                        >
                            <ShoppingBag size={16} />
                            Order Jersey
                        </Link>
                        <Link 
                            to="/customer/progress-pesanan"
                            className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs transition-all border border-white/10"
                        >
                            <Clock size={16} />
                            Progress Pesanan
                        </Link>
                    </div>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-5 transform rotate-12">
                    <ShoppingBag size={240} />
                </div>
            </div>

            {/* Notification/Status Summary Section */}
            <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                        <Bell className="text-[#D25026]" size={16} />
                    </div>
                    Pemberitahuan Pesanan
                </h3>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    {loading ? (
                        <div className="text-center flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Memeriksa pesanan...</p>
                        </div>
                    ) : activeOrders.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-3xl border border-orange-100">
                                <div className="w-12 h-12 bg-[#D25026] text-white rounded-2xl flex items-center justify-center shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 uppercase italic">Anda memiliki {activeOrders.length} pesanan aktif</p>
                                    <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase italic leading-tight">
                                        Gunakan Kode Tracking Anda di halaman pelacakan untuk memantau proses produksi secara detail.
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to="/customer/progress-pesanan"
                                className="w-full flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl hover:bg-slate-800 transition-all group"
                            >
                                <span className="text-xs font-black uppercase tracking-widest italic">Pantau Progress Pesanan</span>
                                <Truck className="group-hover:translate-x-2 transition-transform text-[#D25026]" size={20} />
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <Bell className="text-slate-200" size={32} />
                            </div>
                            <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest leading-relaxed">
                                Belum ada pemberitahuan baru mengenai pesanan Anda.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                    <LayoutDashboard className="text-[#D25026]" size={16} />
                </div>
                Menu Navigasi
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
                <Link to="/customer/chat" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase italic tracking-tight text-slate-900">Konsultasi</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed italic">Hubungi tim desainer kami.</p>
                    </div>
                </Link>

                <Link to="/customer/progress-pesanan" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase italic tracking-tight text-slate-900">Progress Pesanan</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 leading-relaxed italic">Pantau status produksi jersey.</p>
                    </div>
                </Link>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4">
                    <div className="w-10 h-10 bg-[#D25026] rounded-xl flex items-center justify-center">
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase italic tracking-tighter leading-none">Jersey Custom</h4>
                        <p className="text-xs text-slate-400 mt-2 italic">Mulai buat pesanan jersey baru untuk tim kamu sekarang.</p>
                    </div>
                    <Link to="/customer/custom-jersey" className="block text-center bg-[#D25026] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-[#B34320] transition-colors text-slate-900">
                        Order Sekarang
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
