import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { Plus, Edit, Trash2, History, Package, Loader2, Image as ImageIcon, ChevronUp, ChevronDown, ChevronsUpDown, X, Save, ImagePlus, Eye } from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { useNavigate } from "react-router";
import { UPLOADS_URL } from "~/api/client";
import { DeleteConfirmationModal } from "~/components/ui/delete-confirmation-modal";
import { cn } from "~/lib/utils";

export function BahanBajuDesktop() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"penyubliman" | "katalog" | "riwayat">("penyubliman");
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bahanToDelete, setBahanToDelete] = useState<{ id: number; nama: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resBahan = await adminApi.getBahanBaju();
            if (resBahan.status === "success") setBahanList(resBahan.data);

            const resHistory = await adminApi.getBahanBajuHistory();
            if (resHistory.status === "success") setHistoryList(resHistory.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = (id: number, nama: string) => {
        setBahanToDelete({ id, nama });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bahanToDelete) return;
        try {
            await adminApi.deleteBahanBaju(bahanToDelete.id);
            setToast({ title: "Bahan berhasil dihapus", variant: "success" });
            fetchData();
        } catch (error) {
            console.error(error);
            setToast({ title: "Gagal menghapus data", variant: "destructive" });
        } finally {
            setIsDeleteModalOpen(false);
            setBahanToDelete(null);
        }
    };

    const [sortColumn, setSortColumn] = useState<"nama" | "stok" | "harga" | "tanggal" | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const sortedBahanList = [...bahanList].sort((a, b) => {
        if (!sortColumn) return 0;
        
        let valA, valB;
        if (sortColumn === "nama") {
            valA = a.nama.toLowerCase();
            valB = b.nama.toLowerCase();
        } else if (sortColumn === "stok") {
            valA = a.kuantitasKg;
            valB = b.kuantitasKg;
        } else if (sortColumn === "harga") {
            valA = a.harga || 0;
            valB = b.harga || 0;
        } else if (sortColumn === "tanggal") {
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
        } else {
            return 0;
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const toggleSort = (col: "nama" | "stok" | "harga" | "tanggal") => {
        if (sortColumn === col) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-geist p-8 relative">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Bahan"
                description="Apakah Anda yakin ingin menghapus bahan ini? Seluruh riwayat stok terkait juga akan dihapus permanen."
                itemName={bahanToDelete?.nama}
            />

            <div className="w-full">
                <div className="mb-8">
                    <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Management Admin</h1>
                    <p className="text-slate-500 mt-1">Manajemen Bahan Baju</p>
                </div>

                {/* Tabbing */}
                <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
                    <button 
                        onClick={() => setActiveTab("penyubliman")}
                        className={cn(
                            "pb-4 px-2 text-sm font-semibold transition-all relative",
                            activeTab === "penyubliman" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Tahap Penyubliman
                        {activeTab === "penyubliman" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab("katalog")}
                        className={cn(
                            "pb-4 px-2 text-sm font-semibold transition-all relative",
                            activeTab === "katalog" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Informasi Penjualan (Katalog)
                        {activeTab === "katalog" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab("riwayat")}
                        className={cn(
                            "pb-4 px-2 text-sm font-semibold transition-all relative",
                            activeTab === "riwayat" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Riwayat Stok
                        {activeTab === "riwayat" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
                        <p className="text-xs font-bold text-slate-400">Memuat Data...</p>
                    </div>
                ) : (
                    <div className="w-full">
                        {activeTab === "penyubliman" && (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Tahap Penyubliman (Operasional Produksi)</h2>
                                    <Button 
                                        onClick={() => navigate("/admin/bahan-baju/create")}
                                        className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Bahan
                                    </Button>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[180px]">Nama Bahan</th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 text-center w-[130px]">Ketersediaan</th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 text-center w-[210px]">Estimasi Produksi</th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[150px]">Harga Beli</th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[150px]">Bukti Nota</th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[180px]">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {sortedBahanList.length > 0 ? (
                                                    sortedBahanList.map((item) => (
                                                        <tr key={`penyubliman-${item.id}`} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="font-bold text-slate-800 text-sm mt-3">{item.nama}</div>
                                                            </td>
                                                            <td className="px-4 py-4 align-top text-center">
                                                                <div className="flex flex-col items-center gap-1.5 mt-3 justify-center">
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                                                        item.status === "Tersedia" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                                                                    )}>
                                                                        {item.status}
                                                                    </span>
                                                                    <span className="text-xs font-black text-slate-700">
                                                                        {item.kuantitasKg} kg
                                                                    </span>
                                                                    <span className="text-[10px] font-medium text-slate-400">
                                                                        ~{(item.kuantitasKg * (item.rasioKonversi || 2.5)).toFixed(1)} m
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 align-top">
                                                                <div className="grid grid-cols-2 gap-1 w-full mt-1">
                                                                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-blue-400 uppercase tracking-wide leading-none mb-0.5">Pendek S-2XL</div>
                                                                        <div className="text-[11px] font-black text-blue-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 0.8333))} pcs</div>
                                                                    </div>
                                                                    <div className="bg-blue-50/60 border border-blue-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-blue-400 uppercase tracking-wide leading-none mb-0.5">Pendek 3XL+</div>
                                                                        <div className="text-[11px] font-black text-blue-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                    </div>
                                                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-wide leading-none mb-0.5">Panjang S-2XL</div>
                                                                        <div className="text-[11px] font-black text-indigo-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                    </div>
                                                                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-wide leading-none mb-0.5">Panjang 3XL+</div>
                                                                        <div className="text-[11px] font-black text-indigo-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 2.5))} pcs</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="font-black text-orange-600 text-[13px] mt-3">
                                                                    <span className="text-[10px] opacity-60 mr-1 italic">Rp</span>
                                                                    {new Intl.NumberFormat('id-ID').format(item.hargaBeli || 0)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="mt-3">
                                                                    {item.buktiNotaUrl ? (
                                                                        <a href={UPLOADS_URL + item.buktiNotaUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-600 underline">Lihat Nota</a>
                                                                    ) : (
                                                                        <span className="text-xs text-slate-400 italic">Tidak ada nota</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        onClick={() => navigate(`/admin/bahan-baju/detail/${item.id}`)}
                                                                        className="h-11 w-11 rounded-2xl bg-blue-50/50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 transition-all shadow-sm flex items-center justify-center group"
                                                                        title="Lihat Detail"
                                                                    >
                                                                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        onClick={() => navigate(`/admin/bahan-baju/edit/${item.id}`)}
                                                                        className="h-11 w-11 rounded-2xl bg-orange-50/50 hover:bg-orange-100 text-orange-600 border border-orange-100/50 transition-all shadow-sm flex items-center justify-center group"
                                                                        title="Edit Bahan"
                                                                    >
                                                                        <Edit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        onClick={() => handleDeleteClick(item.id, item.nama)}
                                                                        className="h-11 w-11 rounded-2xl bg-red-50/50 hover:bg-red-100 text-red-600 border border-red-100/50 transition-all shadow-sm flex items-center justify-center group"
                                                                        title="Hapus Bahan"
                                                                    >
                                                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-20 text-center">
                                                            <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                                                                <Package className="w-10 h-10 text-slate-200" />
                                                                <p className="text-sm font-semibold">Belum ada data bahan baku</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "katalog" && (
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Informasi Penjualan (Katalog)</h2>
                                    <Button 
                                        onClick={() => navigate("/admin/bahan-baju/create")}
                                        className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Tambah Bahan
                                    </Button>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
                                    <div className="overflow-x-auto w-full">
                                        <table className="w-full text-left border-collapse table-fixed min-w-[1250px]">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[110px]">Gambar</th>
                                                    <th 
                                                        className="px-6 py-4 text-[13px] font-semibold text-slate-500 cursor-pointer hover:bg-slate-50/50 transition-colors w-[180px]"
                                                        onClick={() => toggleSort("nama")}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            Nama Bahan
                                                            <ChevronsUpDown className="w-3 h-3 opacity-50" />
                                                        </div>
                                                    </th>
                                                    <th 
                                                        className="px-6 py-4 text-[13px] font-semibold text-slate-500 cursor-pointer hover:bg-slate-50/50 transition-colors w-[120px]"
                                                        onClick={() => toggleSort("harga")}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            Harga
                                                            <ChevronsUpDown className="w-3 h-3 opacity-50" />
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500">Deskripsi</th>
                                                    <th 
                                                        className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[130px] cursor-pointer hover:bg-slate-50/50 transition-colors text-center"
                                                        onClick={() => toggleSort("stok")}
                                                    >
                                                        <div className="flex items-center justify-center gap-2">
                                                            Ketersediaan
                                                            <ChevronsUpDown className="w-3 h-3 opacity-50" />
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[210px] text-center">Estimasi Jersey</th>
                                                    <th 
                                                        className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[110px] cursor-pointer hover:bg-slate-50/50 transition-colors"
                                                        onClick={() => toggleSort("tanggal")}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            Tanggal
                                                            <ChevronsUpDown className="w-3 h-3 opacity-50" />
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-[13px] font-semibold text-slate-500 w-[180px]">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {sortedBahanList.length > 0 ? (
                                                    sortedBahanList.map((item) => (
                                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="px-6 py-4 align-top">
                                                                {item.imageUrl ? (
                                                                    <div 
                                                                        onClick={() => setPreviewImage(UPLOADS_URL + item.imageUrl)}
                                                                        className="w-[90px] h-[90px] rounded-2xl overflow-hidden border-2 border-white shadow-md ring-1 ring-slate-200 group-hover:scale-105 transition-all duration-500 cursor-zoom-in"
                                                                    >
                                                                        <img 
                                                                            src={UPLOADS_URL + item.imageUrl} 
                                                                            alt={item.nama} 
                                                                            className="w-full h-full object-cover" 
                                                                            onError={(e) => {
                                                                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Error';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-[90px] h-[90px] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="font-bold text-slate-800 text-sm mt-3">{item.nama}</div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="font-black text-blue-600 text-[13px] mt-3">
                                                                    <span className="text-[10px] opacity-60 mr-1 italic">Rp</span>
                                                                    {new Intl.NumberFormat('id-ID').format(item.harga || 0)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="text-[13px] text-slate-500 leading-relaxed mt-3 line-clamp-2 italic">
                                                                    {item.deskripsi || "-"}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 align-top text-center">
                                                                <div className="flex flex-col items-center gap-1.5 mt-3 justify-center">
                                                                    <span className={cn(
                                                                        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                                                        item.status === "Tersedia" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                                                                    )}>
                                                                        {item.status}
                                                                    </span>
                                                                    <span className="text-xs font-black text-slate-700">
                                                                        {item.kuantitasKg} kg
                                                                    </span>
                                                                    <span className="text-[10px] font-medium text-slate-400">
                                                                        ~{(item.kuantitasKg * (item.rasioKonversi || 2.5)).toFixed(1)} m
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 align-top">
                                                                <div className="grid grid-cols-2 gap-1 w-full mt-1">
                                                                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-blue-400 uppercase tracking-wide leading-none mb-0.5">Pendek S-2XL</div>
                                                                        <div className="text-[11px] font-black text-blue-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 0.8333))} pcs</div>
                                                                    </div>
                                                                    <div className="bg-blue-50/60 border border-blue-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-blue-400 uppercase tracking-wide leading-none mb-0.5">Pendek 3XL+</div>
                                                                        <div className="text-[11px] font-black text-blue-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                    </div>
                                                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-wide leading-none mb-0.5">Panjang S-2XL</div>
                                                                        <div className="text-[11px] font-black text-indigo-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                    </div>
                                                                    <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg px-2 py-1.5 text-center">
                                                                        <div className="text-[8px] font-bold text-indigo-400 uppercase tracking-wide leading-none mb-0.5">Panjang 3XL+</div>
                                                                        <div className="text-[11px] font-black text-indigo-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 2.5))} pcs</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="text-[13px] text-slate-500 mt-2">
                                                                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                                                        day: "numeric",
                                                                        month: "numeric",
                                                                        year: "numeric"
                                                                    })}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 align-top">
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        onClick={() => navigate(`/admin/bahan-baju/detail/${item.id}`)}
                                                                        className="h-11 w-11 rounded-2xl bg-blue-50/50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 transition-all shadow-sm flex items-center justify-center group"
                                                                        title="Lihat Detail"
                                                                    >
                                                                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        onClick={() => navigate(`/admin/bahan-baju/edit/${item.id}`)}
                                                                        className="h-11 w-11 rounded-2xl bg-orange-50/50 hover:bg-orange-100 text-orange-600 border border-orange-100/50 transition-all shadow-sm flex items-center justify-center group"
                                                                        title="Edit Bahan"
                                                                    >
                                                                        <Edit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        onClick={() => handleDeleteClick(item.id, item.nama)}
                                                                        className="h-11 w-11 rounded-2xl bg-red-50/50 hover:bg-red-100 text-red-600 border border-red-100/50 transition-all shadow-sm flex items-center justify-center group"
                                                                        title="Hapus Bahan"
                                                                    >
                                                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-20 text-center">
                                                            <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                                                                <Package className="w-10 h-10 text-slate-200" />
                                                                <p className="text-sm font-semibold">Belum ada data bahan baku</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "riwayat" && (
                            <div className="w-full bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                                <div className="p-6 border-b border-slate-50">
                                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-900">Log Aktivitas Stok</h3>
                                </div>
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Waktu</th>
                                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Bahan</th>
                                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Aksi</th>
                                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Aktor</th>
                                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic text-center">Perubahan</th>
                                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic text-center">Ketersediaan Akhir</th>
                                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {historyList.length > 0 ? (
                                                historyList.map((hist) => (
                                                    <tr key={hist.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-sm font-bold text-slate-500">
                                                                {new Date(hist.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="font-bold text-slate-900 text-base">{hist.namaBahan || hist.bahan?.nama || "Bahan Terhapus"}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID Ref: #{hist.bahanId || "Deleted"}</div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={cn(
                                                                "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border",
                                                                hist.aksi === 'TAMBAH' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                                hist.aksi === 'KURANG' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                                                hist.aksi === 'BUAT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                                hist.aksi === 'HAPUS' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                'bg-slate-100 text-slate-600 border-slate-200'
                                                            )}>
                                                                {hist.aksi}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="text-sm font-bold text-slate-700">{hist.actor || "System"}</div>
                                                        </td>
                                                        <td className="px-6 py-5 text-center font-mono font-bold text-sm">
                                                            {hist.aksi === 'TAMBAH' ? <span className="text-emerald-600">+{hist.jumlah} kg</span> : 
                                                             hist.aksi === 'KURANG' ? <span className="text-orange-600">-{hist.jumlah} kg</span> : 
                                                             hist.aksi === 'HAPUS' ? <span className="text-red-600">-{hist.jumlah} kg</span> :
                                                             <span className="text-slate-400">{hist.jumlah} kg</span>}
                                                        </td>
                                                        <td className="px-6 py-5 text-center font-black text-slate-900 text-sm">{hist.stokAkhir} kg</td>
                                                        <td className="px-6 py-5">
                                                            <div className="max-w-[300px] text-sm font-medium text-slate-500 italic leading-relaxed whitespace-pre-wrap break-words">{hist.keterangan || "-"}</div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-20 text-center">
                                                        <div className="flex flex-col items-center justify-center text-slate-400 space-y-4">
                                                            <History className="w-16 h-16 text-slate-200" />
                                                            <p className="text-sm font-bold italic uppercase tracking-widest">Belum ada riwayat aktivitas</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Image Preview Lightbox */}
            <div className={cn(
                "fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-8 transition-all duration-300",
                previewImage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )} onClick={() => setPreviewImage(null)}>
                <button className="absolute top-8 right-8 p-3 text-white/50 hover:text-white transition-colors">
                    <X className="w-8 h-8" />
                </button>
                <div className={cn(
                    "relative max-w-full max-h-full transition-transform duration-300 scale-95 flex items-center justify-center",
                    previewImage && "scale-100"
                )} onClick={e => e.stopPropagation()}>
                    {previewImage && (
                        <img 
                            src={previewImage} 
                            alt="Full Preview" 
                            className="rounded-xl shadow-2xl border-4 border-white/20 object-contain max-w-[90vw] max-h-[90vh]" 
                        />
                    )}
                </div>
            </div>

        </div>
    );
}
