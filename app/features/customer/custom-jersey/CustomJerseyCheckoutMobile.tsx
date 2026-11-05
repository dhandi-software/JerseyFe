/**
 * CustomJerseyCheckoutMobile Component
 * Lean mobile coordinator for custom jersey ordering.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 UI Decomposition)
 */

import {
  ChevronLeft,
  User,
  CheckCircle2,
  ShoppingCart,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Toast } from "~/components/ui/toast";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router";
import { useCustomJerseyCheckout } from "~/hooks";
import {
  CheckoutModals,
  RosterTableSection,
  CustomerDeliverySection,
  PaymentProofSection,
  CheckoutSummaryCard,
} from "./components";

export function CustomJerseyCheckoutMobile({ title }: { title: string }) {
  const navigate = useNavigate();
  const checkout = useCustomJerseyCheckout();
  const {
    step,
    setStep,
    paymentProofFile,
    isUploading,
    uploadProgress,
    toast,
    setToast,
    user,
    existingOrder,
    steps,
    formatRupiah,
    handleNextStep,
    handleSubmit,
    totalCalculated,
  } = checkout;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-['Inter']">
      <CheckoutModals {...checkout} />

      {/* Mobile Header */}
      <header className="bg-white px-5 py-4 border-b border-neutral-100 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate("/customer/custom-jersey")}
            className="p-2 -ml-2 text-neutral-400 hover:text-black cursor-pointer"
            aria-label="Tutup Checkout"
          >
            <X className="w-5 h-5" />
          </button>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="p-1 text-neutral-400 hover:text-black border-l border-neutral-200 pl-2 cursor-pointer"
              aria-label="Kembali ke Langkah Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#D25026] rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-white w-3.5 h-3.5" />
            </div>
            <span className="font-black italic uppercase text-xs tracking-tighter text-neutral-900">
              {title || "Checkout"}
            </span>
          </div>
          <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest mt-0.5 italic leading-none">
            {user?.username || "Guest User"}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
          <User className="w-4 h-4 text-neutral-400" />
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <nav aria-label="Langkah Pemesanan" className="bg-white px-4 py-3 border-b border-neutral-100 shrink-0">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                      isActive
                        ? "bg-[#D25026] text-white ring-4 ring-[#D25026]/10"
                        : isCompleted
                          ? "bg-black text-white"
                          : "bg-neutral-100 text-neutral-400",
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-tight italic",
                      isActive
                        ? "text-neutral-900"
                        : isCompleted
                          ? "text-neutral-600"
                          : "text-neutral-400",
                    )}
                  >
                    {s.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-2 h-0.5 bg-neutral-100" />
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-8 overflow-y-auto">
        <div className="space-y-6">
          {step === 1 && <RosterTableSection {...checkout} variant="mobile" />}

          {step === 2 && <CustomerDeliverySection {...checkout} />}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-black text-neutral-900 italic uppercase tracking-tight">
                  Pembayaran
                </h2>
                <p className="text-neutral-400 text-xs font-medium mt-0.5">
                  Transfer DP minimal 50% atau Pelunasan 100%.
                </p>
              </div>

              <PaymentProofSection displayMode="all" {...checkout} />
              <CheckoutSummaryCard {...checkout} />
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <footer className="bg-white border-t border-neutral-100 p-4 sticky bottom-0 z-50 shrink-0">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black uppercase italic text-neutral-400">
            {step === 3 ? "Total Tagihan" : "Estimasi Subtotal"}
          </span>
          <span className="text-lg font-black italic tracking-tighter text-[#D25026]">
            {formatRupiah(totalCalculated)}
          </span>
        </div>

        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 1 ? navigate(-1) : setStep((s) => s - 1))}
            className="flex-1 h-12 rounded-xl border-neutral-200 text-xs font-black uppercase italic cursor-pointer"
            disabled={isUploading}
          >
            {step === 1 ? "Exit" : "Back"}
          </Button>
          <Button
            type="button"
            onClick={() => (step === 3 ? handleSubmit() : handleNextStep())}
            disabled={
              isUploading ||
              (step === 3 &&
                !paymentProofFile &&
                !existingOrder?.paymentUrl)
            }
            className="flex-[2] h-12 rounded-xl bg-[#D25026] hover:bg-[#B34320] text-white text-xs font-black uppercase italic shadow-lg shadow-[#D25026]/20 cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 3 ? (
              "Kirim Pesan Sekarang"
            ) : (
              "Langkah Berikutnya"
            )}
          </Button>
        </div>

        {isUploading && (
          <div className="mt-3 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D25026] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </footer>

      {toast.show && (
        <Toast
          title={toast.message}
          variant={toast.variant}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
