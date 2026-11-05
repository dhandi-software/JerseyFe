import React from "react";
import { CheckCircle2, Clock, Edit2, Trash2, Loader2 } from "lucide-react";
import { parseSleeveAndSize } from "../../../utils";
import type { OrderMember } from "~/types";

export interface MemberRowProps {
    member: OrderMember;
    index: number;
    orderId: number;
    isSelected?: boolean;
    onToggleSelect?: (id: number) => void;
    onToggleStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
    onOpenEdit?: (member: OrderMember) => void;
    onDelete?: (detailId: number) => void;
    isDeleting?: boolean;
}

export function MemberTableRow({
    member,
    index,
    orderId,
    isSelected = false,
    onToggleSelect,
    onToggleStatus,
    onOpenEdit,
    onDelete,
    isDeleting = false,
}: MemberRowProps) {
    const { size, sleeve } = parseSleeveAndSize(member.playerSize || "");

    return (
        <tr className={`transition-colors ${isSelected ? "bg-orange-50/40" : "hover:bg-slate-50/70"}`}>
            <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                    {onToggleSelect && member.id && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelect(member.id!)}
                            className="w-4 h-4 rounded text-[#D25026] focus:ring-[#D25026] border-slate-300 cursor-pointer"
                        />
                    )}
                    <span className="font-bold text-slate-400 font-mono text-xs">{index + 1}</span>
                </div>
            </td>
            <td className="px-5 py-3.5 font-black uppercase italic text-slate-900 text-xs">
                {member.playerName || "Tanpa Nama"}
            </td>
            <td className="px-5 py-3.5 text-center">
                <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-lg border border-slate-200 font-mono font-bold text-xs inline-block min-w-[36px]">
                    {member.playerNumber || "-"}
                </span>
            </td>
            <td className="px-5 py-3.5 text-center">
                <span className="bg-orange-50 text-[#D25026] px-3 py-1 rounded-lg font-black text-xs inline-block border border-orange-200 min-w-[34px]">
                    {size}
                </span>
            </td>
            <td className="px-5 py-3.5 text-center">
                <span className="bg-slate-900 text-white px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider inline-block">
                    {sleeve}
                </span>
            </td>
            <td className="px-5 py-3.5 text-center">
                <button
                    type="button"
                    onClick={() => onToggleStatus && member.id && onToggleStatus(orderId, member.id, "statusBaju")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95 ${
                        member.statusBaju
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700"
                    }`}
                    title="Klik untuk ubah Status Bahan Baju (READY / BELUM)"
                >
                    {member.statusBaju ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{member.statusBaju ? "READY" : "BELUM"}</span>
                </button>
            </td>
            <td className="px-5 py-3.5 text-center">
                <button
                    type="button"
                    onClick={() => onToggleStatus && member.id && onToggleStatus(orderId, member.id, "statusCelana")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95 ${
                        member.statusCelana
                            ? "bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700"
                    }`}
                    title="Klik untuk ubah Status Bahan Celana (READY / BELUM)"
                >
                    {member.statusCelana ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{member.statusCelana ? "READY" : "BELUM"}</span>
                </button>
            </td>
            <td className="px-5 py-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                    {onOpenEdit && (
                        <button
                            type="button"
                            onClick={() => onOpenEdit(member)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#D25026] hover:bg-orange-50 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Edit Anggota / Nama"
                        >
                            <Edit2 size={14} />
                        </button>
                    )}
                    {onDelete && member.id && (
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => onDelete(member.id!)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Hapus Anggota"
                        >
                            {isDeleting ? <Loader2 size={14} className="animate-spin text-red-500" /> : <Trash2 size={14} />}
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

export function MemberMobileCard({
    member,
    index,
    orderId,
    isSelected = false,
    onToggleSelect,
    onToggleStatus,
    onOpenEdit,
    onDelete,
    isDeleting = false,
}: MemberRowProps) {
    const { size, sleeve } = parseSleeveAndSize(member.playerSize || "");

    return (
        <div className={`bg-white p-4 rounded-2xl border transition-all shadow-sm space-y-3 ${
            isSelected ? "border-[#D25026] ring-1 ring-[#D25026]/20 bg-orange-50/20" : "border-slate-100"
        }`}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    {onToggleSelect && member.id && (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelect(member.id!)}
                            className="w-4 h-4 rounded text-[#D25026] focus:ring-[#D25026] border-slate-300 cursor-pointer"
                        />
                    )}
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono font-bold text-xs flex items-center justify-center">
                        {index + 1}
                    </span>
                    <div>
                        <h4 className="text-xs font-black uppercase italic text-slate-900">
                            {member.playerName || "Tanpa Nama"}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                            No. Punggung: <span className="font-bold text-[#D25026] font-mono">{member.playerNumber || "-"}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="bg-orange-50 text-[#D25026] px-2 py-0.5 rounded-md font-black text-[10px] border border-orange-200">
                        {size}
                    </span>
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md font-bold text-[9px] uppercase">
                        {sleeve}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Status Baju</p>
                    <button
                        type="button"
                        onClick={() => onToggleStatus && member.id && onToggleStatus(orderId, member.id, "statusBaju")}
                        className={`w-full py-2 px-2 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[44px] ${
                            member.statusBaju
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                    >
                        {member.statusBaju ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Clock size={12} />}
                        {member.statusBaju ? "READY" : "BELUM"}
                    </button>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Status Celana</p>
                    <button
                        type="button"
                        onClick={() => onToggleStatus && member.id && onToggleStatus(orderId, member.id, "statusCelana")}
                        className={`w-full py-2 px-2 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer min-h-[44px] ${
                            member.statusCelana
                                ? "bg-blue-50 text-blue-700 border border-blue-300"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                    >
                        {member.statusCelana ? <CheckCircle2 size={12} className="text-blue-600" /> : <Clock size={12} />}
                        {member.statusCelana ? "READY" : "BELUM"}
                    </button>
                </div>
            </div>

            {(onOpenEdit || onDelete) && (
                <div className="flex justify-end gap-2 pt-1 border-t border-slate-50">
                    {onOpenEdit && (
                        <button
                            type="button"
                            onClick={() => onOpenEdit(member)}
                            className="px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:text-[#D25026] hover:bg-orange-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer min-h-[44px]"
                        >
                            <Edit2 size={11} />
                            Edit
                        </button>
                    )}
                    {onDelete && member.id && (
                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => onDelete(member.id!)}
                            className="px-3 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
                        >
                            {isDeleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                            Hapus
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
