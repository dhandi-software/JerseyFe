import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { CustomSelect } from "~/components/ui/custom-select";
import { cn, formatRupiah } from "~/lib/utils";
import type { DesignerItem, MonitoringOrder } from "~/types";

interface HandoverDesignerModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    designers: DesignerItem[];
    selectedDesignerId: number | "";
    setSelectedDesignerId: (id: number | "") => void;
    orderToAssign: number | null;
    order?: MonitoringOrder | null;
    handleUpdateStatus: (
        id: number,
        newStatus: string,
        designerId?: number,
        paymentConfirmation?: { paymentType?: string; paidAmount?: number; remainingAmount?: number }
    ) => Promise<void>;
}

export function HandoverDesignerModal({
    isOpen,
    onOpenChange,
    designers,
    selectedDesignerId,
    setSelectedDesignerId,
    orderToAssign,
    order,
    handleUpdateStatus
}: HandoverDesignerModalProps) {
    const totalAmount = order?.totalAmount || 0;
    const initialPaid = order?.paidAmount && order.paidAmount > 0
        ? Math.min(order.paidAmount, totalAmount)
        : 0;

    const [confirmType, setConfirmType] = useState<"DP" | "FULL">("DP");
    const [confirmDpAmount, setConfirmDpAmount] = useState<number>(initialPaid);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && order) {
            const total = order.totalAmount || 0;
            const currentPaid = order.paidAmount || 0;
            const isAlreadyExplicitFull = order.paymentType === "FULL"
                && currentPaid >= total
                && order.paymentProofUrl !== "MENUNGGU_PEMBAYARAN_ADMIN";

            setConfirmType(isAlreadyExplicitFull ? "FULL" : "DP");
            setConfirmDpAmount(
                currentPaid > 0 && currentPaid <= total
                    ? currentPaid
                    : 0
            );
        }
    }, [isOpen, order]);

    const formatNominalInput = (amount: number): string => {
        if (!amount || amount <= 0) return "";
        return amount.toLocaleString("en-US");
    };

    const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawDigits = e.target.value.replace(/\D/g, "");
        if (!rawDigits) {
            setConfirmDpAmount(0);
            return;
        }
        const parsed = parseInt(rawDigits, 10) || 0;
        setConfirmDpAmount(Math.min(totalAmount, Math.max(0, parsed)));
    };

    const effectivePaid = confirmType === "FULL"
        ? totalAmount
        : Math.min(Math.max(0, confirmDpAmount), totalAmount);
    const effectiveRemaining = Math.max(0, totalAmount - effectivePaid);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 pr-12">
                        Serahkan ke Tim Desain
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 italic">Pilih Desainer</label>
                        <CustomSelect
                            options={designers.map(d => ({
                                value: String(d.id),
                                label: `${d.nama} (${d.email})`
                            }))}
                            value={selectedDesignerId ? String(selectedDesignerId) : ""}
                            onChange={(val) => setSelectedDesignerId(val ? Number(val) : "")}
                            placeholder="-- Pilih Desainer --"
                            searchPlaceholder="Cari desainer..."
                            emptyMessage="Belum ada akun Tim Desain terdaftar."
                        />
                        {designers.length === 0 && (
                            <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 font-medium">
                                Belum ada akun dengan peran <strong>Desainer (Internal)</strong>. Tambahkan terlebih dahulu melalui menu{" "}
                                <a href="/admin/create-account?role=desain" className="font-bold underline text-[#D25026]">
                                    User Management
                                </a>.
                            </p>
                        )}
                    </div>

                    {totalAmount > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                                        Konfirmasi Pembayaran Masuk Omset
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        Total Tagihan: <strong className="text-slate-900">{formatRupiah(totalAmount)}</strong>
                                    </span>
                                </div>
                                <span className={cn(
                                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                    confirmType === "DP"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-emerald-100 text-emerald-800"
                                )}>
                                    {confirmType === "DP" ? "Tahap DP" : "Lunas 100%"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmType("DP")}
                                    className={cn(
                                        "p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                                        confirmType === "DP"
                                            ? "bg-[#D25026] text-white border-[#D25026] shadow-xs"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    DP (Uang Muka)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmType("FULL")}
                                    className={cn(
                                        "p-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                                        confirmType === "FULL"
                                            ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                    )}
                                >
                                    Full Cash (Lunas)
                                </button>
                            </div>

                            {confirmType === "DP" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-700">
                                            Nominal DP Diterima (Masuk Omset)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmDpAmount(Math.round(totalAmount * 0.5))}
                                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[#D25026] hover:bg-orange-50 cursor-pointer"
                                        >
                                            Preset 50% ({formatRupiah(Math.round(totalAmount * 0.5))})
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">Rp</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="0"
                                            value={formatNominalInput(confirmDpAmount)}
                                            onChange={handleNominalChange}
                                            className="w-full min-h-11 pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Masuk Omset Sekarang</span>
                                    <span className="font-black text-emerald-700">{formatRupiah(effectivePaid)}</span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Sisa Saat Pelunasan</span>
                                    <span className={cn("font-black", effectiveRemaining > 0 ? "text-rose-600" : "text-slate-600")}>
                                        {formatRupiah(effectiveRemaining)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={async () => {
                            if (!selectedDesignerId || !orderToAssign) {
                                alert("Pilih desainer terlebih dahulu");
                                return;
                            }
                            setIsSubmitting(true);
                            try {
                                await handleUpdateStatus(
                                    orderToAssign,
                                    "DESAIN",
                                    selectedDesignerId as number,
                                    totalAmount > 0
                                        ? {
                                            paymentType: effectiveRemaining > 0 ? "DP" : "FULL",
                                            paidAmount: effectivePaid,
                                            remainingAmount: effectiveRemaining
                                        }
                                        : undefined
                                );
                                onOpenChange(false);
                                setSelectedDesignerId("");
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                        disabled={!selectedDesignerId || isSubmitting}
                        className="px-6 py-2.5 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Konfirmasi & Serahkan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
