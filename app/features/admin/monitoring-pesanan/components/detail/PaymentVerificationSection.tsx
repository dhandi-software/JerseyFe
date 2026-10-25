import React, { useState, useEffect } from "react";
import { CreditCard, FileText, Upload, Clock, Loader2, CheckCircle2, AlertCircle, Edit3, X, Check } from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import { formatRupiah, cn } from "~/lib/utils";
import type { MonitoringOrder } from "~/types";

interface PaymentVerificationSectionProps {
    order: MonitoringOrder;
    isUploadingProof: boolean;
    handleUploadProof: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    onUpdatePayment?: (orderId: number, data: { paymentType?: string; paidAmount?: number; remainingAmount?: number }) => Promise<any>;
    variant?: "desktop" | "mobile";
}

export function PaymentVerificationSection({
    order,
    isUploadingProof,
    handleUploadProof,
    onUpdatePayment,
    variant = "desktop"
}: PaymentVerificationSectionProps) {
    const isMobile = variant === "mobile";
    const hasProof = order.paymentProofUrl && order.paymentProofUrl !== "MENUNGGU_PEMBAYARAN_ADMIN";
    const isAwaitingAdmin = order.paymentProofUrl === "MENUNGGU_PEMBAYARAN_ADMIN";
    const proofFullUrl = hasProof
        ? (order.paymentProofUrl!.startsWith("http")
            ? order.paymentProofUrl!
            : `${UPLOADS_URL}${order.paymentProofUrl!.startsWith("/") ? "" : "/"}${order.paymentProofUrl}`)
        : "";

    const totalOrderAmount = order.totalAmount || 0;
    const isDP = order.paymentType === "DP" || (order.paidAmount !== undefined && order.paidAmount > 0 && order.paidAmount < totalOrderAmount);
    const currentPaid = order.paidAmount !== undefined ? order.paidAmount : (isDP ? 0 : totalOrderAmount);
    const currentRemaining = order.remainingAmount !== undefined ? order.remainingAmount : Math.max(0, totalOrderAmount - currentPaid);

    const [isEditing, setIsEditing] = useState(false);
    const [editType, setEditType] = useState<"FULL" | "DP">(isDP ? "DP" : "FULL");
    const [editPaid, setEditPaid] = useState<number>(currentPaid);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditType(isDP ? "DP" : "FULL");
        setEditPaid(currentPaid);
    }, [order.paymentType, order.paidAmount, order.totalAmount]);

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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-[11px] font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                    >
                        <Edit3 size={13} className="text-[#D25026]" />
                        <span>Kelola Bayar</span>
                    </button>
                )}
            </div>

            {/* Payment Summary / Breakdown Card */}
            <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xs space-y-4 ${isMobile ? "p-4" : "p-6"}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-400">
                        Metode Transaksi
                    </span>
                    <div className="flex items-center gap-2">
                        {isDP ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
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

                {/* 3-Column Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Total Tagihan
                        </span>
                        <span className="text-sm font-black text-slate-900 tracking-tight block">
                            {formatRupiah(totalOrderAmount)}
                        </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
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
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center justify-between">
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

                {/* Inline Edit Form for Admin */}
                {isEditing && (
                    <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-200/60 space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                                Ubah Status & Nominal Pembayaran
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="w-6 h-6 rounded-full bg-white text-slate-400 hover:text-slate-600 flex items-center justify-center border border-slate-200 shadow-2xs"
                            >
                                <X size={14} />
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
                                    "p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                                    editType === "FULL"
                                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
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
                                    "p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                                    editType === "DP"
                                        ? "bg-[#D25026] text-white border-[#D25026] shadow-xs"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                )}
                            >
                                DP (Uang Muka)
                            </button>
                        </div>

                        {editType === "DP" && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-slate-700">Nominal DP Diterima</label>
                                    <div className="flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setEditPaid(Math.round(totalOrderAmount * 0.5))}
                                            className="text-[9px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                                        >
                                            50%
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditPaid(totalOrderAmount)}
                                            className="text-[9px] font-bold px-2 py-0.5 rounded bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                                        >
                                            Tandai Lunas
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">Rp</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={totalOrderAmount}
                                        value={editPaid}
                                        onChange={(e) => setEditPaid(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                    <span>Sisa Kurang:</span>
                                    <span className="font-bold text-rose-600">
                                        {formatRupiah(Math.max(0, totalOrderAmount - editPaid))}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D25026] text-white text-xs font-black uppercase tracking-wider hover:bg-[#B34320] transition-colors shadow-xs cursor-pointer"
                            >
                                {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                <span>Simpan Status</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Bukti Transfer Box */}
                {hasProof ? (
                    <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex flex-col items-center justify-center p-3 shadow-xs relative group">
                        {proofFullUrl.toLowerCase().endsWith(".pdf") ? (
                            <div className="w-full h-44 bg-emerald-50 flex flex-col items-center justify-center rounded-xl p-4">
                                <FileText className="w-12 h-12 text-emerald-500 mb-2" />
                                <a
                                    href={proofFullUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-800 underline"
                                >
                                    Buka Bukti Transfer (PDF)
                                </a>
                            </div>
                        ) : (
                            <img
                                src={proofFullUrl}
                                alt="Bukti Pembayaran"
                                className={`w-full h-auto object-contain mx-auto rounded-xl ${isMobile ? "max-h-[300px]" : "max-h-[420px]"}`}
                            />
                        )}

                        {order.status === "MENUNGGU" && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex items-center justify-center rounded-2xl p-4">
                                <label className={`bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 transition-transform cursor-pointer ${isUploadingProof ? "opacity-50" : "hover:scale-105"}`}>
                                    {isUploadingProof ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    Ubah Bukti Pembayaran
                                    <input
                                        type="file"
                                        onChange={handleUploadProof}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        disabled={isUploadingProof}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full min-h-[8rem] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-5 text-center">
                        {isAwaitingAdmin ? (
                            <div className="flex flex-col items-center">
                                <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                </div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-2.5">
                                    Menunggu Bukti Transfer dari Admin
                                </p>
                                <label className={`bg-[#D25026] text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all ${isUploadingProof ? "opacity-50" : "hover:bg-[#B34320]"}`}>
                                    {isUploadingProof ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={14} />}
                                    Unggah Bukti Transfer
                                    <input
                                        type="file"
                                        onChange={handleUploadProof}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        disabled={isUploadingProof}
                                    />
                                </label>
                            </div>
                        ) : (
                            <p className="text-xs font-bold text-slate-400 italic uppercase tracking-wider">
                                Belum ada bukti pembayaran diunggah
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
