import { useAuth } from "~/context/AuthContext";
import { LayoutDashboard, MessageCircle, User, ShoppingBag, Clock, CheckCircle, Package, Truck, Loader2, ChevronRight, Bell } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { orderService } from "~/services/orderService";
import { cn } from "~/lib/utils";

export function DashboardMobile() {
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
    <div className="min-h-screen bg-slate-50 font-geist pb-24">
      {/* Mobile Header */}
      <div className="bg-white px-6 pt-12 pb-8 border-b border-slate-100 rounded-b-[2.5rem] shadow-sm">
        <div className="flex items-center justify-between">
            <div className="p-2 bg-[#D25026]/10 rounded-lg">
                <LayoutDashboard className="text-[#D25026]" size={20} />
            </div>
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
            </div>
        </div>
        <div className="mt-6">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                Hi, {user?.username || "Player"}!
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Notification Center</p>
        </div>
      </div>

      {/* Quick Actions Scroll */}
      <div className="flex gap-4 overflow-x-auto px-6 py-6 no-scrollbar">
        <Link to="/customer/custom-jersey" className="shrink-0 w-32 bg-[#D25026] p-4 rounded-2xl shadow-lg shadow-[#D25026]/20 flex flex-col gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                <ShoppingBag size={16} />
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase italic leading-tight">Order<br />Jersey</span>
        </Link>
        <Link to="/customer/progress-pesanan" className="shrink-0 w-32 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                <Truck size={16} />
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase italic leading-tight">Progress<br />Pesanan</span>
        </Link>
        <Link to="/customer/chat" className="shrink-0 w-32 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <MessageCircle size={16} />
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase italic leading-tight">Mulai<br />Konsultasi</span>
        </Link>
      </div>

      {/* Notification Section */}
      <div className="px-6 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
            <Bell className="text-[#D25026]" size={14} /> Pemberitahuan
        </h3>

        {loading ? (
            <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#D25026]" />
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Memuat...</p>
            </div>
        ) : activeOrders.length > 0 ? (
            <Link to="/customer/progress-pesanan" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase italic">Ada {activeOrders.length} Pesanan Aktif</p>
                        <p className="text-[8px] font-bold text-slate-400 italic">Klik untuk pantau progress.</p>
                    </div>
                </div>
                <div className="bg-slate-900 text-white p-3 rounded-xl flex justify-between items-center px-4">
                    <span className="text-[8px] font-black uppercase tracking-widest italic">Progress Pesanan</span>
                    <ChevronRight size={14} className="text-[#D25026]" />
                </div>
            </Link>
        ) : (
            <div className="bg-white p-10 rounded-[2rem] border border-slate-100 text-center space-y-3">
                <Bell className="mx-auto text-slate-100" size={32} />
                <p className="text-[10px] font-bold text-slate-400 italic uppercase">Belum ada pemberitahuan baru</p>
            </div>
        )}
      </div>

      {/* Hero Mini Card */}
      <div className="px-6 mt-6">
        <div className="bg-slate-900 p-6 rounded-[2.5rem] relative overflow-hidden text-white">
            <h4 className="text-lg font-black italic uppercase tracking-tighter leading-none">Siap Bergaya?</h4>
            <p className="text-[9px] text-slate-400 font-medium mt-2 leading-relaxed italic">
                Buat jersey tim kamu sekarang dengan kualitas premium.
            </p>
            <Link to="/customer/custom-jersey" className="inline-block mt-4 text-[9px] font-black uppercase tracking-widest italic text-[#D25026]">
                Mulai Order &rarr;
            </Link>
        </div>
      </div>
    </div>
  );
}
