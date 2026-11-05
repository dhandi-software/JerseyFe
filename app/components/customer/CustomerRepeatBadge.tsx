import { Award, History, X, Sparkles } from "lucide-react";
import { cn, formatRupiah } from "~/lib/utils";
import type { CustomerSuggestion } from "~/types/customerTracking";

interface CustomerRepeatBadgeProps {
  customer: CustomerSuggestion;
  onOpenHistory: () => void;
  onClear?: () => void;
  variant?: "desktop" | "mobile";
  className?: string;
}

export function CustomerRepeatBadge({
  customer,
  onOpenHistory,
  onClear,
  variant = "desktop",
  className,
}: CustomerRepeatBadgeProps) {
  const isRepeat = customer.totalOrders > 1;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex items-center justify-between gap-3 font-geist transition-all",
        isRepeat
          ? "bg-amber-50/70 border-amber-200/90 text-amber-950 shadow-xs"
          : "bg-indigo-50/70 border-indigo-200/90 text-indigo-950 shadow-xs",
        variant === "mobile" && "flex-col items-stretch p-3 gap-2.5",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
            isRepeat ? "bg-amber-500 text-white" : "bg-indigo-600 text-white"
          )}
        >
          {isRepeat ? <Award size={18} /> : <Sparkles size={18} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-black uppercase italic tracking-wider">
              {isRepeat ? `Pelanggan Setia: ${customer.totalOrders} Pesanan` : "Pelanggan Terdaftar (1 Pesanan)"}
            </h4>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                isRepeat
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-indigo-100 text-indigo-800 border-indigo-300"
              )}
            >
              LTV: {formatRupiah(customer.totalSpent)}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 mt-0.5 truncate">
            {customer.customerName} {customer.customerPhone ? `· ${customer.customerPhone}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 justify-end">
        <button
          type="button"
          onClick={onOpenHistory}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider italic transition-all cursor-pointer border shadow-2xs",
            isRepeat
              ? "bg-white hover:bg-amber-100 text-amber-900 border-amber-300"
              : "bg-white hover:bg-indigo-100 text-indigo-900 border-indigo-300"
          )}
        >
          <History size={12} />
          <span>Lihat Riwayat Pesanan</span>
        </button>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
            title="Lepas data pelanggan ini"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
