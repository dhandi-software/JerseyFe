/**
 * CheckoutSummaryCard Component
 * Step 3: Dark order summary card with item totals, payment type badges, and down payment breakdown.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 UI Decomposition)
 */

import { ShoppingCart } from "lucide-react";
import type { CustomJerseyDetailItem } from "~/types";

export interface CheckoutSummaryCardProps {
  customDetails: CustomJerseyDetailItem[];
  paymentType: "FULL" | "DP";
  totalCalculated: number;
  effectivePaidAmount: number;
  effectiveRemainingAmount: number;
  formatRupiah: (num: number) => string;
  [key: string]: any;
}

export function CheckoutSummaryCard({
  customDetails,
  paymentType,
  totalCalculated,
  effectivePaidAmount,
  effectiveRemainingAmount,
  formatRupiah,
}: CheckoutSummaryCardProps) {
  return (
    <div className="bg-black text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-black/10">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[11px] font-black uppercase tracking-widest italic text-neutral-400">
          Ringkasan Pesanan
        </p>
        <ShoppingCart className="w-5 h-5 opacity-30 text-white" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-400 font-medium">Jumlah Jersey</span>
          <span className="font-bold tracking-tight text-white">
            {customDetails.length} Pcs
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-400 font-medium">Metode Pembayaran</span>
          <span className="font-bold tracking-tight text-amber-400">
            {paymentType === "DP" ? "DP (Uang Muka)" : "Full Cash (100%)"}
          </span>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-base font-black uppercase tracking-tighter italic text-white">
            Total Biaya
          </span>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white">
            {formatRupiah(totalCalculated)}
          </span>
        </div>

        {paymentType === "DP" && (
          <>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
              <span className="text-neutral-400 font-medium">
                Dibayar Sekarang (DP)
              </span>
              <span className="text-base md:text-lg font-black tracking-tighter text-[#D25026]">
                {formatRupiah(effectivePaidAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-400 font-medium">
                Sisa Tagihan Nanti
              </span>
              <span className="text-base md:text-lg font-black tracking-tighter text-rose-400">
                {formatRupiah(effectiveRemainingAmount)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
