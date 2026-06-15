import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { Plus, Edit, Trash2, History, Package, Loader2, Info, Image as ImageIcon, Eye } from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { useNavigate } from "react-router";
import { UPLOADS_URL } from "~/api/client";
import { DeleteConfirmationModal } from "~/components/ui/delete-confirmation-modal";

export function BahanBajuMobile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"manajemen" | "riwayat">("manajemen");
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bahanToDelete, setBahanToDelete] = useState<{ id: number; nama: string } | null>(null);

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

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-geist pb-24 relative">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Bahan"
                description="Hapus bahan ini dan seluruh riwayat stoknya?"
                itemName={bahanToDelete?.nama}
            />

            <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-40 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Bahan Baju</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 italic">Kelola Stok & Riwayat</p>
                    </div>
                </div>
                
                {/* Tabbing Mobile */}
                <div className="flex bg-slate-50 p-1 rounded-xl mt-6 border border-slate-100">
                    <Button 
                        variant="ghost"
                        onClick={() => setActiveTab("manajemen")}
                        className={`flex-1 h-10 rounded-lg text-xs font-bold transition-all ${activeTab === "manajemen" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
                    >
                        <Package className="w-3.5 h-3.5 mr-1.5" />
                        Manajemen
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={() => setActiveTab("riwayat")}
                        className={`flex-1 h-10 rounded-lg text-xs font-bold transition-all ${activeTab === "riwayat" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
                    >
                        <History className="w-3.5 h-3.5 mr-1.5" />
                        Riwayat
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-4 mt-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Memuat Data...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === "manajemen" && (
                            <div className="space-y-4 w-full">
                                <Button 
                                    onClick={() => navigate("/admin/bahan-baju/create")}
                                    className="w-full h-14 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Bahan Baru
                                </Button>

                                {/* Card List for Data */}
                                <div className="space-y-3 w-full">
                                    {bahanList.length > 0 ? (
                                        bahanList.map((item) => (
                                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                                <div className="flex items-start gap-4">
                                                    {item.imageUrl ? (
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0 shadow-md">
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
                                                        <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 text-slate-300 shadow-sm">
                                                            <ImageIcon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h3 className="text-sm font-bold text-slate-900 truncate">{item.nama}</h3>
                                                            <div className="flex flex-col gap-1.5 shrink-0">
                                                                <div className="bg-[#FFF0EB] px-2 py-1 rounded border border-[#FFD8CC] flex flex-col items-center min-w-[40px]">
                                                                    <span className="text-[8px] font-black text-[#D25026] uppercase tracking-widest italic">Stok</span>
                                                                    <span className="text-xs font-black text-[#D25026]">{item.stok}</span>
                                                                </div>
                                                                <div className="bg-blue-50 px-2 py-1 rounded border border-blue-100 flex flex-col items-center min-w-[40px]">
                                                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest italic text-center leading-tight">Harga</span>
                                                                    <span className="text-[10px] font-black text-blue-600 whitespace-nowrap">
                                                                        <span className="text-[8px] opacity-60 mr-0.5 italic">Rp</span>
                                                                        {new Intl.NumberFormat('id-ID').format(item.harga || 0)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium line-clamp-2 italic">{item.deskripsi || "Tidak ada deskripsi"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-3 border-t border-slate-50 mt-1">
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => navigate(`/admin/bahan-baju/detail/${item.id}`)}
                                                        className="flex-1 h-10 rounded-xl border-slate-100 text-slate-600 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold uppercase tracking-widest"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 mr-1.5" /> Detail
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => navigate(`/admin/bahan-baju/edit/${item.id}`)}
                                                        className="flex-1 h-10 rounded-xl border-orange-100 text-orange-600 bg-orange-50/50 hover:bg-orange-100 text-[10px] font-bold uppercase tracking-widest"
                                                    >
                                                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => handleDeleteClick(item.id, item.nama)}
                                                        className="flex-1 h-10 rounded-xl border-red-100 text-red-600 bg-red-50/50 hover:bg-red-100 text-[10px] font-bold uppercase tracking-widest"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Hapus
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center flex flex-col items-center shadow-sm">
                                            <Package className="w-12 h-12 text-slate-200 mb-3" />
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Belum ada bahan</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "riwayat" && (
                            <div className="space-y-3 w-full">
                                {historyList.length > 0 ? (
                                    historyList.map((hist) => (
                                        <div key={hist.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {new Date(hist.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border
                                                    ${hist.aksi === 'TAMBAH' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                      hist.aksi === 'KURANG' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                                      hist.aksi === 'BUAT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                      hist.aksi === 'HAPUS' ? 'bg-red-50 text-red-600 border-red-100' :
                                                      'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                                    {hist.aksi}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-900">{hist.namaBahan || hist.bahan?.nama || "Terhapus"}</h3>
                                                    <span className="text-[9.5px] font-bold text-slate-500 block mt-1 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 w-fit">
                                                        Aktor: {hist.actor || "System"}
                                                    </span>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Info className="w-3 h-3 text-slate-400" />
                                                        <span className="text-[10px] text-slate-500 italic leading-relaxed">{hist.keterangan || "-"}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono text-sm font-black">
                                                        {hist.aksi === 'TAMBAH' ? <span className="text-emerald-600">+{hist.jumlah}</span> : 
                                                         hist.aksi === 'KURANG' ? <span className="text-orange-600">-{hist.jumlah}</span> : 
                                                         hist.aksi === 'HAPUS' ? <span className="text-red-600">-{hist.jumlah}</span> :
                                                         <span className="text-slate-400">{hist.jumlah}</span>}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">Akhir: {hist.stokAkhir}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center flex flex-col items-center shadow-sm">
                                        <History className="w-12 h-12 text-slate-200 mb-3" />
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Belum ada riwayat</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
