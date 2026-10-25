import { Search, Users, X, CheckCircle2, Clock } from "lucide-react";
import { cn } from "~/lib/utils";
import { parseSleeveAndSize } from "../utils";
import type { MonitoringOrder } from "~/types";

interface OrderMembersSubTableProps {
    order: MonitoringOrder;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    debouncedQuery: string;
    onClose: () => void;
    onToggleStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
}

export function OrderMembersSubTable({
    order,
    searchQuery,
    onSearchChange,
    debouncedQuery,
    onClose,
    onToggleStatus
}: OrderMembersSubTableProps) {
    const activeQuery = (debouncedQuery || "").toLowerCase().trim();
    const members = (order.details || []).filter((m: any) => {
        if (!activeQuery) return true;
        return (
            (m.playerName && m.playerName.toLowerCase().includes(activeQuery)) ||
            (m.playerNumber && m.playerNumber.toString().toLowerCase().includes(activeQuery)) ||
            (m.playerSize && m.playerSize.toLowerCase().includes(activeQuery))
        );
    });

    return (
        <tr className="bg-slate-50/40">
            <td colSpan={7} className="px-6 py-4">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#D25026] flex items-center justify-center border border-orange-100">
                                <Users className="w-5 h-5 text-[#D25026]" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase italic tracking-wider text-base">
                                    DAFTAR ANGGOTA / PEMAIN
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                    Pesanan {order.id} · Total {order.details?.length || 0} orang
                                    {activeQuery && members.length < (order.details?.length || 0) && (
                                        <span className="text-[#D25026] font-bold"> (Menampilkan {members.length})</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Tutup daftar anggota"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Cari nama atau nomor punggung..."
                            className="w-full pl-11 pr-4 py-3 bg-[#FAFAFA] border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#D25026] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="overflow-x-auto overflow-y-auto max-h-[380px] rounded-2xl border border-slate-200 bg-white custom-scrollbar shadow-xs">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#FAFAFA] border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic bg-[#FAFAFA]">NO</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic bg-[#FAFAFA]">NAMA</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic bg-[#FAFAFA]">NO. PUNGGUNG</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic bg-[#FAFAFA]">SIZE</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic bg-[#FAFAFA]">LENGAN</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic bg-[#FAFAFA]">STATUS BAJU</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] italic bg-[#FAFAFA]">STATUS CELANA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-xs font-bold uppercase italic">
                                            Tidak ada anggota atau pemain yang cocok
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((m: any, idx: number) => {
                                        const { size, sleeve } = parseSleeveAndSize(m.playerSize);
                                        const isMatched = activeQuery && (
                                            (m.playerName && m.playerName.toLowerCase().includes(activeQuery)) ||
                                            (m.playerNumber && m.playerNumber.toString().toLowerCase().includes(activeQuery))
                                        );

                                        return (
                                            <tr key={m.id || idx} className={cn("transition-colors hover:bg-slate-50/80", isMatched && "bg-[#FFF0EB]/40")}>
                                                <td className="px-6 py-4 font-bold text-slate-500 font-mono text-sm">{idx + 1}</td>
                                                <td className="px-6 py-4 font-black uppercase italic text-slate-900 text-sm">
                                                    <span className={cn(isMatched && "text-[#D25026]")}>
                                                        {m.playerName || "Tanpa Nama"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-100 text-slate-900 px-4 py-1.5 rounded-xl border border-slate-200 font-mono font-black text-sm tracking-wider inline-block min-w-[42px] text-center shadow-2xs">
                                                        {m.playerNumber || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-orange-50 text-[#D25026] px-3.5 py-1.5 rounded-xl font-black text-sm inline-block border border-orange-200 min-w-[36px] text-center shadow-2xs">
                                                        {size}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-900 text-white px-3.5 py-1.5 rounded-xl font-black text-xs tracking-wider uppercase inline-block shadow-2xs">
                                                        {sleeve}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => onToggleStatus && m.id && onToggleStatus(order.rawId, m.id, "statusBaju")}
                                                        className={cn(
                                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95",
                                                            m.statusBaju
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                                                                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700"
                                                        )}
                                                        title="Klik untuk ubah status kesiapan baju"
                                                    >
                                                        {m.statusBaju ? (
                                                            <>
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                                <span>READY</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>BELUM</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => onToggleStatus && m.id && onToggleStatus(order.rawId, m.id, "statusCelana")}
                                                        className={cn(
                                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95",
                                                            m.statusCelana
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                                                                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700"
                                                        )}
                                                        title="Klik untuk ubah status kesiapan celana"
                                                    >
                                                        {m.statusCelana ? (
                                                            <>
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                                <span>READY</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>BELUM</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
    );
}
