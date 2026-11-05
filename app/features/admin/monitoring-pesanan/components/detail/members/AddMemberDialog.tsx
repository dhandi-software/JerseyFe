import React, { useState } from "react";
import { Plus, Receipt, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import type { MonitoringOrder, AddOrderMemberInput } from "~/types";

interface AddMemberDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    order: MonitoringOrder;
    onAddMember: (data: AddOrderMemberInput) => Promise<any>;
    unitPrice: number;
}

const COMMON_SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "Custom"];
const SLEEVE_OPTIONS = ["Pendek", "Panjang"];

export function AddMemberDialog({
    isOpen,
    onOpenChange,
    order,
    onAddMember,
    unitPrice,
}: AddMemberDialogProps) {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [size, setSize] = useState("L");
    const [sleeve, setSleeve] = useState("Pendek");
    const [statusBaju, setStatusBaju] = useState(false);
    const [statusCelana, setStatusCelana] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Nama pemain harus diisi");
            return;
        }

        setIsSubmitting(true);
        try {
            const compositeSize = `${size} (${sleeve})`;
            await onAddMember({
                playerName: name.trim(),
                playerNumber: number.trim() || undefined,
                playerSize: compositeSize,
                statusBaju,
                statusCelana,
            });
            onOpenChange(false);
            setName("");
            setNumber("");
            setSize("L");
            setSleeve("Pendek");
            setStatusBaju(false);
            setStatusCelana(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl font-geist border border-slate-100">
                <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100">
                    <DialogTitle className="text-lg font-black uppercase tracking-wider italic text-slate-900 flex items-center gap-2">
                        <Plus className="text-[#D25026]" size={20} />
                        Tambah Anggota / Pemain
                    </DialogTitle>
                    <p className="text-xs text-slate-500 font-medium">
                        Tambahkan pemain baru ke daftar pesanan <span className="font-bold text-slate-700">#{order.id}</span>
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                    {/* Notifikasi Penambahan Harga Invoice */}
                    <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#D25026] text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Receipt size={16} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                                    Penambahan Biaya Invoice
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                    Otomatis terdaftar & update total tagihan pesanan
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <span className="text-xs font-black text-[#D25026] font-mono block">
                                +Rp {unitPrice.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                                Per Unit
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                            Nama Pemain *
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: BAYU"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#D25026] text-slate-900 bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                                No. Punggung
                            </label>
                            <input
                                type="text"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="Contoh: 10"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#D25026] text-slate-900 bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                                Ukuran (Size)
                            </label>
                            <select
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#D25026] text-slate-900"
                            >
                                {COMMON_SIZES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
                            Jenis Lengan
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {SLEEVE_OPTIONS.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSleeve(s)}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer min-h-[44px] ${
                                        sleeve === s
                                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                            Status Bahan Awal:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setStatusBaju(!statusBaju)}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 min-h-[44px] ${
                                    statusBaju
                                        ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                        Bahan Baju
                                    </span>
                                    {statusBaju ? (
                                        <CheckCircle2 size={16} className="text-emerald-600" />
                                    ) : (
                                        <Clock size={16} className="text-slate-400" />
                                    )}
                                </div>
                                <span
                                    className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${
                                        statusBaju
                                            ? "bg-emerald-600 text-white shadow-2xs"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {statusBaju ? "READY" : "BELUM"}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStatusCelana(!statusCelana)}
                                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 min-h-[44px] ${
                                    statusCelana
                                        ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20"
                                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                        Bahan Celana
                                    </span>
                                    {statusCelana ? (
                                        <CheckCircle2 size={16} className="text-blue-600" />
                                    ) : (
                                        <Clock size={16} className="text-slate-400" />
                                    )}
                                </div>
                                <span
                                    className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${
                                        statusCelana
                                            ? "bg-blue-600 text-white shadow-2xs"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {statusCelana ? "READY" : "BELUM"}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer text-slate-600 hover:bg-slate-100 min-h-[44px]"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-[#D25026] hover:bg-[#B34320] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm min-h-[44px]"
                        >
                            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : null}
                            Simpan Anggota
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
