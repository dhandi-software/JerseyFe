import React, { useState, useEffect, useRef } from "react";
import { 
    CreditCard, 
    FileText, 
    Upload, 
    Clock, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    Plus, 
    X, 
    Check, 
    Eye, 
    ExternalLink, 
    Receipt, 
    Calendar,
    Wallet
} from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import { formatRupiah, cn, convertImageToWebP } from "~/lib/utils";
import { uploadService } from "~/services/uploadService";
import { usePaymentInstallments } from "~/hooks/usePaymentInstallments";
import type { MonitoringOrder } from "~/types";
import type { OrderPayment, AddPaymentPayload } from "~/types/payment";

interface PaymentVerificationSectionProps {
    order: MonitoringOrder;
    isUploadingProof?: boolean;
    handleUploadProof?: (e: React.ChangeEvent<HTMLInputElement>, slot?: "DP" | "FULL") => Promise<void>;
    onPaymentAdded?: (updatedOrderData: { id?: number; rawId?: number; paidAmount: number; remainingAmount: number; paymentType: string; paymentUrl?: string }) => void;
    onUpdatePayment?: (orderId: number, data: { paymentType?: string; paidAmount?: number; remainingAmount?: number; paymentUrl?: string }, skipApi?: boolean) => Promise<any>;
    variant?: "desktop" | "mobile";
}

const resolveFullProofUrl = (rawPath?: string | null): string => {
    if (!rawPath) return "";
    const trimmed = rawPath.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http")) return trimmed;
    return `${UPLOADS_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

const formatDateTime = (dateString?: string | Date): string => {
    if (!dateString) return "-";
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return String(dateString);
        return d.toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return String(dateString);
    }
};

export function PaymentVerificationSection({
    order,
    onPaymentAdded,
    onUpdatePayment,
    variant = "desktop"
}: PaymentVerificationSectionProps) {
    const isMobile = variant === "mobile";

    // Consume usePaymentInstallments hook
    const {
        payments,
        loading: isLoadingPayments,
        isSubmitting: isSubmittingPayment,
        error: hookError,
        setError: setHookError,
        summary,
        selectedProof,
        openProofModal,
        closeProofModal,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        recordPayment
    } = usePaymentInstallments({
        initialPayments: order.payments,
        totalAmount: Number(order.totalAmount) || 0,
        initialPaidAmount: Number(order.paidAmount) || 0,
        orderId: order.rawId,
        onPaymentAdded: (updatedOrder) => {
            if (onPaymentAdded) {
                onPaymentAdded(updatedOrder);
            } else if (onUpdatePayment && order.rawId) {
                onUpdatePayment(order.rawId, {
                    paidAmount: updatedOrder.paidAmount,
                    remainingAmount: updatedOrder.remainingAmount,
                    paymentType: updatedOrder.paymentType,
                    paymentUrl: updatedOrder.paymentUrl
                }, true);
            }
        }
    });

    // Local form states
    const [formNominal, setFormNominal] = useState<number>(0);
    const [formStage, setFormStage] = useState<"DP" | "PELUNASAN">("DP");
    const [formMethod, setFormMethod] = useState<string>("TRANSFER");
    const [formNotes, setFormNotes] = useState<string>("");
    const [formProofUrl, setFormProofUrl] = useState<string>("");
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [localFormError, setLocalFormError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const formError = localFormError || hookError;
    const setFormError = (msg: string | null) => {
        setLocalFormError(msg);
        setHookError(msg);
    };

    // Keyboard accessibility: Escape key closes active modal & locks body scroll (Finding 5)
    useEffect(() => {
        const isAnyModalOpen = isAddModalOpen || selectedProof !== null;
        if (!isAnyModalOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                if (selectedProof !== null) {
                    closeProofModal();
                } else if (isAddModalOpen) {
                    handleCloseAddModal();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isAddModalOpen, selectedProof, closeProofModal]);

    // Reset and prepare Add Modal (Finding 3: defaults to DP and 0 nominal)
    const handleOpenAddModal = () => {
        setFormNominal(0);
        setFormStage("DP");
        setFormMethod("TRANSFER");
        setFormNotes("");
        setFormProofUrl("");
        setFormError(null);
        openAddModal();
    };

    const handleCloseAddModal = () => {
        closeAddModal();
        setFormError(null);
    };

    // Nominal formatting with comma thousands & dynamic stage auto-switch (Finding 3)
    const handleNominalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/\D/g, "");
        const val = parseInt(rawDigits, 10) || 0;
        setFormNominal(val);
        setFormError(null);

        // Auto switch stage to PELUNASAN only if exact remaining, or DP if less
        if (val === summary.remainingAmount && val > 0) {
            setFormStage("PELUNASAN");
        } else if (val < summary.remainingAmount) {
            setFormStage("DP");
        }
    };

    // File upload handler
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingFile(true);
        setFormError(null);
        try {
            const isImage = file.type.startsWith("image/");
            const fileToUpload = isImage ? await convertImageToWebP(file) : file;
            const res = await uploadService.uploadFile(fileToUpload);
            if (res?.url) {
                setFormProofUrl(res.url);
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            setFormError("Gagal mengunggah berkas bukti. Silakan coba lagi.");
        } finally {
            setIsUploadingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Submit new installment (Finding 4: Single flight via recordPayment, 0 redundant PATCH)
    const handleSaveInstallment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formNominal <= 0) {
            setFormError("Nominal pembayaran harus lebih besar dari 0");
            return;
        }

        if (formNominal > summary.remainingAmount) {
            setFormError(`Nominal tidak boleh melebihi sisa tagihan (${formatRupiah(summary.remainingAmount)})`);
            return;
        }

        setFormError(null);
        try {
            const payload: AddPaymentPayload = {
                amount: formNominal,
                stage: formStage,
                paymentMethod: formMethod,
                proofUrl: formProofUrl || null,
                notes: formNotes ? formNotes.trim() : null
            };

            await recordPayment(order.rawId, payload);
            handleCloseAddModal();
        } catch {
            // Error managed by hook and set into formError
        }
    };

    return (
        <div className="space-y-4">
            {/* Header with Title and Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className={isMobile ? "text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic" : "text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic"}>
                    <div className="w-8 h-8 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                        <Wallet className="text-[#D25026]" size={16} />
                    </div>
                    <span>Buku Besar Pembayaran (Installment Ledger)</span>
                </h3>

                <div className="flex items-center gap-2">
                    {summary.remainingAmount > 0 ? (
                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            className="inline-flex items-center gap-2 min-h-11 px-4 py-2.5 rounded-xl bg-[#D25026] text-white hover:bg-[#B34320] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 text-xs font-black uppercase tracking-wider transition-colors shadow-xs cursor-pointer active:scale-95"
                        >
                            <Plus size={15} />
                            <span>+ Tambah Angsuran DP</span>
                        </button>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            Lunas Sempurna
                        </span>
                    )}
                </div>
            </div>

            {/* Container */}
            <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xs space-y-5 ${isMobile ? "p-4" : "p-6"}`}>
                
                {/* Summary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Card 1: Total Tagihan */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-600 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                Total Tagihan
                            </span>
                            <Receipt size={14} className="text-slate-400" />
                        </div>
                        <div>
                            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block">
                                {formatRupiah(summary.totalAmount)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                                Nilai bersih nota pemesanan
                            </span>
                        </div>
                    </div>

                    {/* Card 2: Total DP Masuk */}
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/70 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-slate-600 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                Total DP Masuk
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#D25026]/10 text-[#D25026]">
                                {payments.length} Angsuran
                            </span>
                        </div>
                        <div>
                            <span className="text-base sm:text-lg font-black text-[#D25026] tracking-tight block">
                                {formatRupiah(summary.paidAmount)}
                            </span>
                            <span className="text-[10px] text-slate-600 font-medium block mt-0.5">
                                Akumulasi setoran terverifikasi
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Sisa Tagihan */}
                    <div className={cn(
                        "p-4 rounded-2xl border transition-colors flex flex-col justify-between",
                        summary.remainingAmount > 0 
                            ? "bg-rose-50/70 border-rose-100" 
                            : "bg-emerald-50/70 border-emerald-100"
                    )}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Sisa Tagihan
                            </span>
                            {summary.remainingAmount > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                                    <AlertCircle size={11} />
                                    Belum Lunas
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                    <CheckCircle2 size={11} />
                                    Lunas
                                </span>
                            )}
                        </div>
                        <div>
                            <span className={cn(
                                "text-base sm:text-lg font-black tracking-tight block",
                                summary.remainingAmount > 0 ? "text-rose-600" : "text-emerald-700"
                            )}>
                                {formatRupiah(summary.remainingAmount)}
                            </span>
                            <span className="text-[10px] text-slate-600 font-medium block mt-0.5">
                                {summary.remainingAmount > 0 ? "Kewajiban pelunasan pelanggan" : "Semua pembayaran telah tuntas"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Installment History Section */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                            <Calendar size={13} className="text-[#D25026]" />
                            Riwayat Angsuran Pembayaran
                        </span>
                        {isLoadingPayments && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                <Loader2 size={12} className="animate-spin text-[#D25026]" />
                                Memuat data...
                            </span>
                        )}
                    </div>

                    {/* Table or Card list */}
                    {payments.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                            <CreditCard className="mx-auto text-slate-300 mb-2" size={32} />
                            <p className="text-xs font-bold text-slate-700">Belum ada riwayat angsuran DP yang dicatat</p>
                            <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                                Klik tombol di bawah untuk mencatat pembayaran uang muka (DP) pertama dari pelanggan.
                            </p>
                            <button
                                type="button"
                                onClick={handleOpenAddModal}
                                className="mt-4 inline-flex items-center gap-2 min-h-11 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#D25026] hover:bg-slate-50 text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>+ Catat DP Pertama</span>
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                            {/* Desktop View Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50/90 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                                        <tr>
                                            <th className="py-3 px-4">Tahap / Ke</th>
                                            <th className="py-3 px-4">Tanggal & Waktu</th>
                                            <th className="py-3 px-4">Metode</th>
                                            <th className="py-3 px-4">Catatan</th>
                                            <th className="py-3 px-4 text-right">Nominal</th>
                                            <th className="py-3 px-4 text-center">Bukti Bayar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                                        {payments.map((item, idx) => {
                                            const proof = resolveFullProofUrl(item.proofUrl);
                                            const isPdf = proof.toLowerCase().endsWith(".pdf");
                                            const stageName = item.stage === "PELUNASAN" 
                                                ? "Pelunasan" 
                                                : `DP ${item.installmentNo || idx + 1}`;

                                            return (
                                                <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="py-3.5 px-4 font-bold">
                                                        <span className={cn(
                                                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                            item.stage === "PELUNASAN"
                                                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                                : "bg-amber-50 text-amber-800 border border-amber-200"
                                                        )}>
                                                            {stageName}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                                                        {formatDateTime(item.createdAt)}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                                                            {item.paymentMethod || "TRANSFER"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                                                        {item.notes || <span className="text-slate-400 italic">Tanpa catatan</span>}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                                                        {formatRupiah(item.amount)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        {proof ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => openProofModal(proof, `Bukti ${stageName} - ${formatRupiah(item.amount)}`)}
                                                                className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-[44px] px-3.5 py-2 rounded-xl bg-orange-50 text-[#D25026] hover:bg-orange-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 text-xs font-bold transition-colors cursor-pointer"
                                                            >
                                                                {isPdf ? <FileText size={14} /> : <Eye size={14} />}
                                                                <span>Lihat Bukti</span>
                                                            </button>
                                                        ) : (
                                                            <span className="text-[11px] text-slate-400 italic">
                                                                Tanpa bukti
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View Card Stacking (Reflow compliant, zero horizontal scroll) */}
                            <div className="md:hidden divide-y divide-slate-100">
                                {payments.map((item, idx) => {
                                    const proof = resolveFullProofUrl(item.proofUrl);
                                    const isPdf = proof.toLowerCase().endsWith(".pdf");
                                    const stageName = item.stage === "PELUNASAN" 
                                        ? "Pelunasan" 
                                        : `DP ${item.installmentNo || idx + 1}`;

                                    return (
                                        <div key={item.id || idx} className="p-4 space-y-2.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                    item.stage === "PELUNASAN"
                                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                        : "bg-amber-50 text-amber-800 border border-amber-200"
                                                )}>
                                                    {stageName}
                                                </span>
                                                <span className="font-black text-slate-900 text-sm">
                                                    {formatRupiah(item.amount)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                <span>{formatDateTime(item.createdAt)}</span>
                                                <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase">
                                                    {item.paymentMethod || "TRANSFER"}
                                                </span>
                                            </div>

                                            {item.notes && (
                                                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                    {item.notes}
                                                </p>
                                            )}

                                            {proof && (
                                                <div className="pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openProofModal(proof, `Bukti ${stageName} - ${formatRupiah(item.amount)}`)}
                                                        className="w-full inline-flex items-center justify-center gap-1.5 min-h-11 px-3 py-2 rounded-xl bg-orange-50 text-[#D25026] hover:bg-orange-100 text-xs font-bold transition-colors cursor-pointer"
                                                    >
                                                        {isPdf ? <FileText size={14} /> : <Eye size={14} />}
                                                        <span>Lihat Lampiran Bukti Transfer</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal + Tambah Angsuran DP */}
            {isAddModalOpen && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-add-installment-title"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleCloseAddModal();
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] cursor-default"
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h4 id="modal-add-installment-title" className="text-sm font-black uppercase tracking-wider text-slate-900">
                                    Catat Angsuran DP Baru
                                </h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Angsuran ke-{payments.length + 1} untuk pesanan #{order.id}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseAddModal}
                                aria-label="Tutup form modal"
                                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSaveInstallment} className="p-5 overflow-y-auto space-y-4">
                            {/* Remaining Info Banner */}
                            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-900">
                                    Sisa Tagihan Saat Ini:
                                </span>
                                <span className="text-sm font-black text-amber-900">
                                    {formatRupiah(summary.remainingAmount)}
                                </span>
                            </div>

                            {formError && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                                    <AlertCircle size={15} className="shrink-0 text-rose-600" />
                                    <span>{formError}</span>
                                </div>
                            )}

                            {/* Nominal Input */}
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <label htmlFor="field-installment-nominal" className="text-xs font-bold text-slate-800">
                                        Nominal Pembayaran (Rp) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const half = Math.round(summary.remainingAmount * 0.5);
                                                setFormNominal(half);
                                                setFormStage("DP");
                                            }}
                                            className="inline-flex items-center justify-center min-h-11 min-w-[44px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400"
                                        >
                                            50%
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormNominal(summary.remainingAmount);
                                                setFormStage("PELUNASAN");
                                            }}
                                            className="inline-flex items-center justify-center min-h-11 min-w-[44px] px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
                                        >
                                            Sisa Lunas
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                                        Rp
                                    </span>
                                    <input
                                        id="field-installment-nominal"
                                        type="text"
                                        inputMode="numeric"
                                        required
                                        placeholder="0"
                                        value={formNominal > 0 ? formNominal.toLocaleString("id-ID") : ""}
                                        onChange={handleNominalInput}
                                        className="w-full min-h-11 pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                    />
                                </div>
                                {formNominal > summary.remainingAmount && (
                                    <p className="text-[11px] text-rose-600 font-bold">
                                        Nominal melebihi sisa tagihan ({formatRupiah(summary.remainingAmount)})
                                    </p>
                                )}
                            </div>

                            {/* Stage & Payment Method */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label htmlFor="field-installment-stage" className="text-xs font-bold text-slate-800">
                                        Tahapan
                                    </label>
                                    <select
                                        id="field-installment-stage"
                                        value={formStage}
                                        onChange={(e) => setFormStage(e.target.value as "DP" | "PELUNASAN")}
                                        className="w-full min-h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                    >
                                        <option value="DP">DP (Uang Muka)</option>
                                        <option value="PELUNASAN">Pelunasan</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="field-installment-method" className="text-xs font-bold text-slate-800">
                                        Metode Pembayaran
                                    </label>
                                    <select
                                        id="field-installment-method"
                                        value={formMethod}
                                        onChange={(e) => setFormMethod(e.target.value)}
                                        className="w-full min-h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                    >
                                        <option value="TRANSFER">Transfer Bank</option>
                                        <option value="CASH">Tunai / Cash</option>
                                        <option value="QRIS">QRIS</option>
                                        <option value="LAINNYA">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            {/* Notes Input */}
                            <div className="space-y-1.5">
                                <label htmlFor="field-installment-notes" className="text-xs font-bold text-slate-800">
                                    Catatan / Keterangan (Opsional)
                                </label>
                                <input
                                    id="field-installment-notes"
                                    type="text"
                                    placeholder="Contoh: DP Tahap 2 via BCA an. Pelanggan"
                                    value={formNotes}
                                    onChange={(e) => setFormNotes(e.target.value)}
                                    className="w-full min-h-11 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                />
                            </div>

                            {/* Proof Upload */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-800 block">
                                    Bukti Pembayaran (Foto / PDF)
                                </label>
                                <div className="flex items-center gap-3">
                                    <label className={cn(
                                        "inline-flex items-center gap-2 min-h-11 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs",
                                        isUploadingFile && "opacity-50 pointer-events-none"
                                    )}>
                                        {isUploadingFile ? (
                                            <Loader2 size={15} className="animate-spin text-[#D25026]" />
                                        ) : (
                                            <Upload size={15} className="text-[#D25026]" />
                                        )}
                                        <span>{formProofUrl ? "Ganti File Bukti" : "Pilih File Bukti"}</span>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                            disabled={isUploadingFile}
                                            className="sr-only"
                                        />
                                    </label>
                                    {formProofUrl && (
                                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                                            <CheckCircle2 size={13} />
                                            Bukti terunggah
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleCloseAddModal}
                                    className="min-h-11 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingPayment || formNominal <= 0 || formNominal > summary.remainingAmount}
                                    className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-xl bg-[#D25026] text-white text-xs font-black uppercase tracking-wider hover:bg-[#B34320] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmittingPayment ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check size={14} />
                                            <span>Simpan Pembayaran</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Proof Modal Viewer */}
            {selectedProof && (
                <div 
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-proof-title"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeProofModal();
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] cursor-default"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <span id="modal-proof-title" className="text-xs font-black uppercase tracking-wider text-slate-900 truncate pr-2">
                                {selectedProof.title}
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={selectedProof.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-1.5 min-h-11 min-w-[44px] px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 text-xs font-bold shadow-2xs transition-colors"
                                >
                                    <ExternalLink size={14} />
                                    <span>Buka Asli</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={closeProofModal}
                                    aria-label="Tutup preview bukti"
                                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-900/5 min-h-[16rem]">
                            {selectedProof.isPdf ? (
                                <div className="text-center p-6 space-y-3">
                                    <FileText className="mx-auto text-emerald-600" size={48} />
                                    <p className="text-xs font-bold text-slate-800">Dokumen Bukti Transfer (PDF)</p>
                                    <a
                                        href={selectedProof.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 min-h-11 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                                    >
                                        <ExternalLink size={14} />
                                        <span>Buka PDF di Tab Baru</span>
                                    </a>
                                </div>
                            ) : (
                                <img
                                    src={selectedProof.url}
                                    alt={selectedProof.title}
                                    className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain border border-slate-200 shadow-xs"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
