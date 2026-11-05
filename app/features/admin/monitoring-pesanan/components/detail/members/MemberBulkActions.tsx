import React, { useState } from "react";
import { CheckCheck, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import type { OrderMember } from "~/types";

export interface MemberBulkActionsProps {
    members: OrderMember[];
    rawOrderId: number;
    readyBajuCount: number;
    readyCelanaCount: number;
    onToggleStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
}

export function MemberBulkActions({
    members,
    rawOrderId,
    readyBajuCount,
    readyCelanaCount,
    onToggleStatus,
}: MemberBulkActionsProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    if (members.length === 0 || !onToggleStatus) return null;

    const allBajuReady = readyBajuCount === members.length;
    const allCelanaReady = readyCelanaCount === members.length;

    const handleBulkToggle = async (field: "statusBaju" | "statusCelana", targetReady: boolean) => {
        setIsUpdating(true);
        try {
            // Find all members that need to change
            const targets = members.filter((m) => {
                const current = field === "statusBaju" ? Boolean(m.statusBaju) : Boolean(m.statusCelana);
                return current !== targetReady && m.id;
            });

            for (const m of targets) {
                if (m.id) {
                    onToggleStatus(rawOrderId, m.id, field);
                }
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 italic">
                    Aksi Massal:
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                    ({members.length} Anggota)
                </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
                {/* Bulk Baju Button */}
                <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleBulkToggle("statusBaju", !allBajuReady)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50 min-h-[36px] ${
                        allBajuReady
                            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                    }`}
                >
                    {isUpdating ? (
                        <Loader2 size={12} className="animate-spin" />
                    ) : allBajuReady ? (
                        <RotateCcw size={12} />
                    ) : (
                        <CheckCheck size={12} />
                    )}
                    <span>{allBajuReady ? "Reset Baju" : "Semua Baju Ready"}</span>
                </button>

                {/* Bulk Celana Button */}
                <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleBulkToggle("statusCelana", !allCelanaReady)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50 min-h-[36px] ${
                        allCelanaReady
                            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            : "bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
                    }`}
                >
                    {isUpdating ? (
                        <Loader2 size={12} className="animate-spin" />
                    ) : allCelanaReady ? (
                        <RotateCcw size={12} />
                    ) : (
                        <CheckCheck size={12} />
                    )}
                    <span>{allCelanaReady ? "Reset Celana" : "Semua Celana Ready"}</span>
                </button>
            </div>
        </div>
    );
}
