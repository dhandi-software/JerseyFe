import React, { useState, useEffect } from "react";
import { Edit2, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { parseSleeveAndSize } from "../../../utils";
import type { OrderMember, EditOrderMemberInput } from "~/types";

interface EditMemberDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    member: OrderMember | null;
    onEditMember: (detailId: number, data: EditOrderMemberInput) => Promise<any>;
}

const SLEEVE_OPTIONS = ["Pendek", "Panjang"];

export function EditMemberDialog({
    isOpen,
    onOpenChange,
    member,
    onEditMember,
}: EditMemberDialogProps) {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [size, setSize] = useState("");
    const [sleeve, setSleeve] = useState("Pendek");
    const [statusBaju, setStatusBaju] = useState(false);
    const [statusCelana, setStatusCelana] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (member) {
            setName(member.playerName || "");
            setNumber(member.playerNumber !== undefined ? String(member.playerNumber) : "");
            const parsed = parseSleeveAndSize(member.playerSize || "");
            setSize(parsed.size || "L");
            setSleeve(parsed.sleeve.toLowerCase().includes("panjang") ? "Panjang" : "Pendek");
            setStatusBaju(Boolean(member.statusBaju));
            setStatusCelana(Boolean(member.statusCelana));
        }
    }, [member]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Nama pemain harus diisi");
            return;
        }
        if (!member || !member.id) return;

        setIsSubmitting(true);
        try {
            const compositeSize = `${size} (${sleeve})`;
            await onEditMember(member.id, {
                playerName: name.trim(),
                playerNumber: number.trim() || undefined,
                playerSize: compositeSize,
                statusBaju,
                statusCelana,
            });
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl font-geist border border-slate-100">
                <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100">
                    <DialogTitle className="text-lg font-black uppercase tracking-wider italic text-slate-900 flex items-center gap-2">
                        <Edit2 className="text-[#D25026]" size={20} />
                        Edit Anggota / Nama Pemain
                    </DialogTitle>
                    <p className="text-xs text-slate-500 font-medium">
                        Perbarui rincian nama, nomor, ukuran, dan status bahan pemain
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-3">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                            Nama Pemain *
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            <input
                                type="text"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="Contoh: L / XL / 3XL"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#D25026] text-slate-900 bg-white"
                            />
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
                            Status Bahan:
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
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
