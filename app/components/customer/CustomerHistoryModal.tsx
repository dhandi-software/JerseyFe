import { X, Award, ShoppingBag, CreditCard, Calendar, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { cn, formatRupiah } from "~/lib/utils";
import type { CustomerHistoryResponse } from "~/types/customerTracking";

interface CustomerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CustomerHistoryResponse | null;
  loading?: boolean;
  error?: string | null;
}

export function CustomerHistoryModal({
  isOpen,
  onClose,
  data,
  loading = false,
  error = null,
}: CustomerHistoryModalProps) {
  if (!isOpen) return null;

  const customer = data?.customer;
  const orders = data?.orders || [];

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-geist">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-900">
                Riwayat & Loyalitas Pelanggan
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {customer?.customerName || "Pelanggan"}{" "}
                {customer?.customerPhone ? `(${customer.customerPhone})` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
              <p className="text-xs font-black uppercase tracking-widest italic">
                Memuat riwayat pesanan...
              </p>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
              {error}
            </div>
          ) : (
            <>
              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Total Pesanan
                  </span>
                  <span className="text-2xl font-black text-slate-900 italic">
                    {customer?.totalOrders || 0}
                  </span>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">
                    Total Belanja (LTV)
                  </span>
                  <span className="text-lg font-black text-emerald-700 italic truncate block">
                    {formatRupiah(customer?.totalSpent || 0)}
                  </span>
                </div>

                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 block mb-1">
                    Rata-rata Order
                  </span>
                  <span className="text-lg font-black text-indigo-700 italic truncate block">
                    {formatRupiah(customer?.averageOrderValue || 0)}
                  </span>
                </div>

                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block mb-1">
                    Order Terakhir
                  </span>
                  <span className="text-xs font-black text-amber-900 block truncate mt-1">
                    {customer?.lastOrderDate
                      ? new Date(customer.lastOrderDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Order Timeline List */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 italic">
                  Daftar Riwayat Pesanan ({orders.length})
                </h3>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {orders.map((order) => {
                    const isFullyPaid = (order.remainingAmount ?? 0) <= 0;
                    return (
                      <div
                        key={order.orderId}
                        className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors gap-3"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                              {order.orderId}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                order.status === "SELESAI" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                order.status === "BATAL" && "bg-red-50 text-red-700 border-red-200",
                                order.status !== "SELESAI" && order.status !== "BATAL" && "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {order.status}
                            </span>
                            {order.materialName && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                {order.materialName}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar size={12} className="text-slate-400" />
                              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            {order.itemCount !== undefined && (
                              <span className="flex items-center gap-1 font-medium">
                                <ShoppingBag size={12} className="text-slate-400" />
                                {order.itemCount} Pcs
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0 space-y-1">
                          <span className="text-sm font-black text-[#D25026] block">
                            {formatRupiah(order.totalAmount)}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full",
                              isFullyPaid
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-800"
                            )}
                          >
                            {isFullyPaid ? (
                              <>
                                <CheckCircle2 size={10} /> Lunas
                              </>
                            ) : (
                              <>Sisa {formatRupiah(order.remainingAmount || 0)}</>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {orders.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider italic">
                      Belum ada riwayat pesanan sebelumnya
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
