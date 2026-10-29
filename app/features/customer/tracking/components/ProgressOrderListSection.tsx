import { ChevronRight, Loader2, Package, ShoppingBag, Truck } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { ProgressOrderListSectionProps } from "~/types";

export function ProgressOrderListSection({
    orders,
    loading,
    onSelectOrder,
    getDisplayStatus,
    variant = "desktop",
}: ProgressOrderListSectionProps) {
    if (variant === "mobile") {
        return (
            <>
                <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-40">
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                        Daftar Progress
                    </h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1.5 italic">
                        Pantau Semua Pesanan Aktif
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    {loading ? (
                        <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center flex flex-col items-center gap-3">
                            <Loader2 className="w-7 h-7 animate-spin text-[#D25026]" />
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
                                Memuat...
                            </p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 text-center space-y-3">
                            <ShoppingBag className="mx-auto text-slate-200" size={36} />
                            <p className="text-sm font-bold text-slate-500 italic uppercase">
                                Belum ada pesanan aktif
                            </p>
                            <Link
                                to="/customer/custom-jersey"
                                className="block text-[#D25026] text-xs font-black uppercase tracking-widest"
                            >
                                Order Sekarang &rarr;
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div
                                key={order.id}
                                onClick={() => onSelectOrder(order)}
                                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-black text-slate-500 font-mono">
                                            {order.orderId}
                                        </span>
                                        {order.queueNumber && (
                                            <span className="bg-[#D25026]/10 text-[#D25026] px-2.5 py-0.5 rounded-md text-xs font-black uppercase italic border border-[#D25026]/20">
                                                Antrean: {order.queueNumber}
                                            </span>
                                        )}
                                        <span
                                            className={cn(
                                                "px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border",
                                                order.status === "SELESAI"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-orange-50 text-[#D25026] border-[#D25026]/20"
                                            )}
                                        >
                                            {getDisplayStatus(order.status, order.isWorking)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-900 uppercase italic leading-tight">
                                            {order.details?.[0]?.productTitle || "Custom Jersey"}
                                        </p>
                                        <p className="text-xs font-bold text-slate-500 italic mt-0.5">
                                            {order.details?.length} Unit &bull;{" "}
                                            {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl">
                                    <ChevronRight size={18} className="text-slate-400" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                    Progress Pesanan
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-xs mt-2.5 italic">
                    Pantau status produksi jersey kamu
                </p>
            </div>

            {loading ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D25026]" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 italic">
                        Memuat pesanan Anda...
                    </p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="text-slate-200" size={40} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-black uppercase italic tracking-tight text-slate-900">
                            Belum ada pesanan aktif
                        </p>
                        <p className="text-sm font-medium text-slate-500 italic">
                            Mulai buat jersey custom kamu sekarang dan pantau progressnya di sini.
                        </p>
                    </div>
                    <Link
                        to="/customer/custom-jersey"
                        className="inline-block bg-[#D25026] text-slate-900 px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-sm"
                    >
                        Order Sekarang
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => onSelectOrder(order)}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#D25026]/10 transition-colors">
                                    <Package
                                        className="text-slate-400 group-hover:text-[#D25026]"
                                        size={24}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        "px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border",
                                        order.status === "SELESAI"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : "bg-orange-50 text-[#D25026] border-orange-100"
                                    )}
                                >
                                    {getDisplayStatus(order.status, order.isWorking)}
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-bold text-slate-500 font-mono tracking-tight">
                                        {order.orderId}
                                    </p>
                                    {order.queueNumber && (
                                        <span className="bg-[#D25026]/10 text-[#D25026] px-2.5 py-1 rounded-md text-xs font-black uppercase italic border border-[#D25026]/20">
                                            No. Antrean: {order.queueNumber}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                                    {order.details?.[0]?.productTitle || "Custom Jersey"}
                                </h3>
                                <p className="text-xs font-black text-[#D25026] uppercase italic tracking-wider">
                                    {order.details?.length} Units &bull;{" "}
                                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-widest italic text-slate-500 group-hover:text-[#D25026] transition-colors">
                                Lihat Progress
                                <Truck size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
