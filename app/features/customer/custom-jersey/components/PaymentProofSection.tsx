/**
 * PaymentProofSection Component
 * Step 3: BCA Account information, Full vs DP toggle with preset 50%, and upload proof dropzone.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 UI Decomposition)
 */

import { FileText, AlertCircle, CreditCard, X } from "lucide-react";
import { Label } from "~/components/ui/label";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";

export interface PaymentProofSectionProps {
  paymentProofFile: File | null;
  setPaymentProofFile: (file: File | null) => void;
  existingOrder: any | null;
  setExistingOrder: (updater: any) => void;
  paymentType: "FULL" | "DP";
  setPaymentType: (type: "FULL" | "DP") => void;
  dpAmountInput: number;
  setDpAmountInput: (val: number) => void;
  totalCalculated: number;
  effectivePaidAmount: number;
  effectiveRemainingAmount: number;
  formatRupiah: (num: number) => string;
  setToast: (toast: { show: boolean; message: string; variant: "success" | "destructive" | "default" }) => void;
  showValidation: boolean;
  step?: number;
  displayMode?: "all" | "bank-and-method" | "upload-only";
  [key: string]: any;
}

export function PaymentProofSection({
  paymentProofFile,
  setPaymentProofFile,
  existingOrder,
  setExistingOrder,
  paymentType,
  setPaymentType,
  dpAmountInput,
  setDpAmountInput,
  totalCalculated,
  effectivePaidAmount,
  effectiveRemainingAmount,
  formatRupiah,
  setToast,
  showValidation,
  step,
  displayMode = "all",
}: PaymentProofSectionProps) {
  const showBankAndMethod = displayMode === "all" || displayMode === "bank-and-method";
  const showUploadOnly = displayMode === "all" || displayMode === "upload-only";

  const renderBankDetails = () => (
    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 p-6 md:p-8 shadow-sm ring-1 ring-black/5 space-y-5 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="w-20 h-10 bg-[#00529C] rounded-lg flex items-center justify-center font-black text-white italic tracking-tighter text-2xl pr-1">
          BCA
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic">
          Official Account
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">
          Nomor Rekening
        </p>
        <div className="flex items-center gap-3">
          <p className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tighter italic">
            4921 8972 72
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText("4921897272");
              setToast({
                show: true,
                message: "Nomor rekening berhasil disalin ke clipboard",
                variant: "success",
              });
            }}
            className="p-2 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer text-neutral-400 hover:text-black"
            aria-label="Salin Nomor Rekening"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">
          Atas Nama
        </p>
        <p className="text-lg md:text-xl font-black text-neutral-900 tracking-tighter italic uppercase">
          BAHRUDIN YUSUF
        </p>
      </div>

      <div className="pt-5 border-t border-neutral-50 flex items-center gap-4">
        <div className="w-11 h-11 bg-[#FFF0EB] rounded-2xl flex items-center justify-center shrink-0">
          <AlertCircle className="text-[#D25026] w-5 h-5" />
        </div>
        <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
          Harap lampirkan bukti transfer. Pesanan akan diverifikasi maksimal 1x24 jam kerja setelah pembayaran.
        </p>
      </div>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-neutral-100 shadow-sm space-y-5 ring-1 ring-black/5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest italic text-neutral-400">
            Metode Pembayaran
          </p>
          <p className="text-sm font-bold text-neutral-800 mt-0.5">
            Pilih Bayar Penuh atau DP (Uang Muka)
          </p>
        </div>
        <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#D25026]">
          {paymentType === "DP" ? "Opsi DP" : "Full 100%"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPaymentType("FULL")}
          className={cn(
            "p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[85px] cursor-pointer",
            paymentType === "FULL"
              ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-sm"
              : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-200",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-tight text-neutral-900">
              Bayar Full Cash
            </span>
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center",
                paymentType === "FULL"
                  ? "border-[#D25026] bg-[#D25026]"
                  : "border-neutral-300",
              )}
            >
              {paymentType === "FULL" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Lunas 100% langsung di awal
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setPaymentType("DP");
            if (!dpAmountInput || dpAmountInput <= 0) {
              setDpAmountInput(Math.round(totalCalculated * 0.5));
            }
          }}
          className={cn(
            "p-4 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[85px] cursor-pointer",
            paymentType === "DP"
              ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-sm"
              : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-200",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-tight text-neutral-900">
              DP (Uang Muka)
            </span>
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center",
                paymentType === "DP"
                  ? "border-[#D25026] bg-[#D25026]"
                  : "border-neutral-300",
              )}
            >
              {paymentType === "DP" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 font-medium">
            Bayar sebagian, sisa pelunasan
          </p>
        </button>
      </div>

      {paymentType === "DP" && (
        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-900">
              Nominal DP yang Ditransfer
            </label>
            <button
              type="button"
              onClick={() =>
                setDpAmountInput(Math.round(totalCalculated * 0.5))
              }
              className="text-[10px] font-black uppercase tracking-wider text-[#D25026] bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-2xs hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Preset 50% ({formatRupiah(Math.round(totalCalculated * 0.5))})
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-sm">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={
                dpAmountInput > 0 ? dpAmountInput.toLocaleString("id-ID") : ""
              }
              onChange={(e) => {
                const rawDigits = e.target.value.replace(/\D/g, "");
                const parsed = rawDigits ? parseInt(rawDigits, 10) : 0;
                const val =
                  totalCalculated > 0
                    ? Math.min(totalCalculated, parsed)
                    : parsed;
                setDpAmountInput(val);
              }}
              placeholder={`Contoh: ${Math.round(totalCalculated * 0.5).toLocaleString("id-ID")}`}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-300/80 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/30"
            />
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/40">
            <span className="text-amber-800 font-medium">
              Sisa Tagihan Nanti:
            </span>
            <span className="font-black text-rose-600 text-sm">
              {formatRupiah(effectiveRemainingAmount)}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderUploadDropzone = () => (
    <div className="space-y-3">
      <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">
        Upload Bukti Transfer
      </Label>
      <div
        className={cn(
          "h-[20rem] md:h-[25rem] border-2 border-dashed border-neutral-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-center gap-4 bg-white hover:bg-neutral-50 hover:border-[#D25026]/30 transition-all cursor-pointer group relative overflow-hidden shadow-sm ring-1 ring-black/5",
          showValidation &&
            step === 3 &&
            !paymentProofFile &&
            !existingOrder?.paymentUrl &&
            "border-red-500 bg-red-50/10",
        )}
      >
        {paymentProofFile || existingOrder?.paymentUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
            {paymentProofFile ? (
              paymentProofFile.type.includes("pdf") ||
              paymentProofFile.name.toLowerCase().endsWith(".pdf") ? (
                <div className="w-20 md:w-24 h-20 md:h-24 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                  <FileText className="w-10 md:w-12 h-10 md:h-12 text-red-500" />
                </div>
              ) : (
                <img
                  src={URL.createObjectURL(paymentProofFile)}
                  alt="Bukti Transfer"
                  className="w-full h-full object-contain mb-2 rounded-xl"
                />
              )
            ) : existingOrder.paymentUrl.toLowerCase().endsWith(".pdf") ? (
              <div className="w-20 md:w-24 h-20 md:h-24 bg-red-50 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                <FileText className="w-10 md:w-12 h-10 md:h-12 text-red-500" />
              </div>
            ) : (
              <img
                src={
                  existingOrder.paymentUrl.startsWith("http")
                    ? existingOrder.paymentUrl
                    : `${UPLOADS_URL}${existingOrder.paymentUrl.startsWith("/") ? "" : "/"}${existingOrder.paymentUrl}`
                }
                alt="Bukti Transfer Tersimpan"
                className="w-full h-full object-contain mb-2 rounded-xl"
              />
            )}
            <p className="text-[10px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
              {paymentProofFile
                ? paymentProofFile.name
                : "Bukti Transfer Tersimpan"}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPaymentProofFile(null);
                if (existingOrder) {
                  setExistingOrder((prev: any) => ({ ...prev, paymentUrl: "" }));
                }
              }}
              className="absolute top-5 right-5 z-20 w-9 h-9 md:w-10 md:h-10 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-lg cursor-pointer"
              title="Hapus File"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 md:w-20 h-16 md:h-20 bg-neutral-50 rounded-3xl flex items-center justify-center group-hover:bg-[#FFF0EB] transition-colors">
              <CreditCard className="w-8 md:w-10 h-8 md:h-10 text-neutral-300 group-hover:text-[#D25026]" />
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-black italic uppercase text-neutral-900 tracking-tighter">
                Unggah Bukti Transfer
              </p>
              <p className="text-[11px] font-bold text-neutral-400 mt-1 uppercase tracking-widest max-w-[200px]">
                PNG, JPG atau PDF hingga 5MB
              </p>
            </div>
          </>
        )}

        <input
          type="file"
          accept="image/*,.pdf"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          aria-label="Upload Bukti Transfer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPaymentProofFile(file);
              setToast({
                show: true,
                message: "Bukti pembayaran berhasil dipilih!",
                variant: "success",
              });
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {showBankAndMethod && (
        <div className="space-y-6">
          {renderBankDetails()}
          {renderPaymentMethod()}
        </div>
      )}
      {showUploadOnly && renderUploadDropzone()}
    </div>
  );
}
