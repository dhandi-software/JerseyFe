/**
 * CustomJerseyCheckoutDesktop Component
 * Lean desktop coordinator for custom jersey ordering.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 UI Decomposition)
 */

import {
  ChevronLeft,
  User,
  CheckCircle2,
  ArrowRight,
  ShoppingCart,
  Info,
  Loader2,
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

export function CustomJerseyCheckoutDesktop({ title }: { title: string }) {
  const navigate = useNavigate();
  const checkout = useCustomJerseyCheckout();
  const {
    step, setStep, activeProduct, customDetails, paymentProofFile,
    isUploading, uploadProgress, toast, setToast, user, existingOrder,
    steps, formatRupiah, handleNextStep, handleSubmit, totalCalculated,
  } = checkout;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
      <CheckoutModals {...checkout} />

      {/* Top Navigation */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
        <div className="w-full px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate("/customer/custom-jersey")}
              className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors font-bold text-sm group cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              BACK TO SHOP
            </button>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="flex items-center gap-2 text-neutral-400 hover:text-[#D25026] transition-colors font-bold text-sm group border-l border-neutral-200 pl-6 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                PREVIOUS STEP
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D25026] rounded-xl flex items-center justify-center shadow-lg shadow-[#D25026]/20">
              <ShoppingCart className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-neutral-900">
              {title || "Checkout Process"}
            </h1>
          </div>

          <div className="flex items-center gap-8">
            {activeProduct && (
              <div className="hidden lg:flex items-center gap-3 pr-8 border-r border-neutral-100">
                {activeProduct.image && (
                  <img src={activeProduct.image} alt={activeProduct.title} className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shadow-sm" />
                )}
                <div className="text-right">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Bahan Baku</p>
                  <p className="text-xs font-black italic uppercase tracking-tight text-[#D25026]">{activeProduct.title}</p>
                </div>
              </div>
            )}
            <div className="hidden xl:flex items-center gap-3 pr-8 border-r border-neutral-100">
              <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100">
                <User className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Ordering as</p>
                <p className="text-xs font-black italic uppercase tracking-tight text-neutral-900">{user?.username || "Guest User"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Est. Total</p>
              <p className="text-lg font-black text-[#D25026] tracking-tighter">{formatRupiah(totalCalculated)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Horizontal Progress Bar */}
      <nav aria-label="Langkah Checkout" className="bg-white border-b border-neutral-100">
        <div className="w-full px-8 py-6">
          <div className="flex items-center justify-center gap-12">
            {steps.map((s) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              const Icon = s.icon;

              return (
                <div key={s.id} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                      isActive
                        ? "bg-black text-white"
                        : isCompleted
                          ? "bg-[#D25026] text-white"
                          : "bg-neutral-50 text-neutral-300",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-xs font-black uppercase tracking-tighter italic",
                        isActive ? "text-neutral-900" : "text-neutral-400",
                      )}
                    >
                      {s.name}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-300">
                      Step 0{s.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full px-8 py-12">
        <div className="space-y-12">
          {step === 1 && <RosterTableSection {...checkout} variant="desktop" />}

          {step === 2 && <CustomerDeliverySection {...checkout} />}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-3xl font-black text-neutral-900 italic uppercase tracking-tighter">
                  Detail Pembayaran
                </h2>
                <p className="text-neutral-400 font-medium mt-1">
                  Silakan lakukan pembayaran DP minimal 50% atau Pelunasan 100%.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                  <PaymentProofSection displayMode="bank-and-method" {...checkout} />
                  <CheckoutSummaryCard {...checkout} />
                </div>
                <PaymentProofSection displayMode="upload-only" {...checkout} />
              </div>
            </div>
          )}

          {/* Navigation Action Bar */}
          <div className="mt-12 flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm ring-1 ring-black/5">
            <Button
              type="button"
              variant="outline"
              onClick={() => (step === 1 ? navigate(-1) : setStep((prev) => prev - 1))}
              className="h-14 px-10 rounded-2xl border-neutral-200 text-[13px] font-black uppercase tracking-widest italic hover:bg-neutral-50 transition-all flex gap-3 cursor-pointer"
              disabled={isUploading}
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? "Exit Checkout" : "Previous Step"}
            </Button>

            <div className="flex items-center gap-4">
              {isUploading && (
                <div className="flex flex-col justify-center px-4 w-48">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic text-neutral-400 mb-1.5">
                    <span>Syncing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#D25026] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "flex items-center p-2 rounded-[1.5rem] shadow-2xl ring-1 ring-black/5 gap-2",
                  step === 1 && customDetails.length > 0
                    ? "bg-black"
                    : "bg-transparent",
                )}
              >
                {step === 1 && customDetails.length > 0 && !isUploading && (
                  <div className="flex items-center gap-4 pl-4 pr-2">
                    <div className="w-10 h-10 bg-[#D25026]/20 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-[#D25026]" />
                    </div>
                    <div className="min-w-[120px]">
                      <span className="text-[9px] font-black uppercase tracking-widest italic text-neutral-400 block leading-none mb-1">
                        Total Payment
                      </span>
                      <p className="text-lg font-black tracking-tighter text-white">
                        {formatRupiah(totalCalculated)}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => (step === 3 ? handleSubmit() : handleNextStep())}
                  className="h-[52px] px-8 rounded-xl bg-[#D25026] hover:bg-[#B34320] text-white text-[12px] font-black uppercase tracking-widest italic shadow-lg active:scale-95 transition-all flex gap-3 shrink-0 cursor-pointer"
                  disabled={
                    isUploading ||
                    (step === 3 &&
                      !paymentProofFile &&
                      !existingOrder?.paymentUrl)
                  }
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {step === 3 ? "Complete & Send Order" : "Continue to Next Step"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 flex justify-center">
            <div className="bg-[#FFF0EB] rounded-2xl px-6 py-3 border border-[#FFE0D5] flex items-center gap-3">
              <div className="w-6 h-6 bg-[#D25026] rounded-lg flex items-center justify-center shrink-0">
                <Info className="text-white w-3 h-3" />
              </div>
              <p className="text-[10px] text-[#B34320] font-bold italic uppercase tracking-tight">
                Butuh bantuan? Hubungi customer service kami jika Anda memerlukan bantuan dalam mengisi formulir pesanan jersey.
              </p>
            </div>
          </div>
        </div>
      </main>

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
