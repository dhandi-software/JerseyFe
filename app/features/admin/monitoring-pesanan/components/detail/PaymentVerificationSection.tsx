import React, { useState, useEffect } from "react";
import { CreditCard, FileText, Upload, Clock, Loader2, CheckCircle2, AlertCircle, Edit3, X, Check } from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import { formatRupiah, cn } from "~/lib/utils";
import { parsePaymentProofUrls } from "~/features/admin/monitoring-pesanan/utils";
import type { MonitoringOrder } from "~/types";

interface PaymentVerificationSectionProps {
    order: MonitoringOrder;
    isUploadingProof: boolean;
    handleUploadProof: (e: React.ChangeEvent<HTMLInputElement>, slot?: "DP" | "FULL") => Promise<void>;
    onUpdatePayment?: (orderId: number, data: { paymentType?: string; paidAmount?: number; remainingAmount?: number }) => Promise<any>;
    variant?: "desktop" | "mobile";
}

const resolveFullProofUrl = (rawPath: string): string => {
    if (!rawPath) return "";
    if (rawPath.startsWith("http")) return rawPath;
    return `${UPLOADS_URL}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};

export function PaymentVerificationSection({
    order,
    isUploadingProof,
    handleUploadProof,
    onUpdatePayment,
    variant = "desktop"
}: PaymentVerificationSectionProps) {
    const isMobile = variant === "mobile";
    const { dpProofUrl, fullProofUrl, isAwaitingAdmin } = parsePaymentProofUrls(
        order.paymentProofUrl,
        order.paymentType
    );
    const resolvedDpUrl = resolveFullProofUrl(dpProofUrl);
    const resolvedFullUrl = resolveFullProofUrl(fullProofUrl);

    const totalOrderAmount = order.totalAmount || 0;
    const isDP = order.paymentType === "DP" || (order.paidAmount !== undefined && order.paidAmount > 0 && order.paidAmount < totalOrderAmount);
    const currentPaid = order.paidAmount !== undefined ? order.paidAmount : (isDP ? 0 : totalOrderAmount);
    const currentRemaining = order.remainingAmount !== undefined ? order.remainingAmount : Math.max(0, totalOrderAmount - currentPaid);

    const [isEditing, setIsEditing] = useState(false);
    const [editType, setEditType] = useState<"FULL" | "DP">(isDP ? "DP" : "FULL");
    const [editPaid, setEditPaid] = useState<number>(currentPaid);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingSlot, setUploadingSlot] = useState<"DP" | "FULL" | null>(null);

    useEffect(() => {
        setEditType(isDP ? "DP" : "FULL");
        setEditPaid(currentPaid);
    }, [order.paymentType, order.paidAmount, order.totalAmount]);

    useEffect(() => {
        if (!isUploadingProof) {
            setUploadingSlot(null);
        }
    }, [isUploadingProof]);

    // Format nominal input with comma thousand separators; return empty string for 0 so the field clears cleanly.
    const formatNominalInput = (amount: number): string => {
        if (!amount || amount <= 0) return "";
        return amount.toLocaleString("en-US");
    };

    const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/\D/g, "");
        if (!rawDigits) {
            setEditPaid(0);
            return;
        }
        const parsed = parseInt(rawDigits, 10) || 0;
        setEditPaid(Math.min(totalOrderAmount, Math.max(0, parsed)));
    };

    const onSlotFileChange = async (e: React.ChangeEvent<HTMLInputElement>, slot: "DP" | "FULL") => {
        setUploadingSlot(slot);
        await handleUploadProof(e, slot);
    };

    const activeEditSlot: "DP" | "FULL" = editType === "DP" && editPaid < totalOrderAmount ? "DP" : "FULL";
    const activeEditHasProof = activeEditSlot === "DP" ? Boolean(resolvedDpUrl) : Boolean(resolvedFullUrl);

    const handleSave = async () => {
        if (!onUpdatePayment) return;
        setIsSaving(true);
        try {
            const finalPaid = editType === "DP" ? Math.min(editPaid, totalOrderAmount) : totalOrderAmount;
            const finalRemaining = Math.max(0, totalOrderAmount - finalPaid);
            await onUpdatePayment(order.rawId, {
                paymentType: editType,
                paidAmount: finalPaid,
                remainingAmount: finalRemaining
            });
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    };

    const proofColumns: Array<{
        slot: "DP" | "FULL";
        title: string;
        badgeText: string;
        subtitle: string;
        url: string;
        buttonShortLabel: string;
        isPrimary: boolean;
    }> = [
        {
            slot: "DP",
            title: "Bukti Pembayaran DP",
            badgeText: "Uang Muka",
            subtitle: currentPaid > 0 && isDP
                ? `Nominal DP: ${formatRupiah(currentPaid)}`
                : "Unggah bukti transfer DP (otomatis WebP)",
            url: resolvedDpUrl,
            buttonShortLabel: "Bukti DP",
            isPrimary: isDP && currentRemaining > 0
        },
        {
            slot: "FULL",
            title: "Bukti Pembayaran Full",
            badgeText: isDP ? "Pelunasan" : "Full Cash",
            subtitle: isDP && currentRemaining > 0
                ? `Sisa pelunasan: ${formatRupiah(currentRemaining)}`
                : `Total lunas: ${formatRupiah(totalOrderAmount)}`,
            url: resolvedFullUrl,
            buttonShortLabel: "Bukti Full",
            isPrimary: !isDP || currentRemaining === 0
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className={isMobile ? "text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic" : "text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic"}>
                    <div className="w-8 h-8 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                        <CreditCard className="text-[#D25026]" size={16} />
                    </div>
                    Status & Bukti Pembayaran
                </h3>

                {onUpdatePayment && !isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 min-h-11 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 text-[11px] font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                    >
                        <Edit3 size={13} className="text-[#D25026]" />
                        <span>Kelola Bayar</span>
                    </button>
                )}
            </div>

            <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xs space-y-4 ${isMobile ? "p-4" : "p-6"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-600">
                        Metode Transaksi
                    </span>
                    <div className="flex items-center gap-2">
                        {isDP ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                DP (Uang Muka)
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 size={12} className="text-emerald-600" />
                                Full Cash (Lunas)
                            </span>
                        )}
                        {isDP && currentRemaining === 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                Pelunasan Selesai
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            Total Tagihan
                        </span>
                        <span className="text-sm font-black text-slate-900 tracking-tight block">
                            {formatRupiah(totalOrderAmount)}
                        </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            {isDP ? "Nominal DP Dibayar" : "Sudah Dibayar"}
                        </span>
                        <span className="text-sm font-black text-[#D25026] tracking-tight block">
                            {formatRupiah(currentPaid)}
                        </span>
                    </div>

                    <div className={cn(
                        "p-3.5 rounded-2xl border transition-colors",
                        currentRemaining > 0 ? "bg-rose-50/70 border-rose-100" : "bg-emerald-50/70 border-emerald-100"
                    )}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1 flex items-center justify-between">
                            <span>Sisa Kurang</span>
                            {currentRemaining > 0 && <AlertCircle size={12} className="text-rose-500" />}
                        </span>
                        <span className={cn(
                            "text-sm font-black tracking-tight block",
                            currentRemaining > 0 ? "text-rose-600" : "text-emerald-700"
                        )}>
                            {formatRupiah(currentRemaining)}
                        </span>
                    </div>
                </div>

                {isEditing && (
                    <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-200/60 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                                Ubah Status & Nominal Pembayaran
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                aria-label="Tutup form ubah pembayaran"
                                className="w-9 h-9 rounded-full bg-white text-slate-600 hover:text-slate-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 flex items-center justify-center border border-slate-200 shadow-2xs cursor-pointer"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEditType("FULL");
                                    setEditPaid(totalOrderAmount);
                                }}
                                className={cn(
                                    "min-h-11 p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40",
                                    editType === "FULL"
                                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                )}
                            >
                                Full Cash (Lunas)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditType("DP");
                                    if (editPaid >= totalOrderAmount) {
                                        setEditPaid(Math.round(totalOrderAmount * 0.5));
                                    }
                                }}
                                className={cn(
                                    "min-h-11 p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40",
                                    editType === "DP"
                                        ? "bg-[#D25026] text-white border-[#D25026] shadow-xs"
                                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                )}
                            >
                                DP (Uang Muka)
                            </button>
                        </div>

                        {editType === "DP" && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <label htmlFor={`dp-nominal-${order.rawId}`} className="text-[11px] font-bold text-slate-700">
                                        Nominal DP Diterima
                                    </label>
                                    <div className="flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setEditPaid(Math.round(totalOrderAmount * 0.5))}
                                            className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 cursor-pointer"
                                        >
                                            50%
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditPaid(totalOrderAmount)}
                                            className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/40 cursor-pointer"
                                        >
                                            Tandai Lunas
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">Rp</span>
                                    <input
                                        id={`dp-nominal-${order.rawId}`}
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="0"
                                        value={formatNominalInput(editPaid)}
                                        onChange={handleNominalChange}
                                        className="w-full min-h-11 pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                                    <span>Sisa Kurang:</span>
                                    <span className="font-bold text-rose-600">
                                        {formatRupiah(Math.max(0, totalOrderAmount - editPaid))}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-orange-200/50">
                            <label className={`inline-flex items-center gap-1.5 min-h-11 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-[#D25026]/40 text-[11px] font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer ${isUploadingProof ? "opacity-50 pointer-events-none" : ""}`}>
                                {isUploadingProof && uploadingSlot === activeEditSlot ? (
                                    <Loader2 size={13} className="animate-spin text-[#D25026]" />
                                ) : (
                                    <Upload size={13} className="text-[#D25026]" />
                                )}
                                <span>
                                    {activeEditHasProof
                                        ? `Ubah Bukti ${activeEditSlot === "DP" ? "DP" : "Full"}`
                                        : `Unggah Bukti ${activeEditSlot === "DP" ? "DP" : "Full"}`}
                                </span>
                                <input
                                    type="file"
                                    onChange={(e) => onSlotFileChange(e, activeEditSlot)}
                                    accept="image/*,.pdf"
                                    className="sr-only"
                                    disabled={isUploadingProof}
                                />
                            </label>

                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="min-h-11 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-1.5 min-h-11 px-4 py-2 rounded-xl bg-[#D25026] text-white text-xs font-black uppercase tracking-wider hover:bg-[#B34320] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/50 transition-colors shadow-xs cursor-pointer"
                                >
                                    {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                    <span>Simpan Status</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                            Lampiran Bukti Pembayaran (DP & Full)
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                            Gambar otomatis dikonversi ke format WebP
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {proofColumns.map((col) => {
                            const hasColProof = Boolean(col.url);
                            const isThisSlotUploading = isUploadingProof && (uploadingSlot === col.slot || uploadingSlot === null);
                            const isPdf = col.url.toLowerCase().endsWith(".pdf");

                            return (
                                <div
                                    key={col.slot}
                                    className={cn(
                                        "rounded-2xl border p-3.5 flex flex-col justify-between transition-colors",
                                        col.isPrimary
                                            ? "bg-slate-50/90 border-slate-200/90"
                                            : "bg-slate-50/50 border-slate-200/60"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 block">
                                                {col.title}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-600 block mt-0.5">
                                                {col.subtitle}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0",
                                            col.slot === "DP"
                                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        )}>
                                            {col.badgeText}
                                        </span>
                                    </div>

                                    {hasColProof ? (
                                        <div className="space-y-3">
                                            <div className="w-full bg-white rounded-xl overflow-hidden border border-slate-200/80 flex items-center justify-center p-2 min-h-[11rem]">
                                                {isPdf ? (
                                                    <div className="w-full h-36 bg-emerald-50 flex flex-col items-center justify-center rounded-lg p-3 text-center">
                                                        <FileText className="w-10 h-10 text-emerald-600 mb-2" />
                                                        <a
                                                            href={col.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[11px] font-black uppercase tracking-wider text-emerald-800 hover:text-emerald-900 underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
                                                        >
                                                            Buka {col.buttonShortLabel} (PDF)
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <a
                                                        href={col.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block w-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 rounded-lg"
                                                    >
                                                        <img
                                                            src={col.url}
                                                            alt={col.title}
                                                            className={`w-full h-auto object-contain mx-auto rounded-lg ${isMobile ? "max-h-[200px]" : "max-h-[240px]"}`}
                                                        />
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-2 pt-1">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                                    <CheckCircle2 size={12} />
                                                    Terunggah
                                                </span>
                                                <label className={`min-h-11 bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 focus-within:ring-2 focus-within:ring-[#D25026]/40 px-3 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5 transition-colors cursor-pointer ${isUploadingProof ? "opacity-50 pointer-events-none" : ""}`}>
                                                    {isThisSlotUploading ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D25026]" />
                                                    ) : (
                                                        <Upload className="w-3.5 h-3.5 text-[#D25026]" />
                                                    )}
                                                    <span>Ubah {col.buttonShortLabel}</span>
                                                    <input
                                                        type="file"
                                                        onChange={(e) => onSlotFileChange(e, col.slot)}
                                                        accept="image/*,.pdf"
                                                        className="sr-only"
                                                        disabled={isUploadingProof}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full min-h-[11rem] bg-white/80 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-4 text-center">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center mb-2",
                                                col.slot === "DP" ? "bg-amber-100" : "bg-slate-200/70"
                                            )}>
                                                <Clock className={cn(
                                                    "w-4 h-4",
                                                    col.slot === "DP" ? "text-amber-700" : "text-slate-600"
                                                )} />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic mb-1">
                                                {isAwaitingAdmin && col.isPrimary
                                                    ? `Menunggu ${col.buttonShortLabel}`
                                                    : `Belum Ada ${col.buttonShortLabel}`}
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-600 mb-3">
                                                {col.slot === "DP"
                                                    ? "Unggah bukti transfer pembayaran uang muka (DP)."
                                                    : "Unggah bukti transfer pembayaran lunas / pelunasan."}
                                            </p>
                                            <label className={cn(
                                                "min-h-11 px-3.5 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-all focus-within:ring-2",
                                                col.slot === "DP"
                                                    ? "bg-[#D25026] text-white hover:bg-[#B34320] focus-within:ring-[#D25026]/50"
                                                    : "bg-slate-900 text-white hover:bg-slate-800 focus-within:ring-slate-900/40",
                                                isUploadingProof ? "opacity-50 pointer-events-none" : ""
                                            )}>
                                                {isThisSlotUploading ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Upload size={13} />
                                                )}
                                                <span>Unggah {col.buttonShortLabel}</span>
                                                <input
                                                    type="file"
                                                    onChange={(e) => onSlotFileChange(e, col.slot)}
                                                    accept="image/*,.pdf"
                                                    className="sr-only"
                                                    disabled={isUploadingProof}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
