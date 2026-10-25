import { useState } from "react";
import { 
    Users, 
    Plus, 
    Edit2, 
    Trash2, 
    FileText, 
    CheckCircle2, 
    Clock, 
    Search,
    Loader2,
    Receipt
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { downloadPlayersPDF } from "~/lib/sizeUtils";
import { parseSleeveAndSize } from "../../utils";
import type { MonitoringOrder, OrderMember } from "~/types";

interface OrderMembersSectionProps {
    order: MonitoringOrder;
    variant?: "desktop" | "mobile";
    onToggleStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
    onAddMember?: (orderId: number, data: { playerName: string; playerNumber?: string; playerSize: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    onEditMember?: (orderId: number, detailId: number, data: { playerName?: string; playerNumber?: string; playerSize?: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    onDeleteMember?: (orderId: number, detailId: number) => Promise<any>;
}

const COMMON_SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "Custom"];
const SLEEVE_OPTIONS = ["Pendek", "Panjang"];

export function OrderMembersSection({
    order,
    variant = "desktop",
    onToggleStatus,
    onAddMember,
    onEditMember,
    onDeleteMember
}: OrderMembersSectionProps) {
    const isMobile = variant === "mobile";
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state for Add Member
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addName, setAddName] = useState("");
    const [addNumber, setAddNumber] = useState("");
    const [addSize, setAddSize] = useState("L");
    const [addSleeve, setAddSleeve] = useState("Pendek");
    const [addStatusBaju, setAddStatusBaju] = useState(false);
    const [addStatusCelana, setAddStatusCelana] = useState(false);
    const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

    // Modal state for Edit Member
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<OrderMember | null>(null);
    const [editName, setEditName] = useState("");
    const [editNumber, setEditNumber] = useState("");
    const [editSize, setEditSize] = useState("");
    const [editSleeve, setEditSleeve] = useState("Pendek");
    const [editStatusBaju, setEditStatusBaju] = useState(false);
    const [editStatusCelana, setEditStatusCelana] = useState(false);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    // Deleting state
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Ensure member items list
    const memberItems: OrderMember[] = (order.details && order.details.length > 0)
        ? order.details
        : (order.playerInfo || []).map((p: any, idx: number) => ({
            id: p.id || idx + 1,
            playerName: p.name || "",
            playerNumber: p.number || "",
            playerSize: p.size || "",
            statusBaju: Boolean(p.statusBaju),
            statusCelana: Boolean(p.statusCelana)
        }));

    const filteredMembers = memberItems.filter(m => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
            (m.playerName && m.playerName.toLowerCase().includes(q)) ||
            (m.playerNumber && String(m.playerNumber).toLowerCase().includes(q)) ||
            (m.playerSize && m.playerSize.toLowerCase().includes(q))
        );
    });

    const readyBajuCount = memberItems.filter(m => m.statusBaju).length;
    const readyCelanaCount = memberItems.filter(m => m.statusCelana).length;
    const unitPrice = memberItems.length > 0 && order.totalAmount > 0
        ? Math.round(order.totalAmount / memberItems.length)
        : 150000;

    const handleOpenEdit = (m: OrderMember) => {
        setEditingMember(m);
        setEditName(m.playerName || "");
        setEditNumber(m.playerNumber ? String(m.playerNumber) : "");
        const parsed = parseSleeveAndSize(m.playerSize || "");
        setEditSize(parsed.size || "L");
        setEditSleeve(parsed.sleeve.toLowerCase().includes("panjang") ? "Panjang" : "Pendek");
        setEditStatusBaju(Boolean(m.statusBaju));
        setEditStatusCelana(Boolean(m.statusCelana));
        setIsEditModalOpen(true);
    };

    const handleSaveAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addName.trim()) {
            alert("Nama pemain harus diisi");
            return;
        }
        if (!onAddMember) return;

        setIsSubmittingAdd(true);
        try {
            const compositeSize = `${addSize} (${addSleeve})`;
            await onAddMember(order.rawId, {
                playerName: addName.trim(),
                playerNumber: addNumber.trim() || undefined,
                playerSize: compositeSize,
                statusBaju: addStatusBaju,
                statusCelana: addStatusCelana
            });
            setIsAddModalOpen(false);
            setAddName("");
            setAddNumber("");
            setAddSize("L");
            setAddSleeve("Pendek");
            setAddStatusBaju(false);
            setAddStatusCelana(false);
        } finally {
            setIsSubmittingAdd(false);
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editName.trim()) {
            alert("Nama pemain harus diisi");
            return;
        }
        if (!editingMember || !editingMember.id || !onEditMember) return;

        setIsSubmittingEdit(true);
        try {
            const compositeSize = `${editSize} (${editSleeve})`;
            await onEditMember(order.rawId, editingMember.id, {
                playerName: editName.trim(),
                playerNumber: editNumber.trim() || undefined,
                playerSize: compositeSize,
                statusBaju: editStatusBaju,
                statusCelana: editStatusCelana
            });
            setIsEditModalOpen(false);
            setEditingMember(null);
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    const handleDelete = async (detailId?: number) => {
        if (!detailId || !onDeleteMember) return;
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus anggota/pemain ini dari pesanan?");
        if (!confirmDelete) return;

        setDeletingId(detailId);
        try {
            await onDeleteMember(order.rawId, detailId);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#D25026] flex items-center justify-center border border-orange-100 shadow-sm">
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
                            className="bg-[#D25026] hover:bg-[#B34320] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider italic flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                        >
                            <Plus size={14} />
                            Tambah Anggota
                        </Button>
                    )}
                    <button
                        type="button"
                        onClick={() => downloadPlayersPDF(order)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest italic hover:bg-slate-50 transition-all shadow-sm text-slate-700 cursor-pointer"
                    >
                        <FileText size={14} className="text-[#D25026]" />
                        PDF
                    </button>
                </div>
            </div>

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

            {isMobile ? (
                <div className="space-y-3">
                    {filteredMembers.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-100">
                            Tidak ada anggota yang cocok dengan pencarian
                        </div>
                    ) : (
                        filteredMembers.map((m, idx) => {
                            const { size, sleeve } = parseSleeveAndSize(m.playerSize || "");
                            return (
                                <div key={m.id || idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono font-bold text-xs flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <h4 className="text-xs font-black uppercase italic text-slate-900">
                                                    {m.playerName || "Tanpa Nama"}
                                                </h4>
                                                <p className="text-[10px] text-slate-500 font-medium">
                                                    No. Punggung: <span className="font-bold text-[#D25026] font-mono">{m.playerNumber || "-"}</span>
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
                                                onClick={() => onToggleStatus && m.id && onToggleStatus(order.rawId, m.id, "statusBaju")}
                                                className={`w-full py-1.5 px-2 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                                    m.statusBaju
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                                                        : "bg-slate-100 text-slate-500 border border-slate-200"
                                                }`}
                                            >
                                                {m.statusBaju ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Clock size={12} />}
                                                {m.statusBaju ? "READY" : "BELUM"}
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Status Celana</p>
                                            <button
                                                type="button"
                                                onClick={() => onToggleStatus && m.id && onToggleStatus(order.rawId, m.id, "statusCelana")}
                                                className={`w-full py-1.5 px-2 rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                                    m.statusCelana
                                                        ? "bg-blue-50 text-blue-700 border border-blue-300"
                                                        : "bg-slate-100 text-slate-500 border border-slate-200"
                                                }`}
                                            >
                                                {m.statusCelana ? <CheckCircle2 size={12} className="text-blue-600" /> : <Clock size={12} />}
                                                {m.statusCelana ? "READY" : "BELUM"}
                                            </button>
                                        </div>
                                    </div>

                                    {(onEditMember || onDeleteMember) && (
                                        <div className="flex justify-end gap-2 pt-1 border-t border-slate-50">
                                            {onEditMember && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(m)}
                                                    className="px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:text-[#D25026] hover:bg-orange-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                                >
                                                    <Edit2 size={11} />
                                                    Edit
                                                </button>
                                            )}
                                            {onDeleteMember && (
                                                <button
                                                    type="button"
                                                    disabled={deletingId === m.id}
                                                    onClick={() => handleDelete(m.id)}
                                                    className="px-2.5 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    {deletingId === m.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
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
                                    filteredMembers.map((m, idx) => {
                                        const { size, sleeve } = parseSleeveAndSize(m.playerSize || "");
                                        return (
                                            <tr key={m.id || idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-5 py-3.5 font-bold text-slate-400 font-mono">{idx + 1}</td>
                                                <td className="px-5 py-3.5 font-black uppercase italic text-slate-900">
                                                    {m.playerName || "Tanpa Nama"}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="bg-slate-100 text-slate-900 px-3 py-1 rounded-lg border border-slate-200 font-mono font-bold text-xs inline-block min-w-[36px]">
                                                        {m.playerNumber || "-"}
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
                                                        onClick={() => onToggleStatus && m.id && onToggleStatus(order.rawId, m.id, "statusBaju")}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                            m.statusBaju
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                                                                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700"
                                                        }`}
                                                        title="Klik untuk ubah Status Bahan Baju (READY / BELUM)"
                                                    >
                                                        {m.statusBaju ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                                                        <span>{m.statusBaju ? "READY" : "BELUM"}</span>
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => onToggleStatus && m.id && onToggleStatus(order.rawId, m.id, "statusCelana")}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                            m.statusCelana
                                                                ? "bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100"
                                                                : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700"
                                                        }`}
                                                        title="Klik untuk ubah Status Bahan Celana (READY / BELUM)"
                                                    >
                                                        {m.statusCelana ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                                                        <span>{m.statusCelana ? "READY" : "BELUM"}</span>
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {onEditMember && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEdit(m)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#D25026] hover:bg-orange-50 transition-colors cursor-pointer"
                                                                title="Edit Anggota / Nama"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                        )}
                                                        {onDeleteMember && (
                                                            <button
                                                                type="button"
                                                                disabled={deletingId === m.id}
                                                                onClick={() => handleDelete(m.id)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                                                                title="Hapus Anggota"
                                                            >
                                                                {deletingId === m.id ? <Loader2 size={14} className="animate-spin text-red-500" /> : <Trash2 size={14} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Tambah Anggota */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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

                    <form onSubmit={handleSaveAdd} className="space-y-4 pt-3">
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
                                    +Rp {unitPrice.toLocaleString('id-ID')}
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
                                value={addName}
                                onChange={(e) => setAddName(e.target.value)}
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
                                    value={addNumber}
                                    onChange={(e) => setAddNumber(e.target.value)}
                                    placeholder="Contoh: 10"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#D25026] text-slate-900 bg-white"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                                    Ukuran (Size)
                                </label>
                                <select
                                    value={addSize}
                                    onChange={(e) => setAddSize(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#D25026] text-slate-900"
                                >
                                    {COMMON_SIZES.map(s => (
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
                                {SLEEVE_OPTIONS.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setAddSleeve(s)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                            addSleeve === s
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
                                    onClick={() => setAddStatusBaju(!addStatusBaju)}
                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                        addStatusBaju
                                            ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                            Bahan Baju
                                        </span>
                                        {addStatusBaju ? (
                                            <CheckCircle2 size={16} className="text-emerald-600" />
                                        ) : (
                                            <Clock size={16} className="text-slate-400" />
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${
                                            addStatusBaju
                                                ? "bg-emerald-600 text-white shadow-2xs"
                                                : "bg-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {addStatusBaju ? "READY" : "BELUM"}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAddStatusCelana(!addStatusCelana)}
                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                        addStatusCelana
                                            ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20"
                                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                            Bahan Celana
                                        </span>
                                        {addStatusCelana ? (
                                            <CheckCircle2 size={16} className="text-blue-600" />
                                        ) : (
                                            <Clock size={16} className="text-slate-400" />
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${
                                            addStatusCelana
                                                ? "bg-blue-600 text-white shadow-2xs"
                                                : "bg-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {addStatusCelana ? "READY" : "BELUM"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer text-slate-600 hover:bg-slate-100"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmittingAdd}
                                className="px-5 py-2.5 bg-[#D25026] hover:bg-[#B34320] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                                {isSubmittingAdd ? <Loader2 size={13} className="animate-spin" /> : null}
                                Simpan Anggota
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Anggota */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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

                    <form onSubmit={handleSaveEdit} className="space-y-4 pt-3">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                                Nama Pemain *
                            </label>
                            <input
                                type="text"
                                required
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
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
                                    value={editNumber}
                                    onChange={(e) => setEditNumber(e.target.value)}
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
                                    value={editSize}
                                    onChange={(e) => setEditSize(e.target.value)}
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
                                {SLEEVE_OPTIONS.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setEditSleeve(s)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                            editSleeve === s
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
                                    onClick={() => setEditStatusBaju(!editStatusBaju)}
                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                        editStatusBaju
                                            ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                            Bahan Baju
                                        </span>
                                        {editStatusBaju ? (
                                            <CheckCircle2 size={16} className="text-emerald-600" />
                                        ) : (
                                            <Clock size={16} className="text-slate-400" />
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${
                                            editStatusBaju
                                                ? "bg-emerald-600 text-white shadow-2xs"
                                                : "bg-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {editStatusBaju ? "READY" : "BELUM"}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setEditStatusCelana(!editStatusCelana)}
                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                                        editStatusCelana
                                            ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20"
                                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                                            Bahan Celana
                                        </span>
                                        {editStatusCelana ? (
                                            <CheckCircle2 size={16} className="text-blue-600" />
                                        ) : (
                                            <Clock size={16} className="text-slate-400" />
                                        )}
                                    </div>
                                    <span
                                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider w-fit ${
                                            editStatusCelana
                                                ? "bg-blue-600 text-white shadow-2xs"
                                                : "bg-slate-200 text-slate-600"
                                        }`}
                                    >
                                        {editStatusCelana ? "READY" : "BELUM"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer text-slate-600 hover:bg-slate-100"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmittingEdit}
                                className="px-5 py-2.5 bg-[#D25026] hover:bg-[#B34320] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                                {isSubmittingEdit ? <Loader2 size={13} className="animate-spin" /> : null}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
