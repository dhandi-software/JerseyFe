import { useState, useMemo } from "react";
import { Users, Plus, FileText, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { downloadPlayersPDF } from "~/lib/sizeUtils";
import type { MonitoringOrder, OrderMember } from "~/types";
import { AddMemberDialog, EditMemberDialog, MemberTableRow, MemberMobileCard, MemberBulkActions } from "./members";

interface OrderMembersSectionProps {
    order: MonitoringOrder;
    variant?: "desktop" | "mobile";
    onToggleStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
    onAddMember?: (orderId: number, data: { playerName: string; playerNumber?: string; playerSize: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    onEditMember?: (orderId: number, detailId: number, data: { playerName?: string; playerNumber?: string; playerSize?: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    onDeleteMember?: (orderId: number, detailId: number) => Promise<any>;
}

export function OrderMembersSection({
    order,
    variant = "desktop",
    onToggleStatus,
    onAddMember,
    onEditMember,
    onDeleteMember,
}: OrderMembersSectionProps) {
    const isMobile = variant === "mobile";
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<OrderMember | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Ensure member items list
    const memberItems: OrderMember[] = useMemo(() => {
        if (order.details && order.details.length > 0) return order.details;
        if (order.playerInfo && (order.playerInfo as any[]).length > 0) {
            return (order.playerInfo as any[]).map((p: any, idx: number) => ({
                id: p.id || idx + 1,
                playerName: p.name || "",
                playerNumber: p.number || "",
                playerSize: p.size || "",
                statusBaju: Boolean(p.statusBaju),
                statusCelana: Boolean(p.statusCelana),
            }));
        }
        return [];
    }, [order.details, order.playerInfo]);

    const filteredMembers = useMemo(() => {
        if (!searchQuery.trim()) return memberItems;
        const q = searchQuery.toLowerCase().trim();
        return memberItems.filter(
            (m) =>
                (m.playerName && m.playerName.toLowerCase().includes(q)) ||
                (m.playerNumber !== undefined && String(m.playerNumber).toLowerCase().includes(q)) ||
                (m.playerSize && m.playerSize.toLowerCase().includes(q))
        );
    }, [memberItems, searchQuery]);

    const readyBajuCount = memberItems.filter((m) => m.statusBaju).length;
    const readyCelanaCount = memberItems.filter((m) => m.statusCelana).length;
    const unitPrice =
        memberItems.length > 0 && order.totalAmount > 0
            ? Math.round(order.totalAmount / memberItems.length)
            : 150000;

    const handleOpenEdit = (m: OrderMember) => {
        setEditingMember(m);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (detailId?: number) => {
        if (!detailId || !onDeleteMember) return;
        const confirmDelete = window.confirm(
            "Apakah Anda yakin ingin menghapus anggota/pemain ini dari pesanan?"
        );
        if (!confirmDelete) return;

        setDeletingId(detailId);
        try {
            await onDeleteMember(order.rawId, detailId);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4 font-geist">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#D25026] flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={isMobile ? "text-sm font-black uppercase tracking-wider text-slate-900 italic" : "text-base font-black uppercase tracking-wider text-slate-900 italic"}>
                            Daftar Anggota / Pemain ({memberItems.length} Unit)
                        </h3>
                        <div className="flex items-center gap-3 text-[11px] font-bold mt-0.5">
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                Baju Ready: {readyBajuCount}/{memberItems.length}
                            </span>
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                Celana Ready: {readyCelanaCount}/{memberItems.length}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onAddMember && (
                        <Button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[#D25026] hover:bg-[#B34320] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider italic flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer min-h-[44px]"
                        >
                            <Plus size={14} />
                            Tambah Anggota
                        </Button>
                    )}
                    <button
                        type="button"
                        onClick={() => downloadPlayersPDF(order)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest italic hover:bg-slate-50 transition-all shadow-sm text-slate-700 cursor-pointer min-h-[44px]"
                    >
                        <FileText size={14} className="text-[#D25026]" />
                        PDF
                    </button>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama, nomor punggung, atau ukuran..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D25026] text-slate-800 placeholder:text-slate-400 transition-all"
                />
            </div>

            {/* Bulk Actions */}
            <MemberBulkActions
                members={memberItems}
                rawOrderId={order.rawId}
                readyBajuCount={readyBajuCount}
                readyCelanaCount={readyCelanaCount}
                onToggleStatus={onToggleStatus}
            />

            {/* Member List: Mobile Cards or Desktop Table */}
            {isMobile ? (
                <div className="space-y-3">
                    {filteredMembers.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-100">
                            Tidak ada anggota yang cocok dengan pencarian
                        </div>
                    ) : (
                        filteredMembers.map((m, idx) => (
                            <MemberMobileCard
                                key={m.id || idx}
                                member={m}
                                index={idx}
                                orderId={order.rawId}
                                onToggleStatus={onToggleStatus}
                                onOpenEdit={onEditMember ? handleOpenEdit : undefined}
                                onDelete={onDeleteMember ? handleDelete : undefined}
                                isDeleting={deletingId === m.id}
                            />
                        ))
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="max-h-[440px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left relative">
                            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-xs">
                                <tr>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">NO</th>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">NAMA PEMAIN</th>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">NO. PUNGGUNG</th>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">SIZE</th>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">LENGAN</th>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">STATUS BAHAN BAJU</th>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">STATUS BAHAN CELANA</th>
                                    <th className="px-5 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-center">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs bg-white">
                                {filteredMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-10 text-center text-slate-400 font-bold uppercase italic text-xs">
                                            Tidak ada anggota atau pemain yang sesuai
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMembers.map((m, idx) => (
                                        <MemberTableRow
                                            key={m.id || idx}
                                            member={m}
                                            index={idx}
                                            orderId={order.rawId}
                                            onToggleStatus={onToggleStatus}
                                            onOpenEdit={onEditMember ? handleOpenEdit : undefined}
                                            onDelete={onDeleteMember ? handleDelete : undefined}
                                            isDeleting={deletingId === m.id}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Tambah Anggota */}
            <AddMemberDialog
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                order={order}
                onAddMember={async (data) => onAddMember ? onAddMember(order.rawId, data) : undefined}
                unitPrice={unitPrice}
            />

            {/* Modal Edit Anggota */}
            <EditMemberDialog
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                member={editingMember}
                onEditMember={async (detailId, data) => onEditMember ? onEditMember(order.rawId, detailId, data) : undefined}
            />
        </div>
    );
}
