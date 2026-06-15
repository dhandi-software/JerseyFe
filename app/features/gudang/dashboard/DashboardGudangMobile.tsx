import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { useSidebar } from "~/components/ui/sidebar";
import { 
  Plus, History, Package, Loader2, Image as ImageIcon, 
  X, Save, ImagePlus, Eye, Search, AlertTriangle, Menu,
  ArrowUpRight, ArrowDownRight, RefreshCw, Edit, Trash2
} from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";
import { useAuth } from "~/hooks/useAuth";

export function DashboardGudangMobile() {
    const { user } = useAuth();
    const { setOpenMobile } = useSidebar();
    const [activeTab, setActiveTab] = useState<"manajemen" | "riwayat">("manajemen");
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState<"all" | "low" | "empty">("all");
    const [logSearchQuery, setLogSearchQuery] = useState("");

    // Modal states
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustItem, setAdjustItem] = useState<any | null>(null);
    const [adjustAction, setAdjustAction] = useState<"TAMBAH" | "KURANG">("TAMBAH");
    const [adjustAmount, setAdjustAmount] = useState<number>(0);
    const [adjustNote, setAdjustNote] = useState("");
    const [adjustLoading, setAdjustLoading] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createForm, setCreateForm] = useState({
        nama: "",
        deskripsi: "",
        stok: 0,
        harga: 0,
    });
    const [createImage, setCreateImage] = useState<File | null>(null);
    const [createImagePreview, setCreateImagePreview] = useState<string | null>(null);
    const createFileInputRef = useRef<HTMLInputElement>(null);

    const [selectedDetailItem, setSelectedDetailItem] = useState<any | null>(null);

    // Edit states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        nama: "",
        deskripsi: "",
        stok: 0,
        harga: 0,
    });
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [deleteExistingImage, setDeleteExistingImage] = useState(false);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Delete states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<any | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const formatThousands = (value: number | string) => {
        if (!value) return "";
        const num = typeof value === "string" ? value.replace(/[^0-9]/g, "") : value.toString();
        return new Intl.NumberFormat('id-ID').format(Number(num));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const resBahan = await adminApi.getBahanBaju();
            if (resBahan.status === "success") setBahanList(resBahan.data);

            const resHistory = await adminApi.getBahanBajuHistory();
            if (resHistory.status === "success") setHistoryList(resHistory.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setToast({ title: "Gagal memuat data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Quick stock adjustment handler
    const handleOpenAdjust = (item: any) => {
        setAdjustItem(item);
        setAdjustAmount(0);
        setAdjustNote("");
        setAdjustAction("TAMBAH");
        setIsAdjustModalOpen(true);
    };

    const handleAdjustSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adjustItem || adjustAmount <= 0) return;

        setAdjustLoading(true);
        try {
            const currentStok = adjustItem.stok;
            const change = adjustAction === "TAMBAH" ? adjustAmount : -adjustAmount;
            const newStok = Math.max(0, currentStok + change);

            const formData = new FormData();
            formData.append("nama", adjustItem.nama);
            formData.append("deskripsi", adjustItem.deskripsi || "");
            formData.append("stok", newStok.toString());
            formData.append("harga", (adjustItem.harga || 0).toString());
            formData.append("keterangan_ubah", adjustNote || (adjustAction === "TAMBAH" ? "Penambahan stok" : "Pengurangan stok"));
            formData.append("actor", user?.name || "Staf Gudang");

            const res = await adminApi.updateBahanBaju(adjustItem.id, formData);
            if (res.status === "success") {
                setToast({ title: `Stok diperbarui`, variant: "success" });
                setIsAdjustModalOpen(false);
                fetchData();
            } else {
                setToast({ title: "Gagal memperbarui stok", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            setToast({ title: "Terjadi kesalahan", variant: "destructive" });
        } finally {
            setAdjustLoading(false);
        }
    };

    const handleCreateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCreateImage(file);
            setCreateImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.nama.trim()) {
            setToast({ title: "Nama bahan tidak boleh kosong", variant: "destructive" });
            return;
        }

        setCreateLoading(true);
        try {
            const formData = new FormData();
            formData.append("nama", createForm.nama);
            formData.append("deskripsi", createForm.deskripsi);
            formData.append("stok", createForm.stok.toString());
            formData.append("harga", createForm.harga.toString());
            formData.append("actor", user?.name || "Staf Gudang");
            if (createImage) {
                formData.append("image", createImage);
            }

            const res = await adminApi.createBahanBaju(formData);
            if (res.status === "success") {
                setToast({ title: "Bahan berhasil dibuat", variant: "success" });
                setIsCreateModalOpen(false);
                setCreateForm({ nama: "", deskripsi: "", stok: 0, harga: 0 });
                setCreateImage(null);
                setCreateImagePreview(null);
                fetchData();
            } else {
                setToast({ title: "Gagal membuat bahan", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            setToast({ title: "Terjadi kesalahan", variant: "destructive" });
        } finally {
            setCreateLoading(false);
        }
    };

    // Edit material handlers
    const handleOpenEdit = (item: any) => {
        setEditItem(item);
        setEditForm({
            nama: item.nama,
            deskripsi: item.deskripsi || "",
            stok: item.stok,
            harga: item.harga || 0,
        });
        setEditImage(null);
        setEditImagePreview(item.imageUrl ? UPLOADS_URL + item.imageUrl : null);
        setDeleteExistingImage(false);
        setIsEditModalOpen(true);
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditImage(file);
            setEditImagePreview(URL.createObjectURL(file));
            setDeleteExistingImage(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editItem) return;
        if (!editForm.nama.trim()) {
            setToast({ title: "Nama bahan tidak boleh kosong", variant: "destructive" });
            return;
        }

        setEditLoading(true);
        try {
            const formData = new FormData();
            formData.append("nama", editForm.nama);
            formData.append("deskripsi", editForm.deskripsi);
            formData.append("stok", editForm.stok.toString());
            formData.append("harga", editForm.harga.toString());
            formData.append("actor", user?.name || "Staf Gudang");
            
            if (editImage) {
                formData.append("image", editImage);
            } else if (deleteExistingImage) {
                formData.append("deleteImage", "true");
            }

            const res = await adminApi.updateBahanBaju(editItem.id, formData);
            if (res.status === "success") {
                setToast({ title: "Bahan berhasil diperbarui", variant: "success" });
                setIsEditModalOpen(false);
                fetchData();
            } else {
                setToast({ title: "Gagal memperbarui bahan", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            setToast({ title: "Terjadi kesalahan", variant: "destructive" });
        } finally {
            setEditLoading(false);
        }
    };

    // Delete material handlers
    const handleOpenDelete = (item: any) => {
        setDeleteItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deleteItem) return;

        setDeleteLoading(true);
        try {
            const res = await adminApi.deleteBahanBaju(deleteItem.id, user?.name || "Staf Gudang");
            if (res.status === "success") {
                setToast({ title: `Bahan ${deleteItem.nama} dihapus`, variant: "success" });
                setIsDeleteModalOpen(false);
                setDeleteItem(null);
                fetchData();
            } else {
                setToast({ title: "Gagal menghapus bahan", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            setToast({ title: "Terjadi kesalahan", variant: "destructive" });
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filter materials
    const filteredBahan = bahanList.filter(item => {
        const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesStock = true;
        if (stockFilter === "low") {
            matchesStock = item.stok > 0 && item.stok <= 20;
        } else if (stockFilter === "empty") {
            matchesStock = item.stok === 0;
        }

        return matchesSearch && matchesStock;
    });

    // Filter logs
    const filteredHistory = historyList.filter(log => {
        const namaBahan = log.namaBahan || log.bahan?.nama || "";
        const query = logSearchQuery.toLowerCase();
        return namaBahan.toLowerCase().includes(query) || log.aksi.toLowerCase().includes(query);
    });

    const totalStockUnits = bahanList.reduce((sum, item) => sum + item.stok, 0);
    const lowStockCount = bahanList.filter(item => item.stok > 0 && item.stok <= 20).length;

    return (
        <div className="w-full min-h-screen bg-[#F5F5F3] font-['Inter'] flex flex-col gap-4 p-4 pb-24">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setOpenMobile(true)}
                        className="p-2 -ml-2 rounded-xl hover:bg-slate-200/50 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-slate-900" />
                    </button>
                    <div className="text-slate-900 text-2xl font-black">Portal Gudang</div>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 active:scale-95 transition-transform"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Metrics cards container (scrollable or stacked) */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-transparent shadow-sm">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Stok</span>
                    <h3 className="text-slate-900 text-xl font-black mt-1 text-blue-600">
                        {totalStockUnits} <span className="text-[10px] text-slate-400">Pcs</span>
                    </h3>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-transparent shadow-sm">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Stok Menipis</span>
                    <h3 className="text-slate-900 text-xl font-black mt-1 text-amber-500">
                        {lowStockCount} <span className="text-[10px] text-slate-400">Bahan</span>
                    </h3>
                </div>
            </div>

            {/* Quick Add Button */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full h-12 bg-[#D25026] hover:bg-[#B34320] text-slate-900 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-[#D25026]/10 text-xs uppercase tracking-widest"
            >
                <Plus className="w-4 h-4 text-slate-900" />
                Tambah Bahan Baku
            </button>

            {/* Tabbing */}
            <div className="flex bg-white/60 p-1 rounded-2xl border border-slate-250/20 w-full">
                <button
                    onClick={() => setActiveTab("manajemen")}
                    className={cn(
                        "flex-1 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all text-center justify-center flex items-center gap-2",
                        activeTab === "manajemen" 
                            ? "bg-white text-[#D25026] shadow-sm" 
                            : "text-slate-500 hover:text-slate-800"
                    )}
                >
                    <Package className="w-3.5 h-3.5" />
                    Bahan Baku
                </button>
                <button
                    onClick={() => setActiveTab("riwayat")}
                    className={cn(
                        "flex-1 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all text-center justify-center flex items-center gap-2",
                        activeTab === "riwayat" 
                            ? "bg-white text-[#D25026] shadow-sm" 
                            : "text-slate-500 hover:text-slate-800"
                    )}
                >
                    <History className="w-3.5 h-3.5" />
                    Log Stok
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-widest italic animate-pulse">Memuat Data...</p>
                </div>
            ) : (
                <div className="w-full">
                    {/* MANAJEMEN TAB MOBILE */}
                    {activeTab === "manajemen" && (
                        <div className="space-y-4">
                            {/* Search and Filters */}
                            <div className="bg-white p-4 rounded-2xl border border-transparent shadow-sm space-y-3">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="Cari nama bahan baku..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-slate-55/60 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#D25026] transition-colors w-full"
                                    />
                                </div>
                                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 justify-between">
                                    {(["all", "low", "empty"] as const).map((filter) => {
                                        const labels = { all: "Semua", low: "Tipis", empty: "Habis" };
                                        const isActive = stockFilter === filter;
                                        return (
                                            <button
                                                key={filter}
                                                onClick={() => setStockFilter(filter)}
                                                className={cn(
                                                    "flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                                    isActive ? "bg-white text-[#D25026] shadow-sm" : "text-slate-400"
                                                )}
                                            >
                                                {labels[filter]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Card Lists */}
                            <div className="space-y-3">
                                {filteredBahan.length > 0 ? (
                                    filteredBahan.map((item) => (
                                        <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-transparent flex flex-col gap-3 group">
                                            <div className="flex gap-3">
                                                {item.imageUrl ? (
                                                    <div 
                                                        onClick={() => setPreviewImage(UPLOADS_URL + item.imageUrl)}
                                                        className="w-16 h-16 rounded-xl overflow-hidden border cursor-zoom-in shrink-0"
                                                    >
                                                        <img src={UPLOADS_URL + item.imageUrl} alt={item.nama} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-slate-100 border flex items-center justify-center text-slate-400 shrink-0">
                                                        <ImageIcon className="w-5 h-5 opacity-40" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.nama}</h4>
                                                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">ID: #{item.id}</span>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-xs font-black text-[#D25026]">
                                                            Rp {new Intl.NumberFormat('id-ID').format(item.harga || 0)}
                                                        </span>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border",
                                                            item.stok > 50 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                            item.stok > 20 ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                            "bg-red-50 text-red-700 border-red-100"
                                                        )}>
                                                            Stok: {item.stok}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2 pt-2.5 border-t border-slate-100">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => setSelectedDetailItem(item)}
                                                        className="h-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-650 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Detail
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenAdjust(item)}
                                                        className="h-9 rounded-xl bg-[#FFF0EB] hover:bg-[#FFE0D5] text-[#D25026] text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border border-[#FFD9CD]"
                                                    >
                                                        <Save className="w-3.5 h-3.5" />
                                                        Stok
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="h-9 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border border-amber-250"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDelete(item)}
                                                        className="h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border border-red-200"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-10 rounded-2xl text-center shadow-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                                        <Package className="w-10 h-10 opacity-30" />
                                        <p className="text-xs font-bold uppercase tracking-wider italic">Bahan tidak ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* RIWAYAT LOG TAB MOBILE */}
                    {activeTab === "riwayat" && (
                        <div className="space-y-4">
                            {/* Search bar */}
                            <div className="bg-white p-4 rounded-2xl border border-transparent shadow-sm">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="Cari log..."
                                        value={logSearchQuery}
                                        onChange={(e) => setLogSearchQuery(e.target.value)}
                                        className="bg-slate-55/60 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#D25026] transition-colors w-full"
                                    />
                                </div>
                            </div>

                            {/* Logs list mobile */}
                            <div className="space-y-3">
                                {filteredHistory.length > 0 ? (
                                    filteredHistory.map((hist) => (
                                        <div key={hist.id} className="bg-white p-4 rounded-2xl shadow-sm border border-transparent space-y-2.5">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{hist.namaBahan || hist.bahan?.nama || "Bahan Terhapus"}</h4>
                                                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                                                        {new Date(hist.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })} {new Date(hist.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="text-[9.5px] font-bold text-slate-550 block mt-1 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5 w-fit">
                                                        Aktor: {hist.actor || "System"}
                                                    </span>
                                                </div>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-md text-[8px] font-black uppercase border",
                                                    hist.aksi === 'TAMBAH' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                    hist.aksi === 'KURANG' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                                    hist.aksi === 'BUAT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                    'bg-slate-50 text-slate-650'
                                                )}>
                                                    {hist.aksi}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                                                <div>
                                                    <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider">Perubahan</span>
                                                    <span className="font-extrabold text-sm mt-0.5 inline-block">
                                                        {hist.aksi === 'TAMBAH' ? <span className="text-emerald-600">+{hist.jumlah}</span> : 
                                                         hist.aksi === 'KURANG' ? <span className="text-orange-600">-{hist.jumlah}</span> : 
                                                         <span className="text-slate-450">{hist.jumlah}</span>}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-slate-400 font-bold block text-[8px] uppercase tracking-wider">Stok Akhir</span>
                                                    <span className="font-black text-sm text-slate-800 mt-0.5 inline-block">{hist.stokAkhir}</span>
                                                </div>
                                            </div>
                                            {hist.keterangan && (
                                                <p className="text-[11px] font-semibold text-slate-500 italic leading-relaxed whitespace-pre-wrap pl-1 border-l-2 border-slate-200">
                                                    {hist.keterangan}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-10 rounded-2xl text-center shadow-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                                        <History className="w-10 h-10 opacity-30" />
                                        <p className="text-xs font-bold uppercase tracking-wider italic">Belum ada riwayat log</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ADJUST STOK DIALOG MOBILE */}
            {isAdjustModalOpen && adjustItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-[90vw] max-w-[380px] p-6 border border-slate-100 shadow-2xl space-y-4 transform animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Update Stok</h3>
                            <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs">
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-800 leading-tight truncate">{adjustItem.nama}</h4>
                                <p className="text-[#D25026] font-bold mt-0.5">Stok Saat Ini: {adjustItem.stok} unit</p>
                            </div>
                        </div>

                        <form onSubmit={handleAdjustSubmit} className="space-y-3.5">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic block">Aksi Stok</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setAdjustAction("TAMBAH")}
                                        className={cn(
                                            "h-10 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all text-[10px]",
                                            adjustAction === "TAMBAH" 
                                                ? "bg-emerald-50 border-emerald-250 text-emerald-700 shadow-sm"
                                                : "bg-white border-slate-200 text-slate-500"
                                        )}
                                    >
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                        TAMBAH
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAdjustAction("KURANG")}
                                        className={cn(
                                            "h-10 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all text-[10px]",
                                            adjustAction === "KURANG" 
                                                ? "bg-orange-50 border-orange-250 text-orange-700 shadow-sm"
                                                : "bg-white border-slate-200 text-slate-500"
                                        )}
                                    >
                                        <ArrowDownRight className="w-3.5 h-3.5" />
                                        KURANG
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic block">Jumlah Unit</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={adjustAmount === 0 ? "" : adjustAmount}
                                    onChange={(e) => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 0))}
                                    placeholder="0"
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic block">Keterangan / Alasan</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={adjustNote}
                                    onChange={(e) => setAdjustNote(e.target.value)}
                                    placeholder="Masukkan alasan penyesuaian..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#D25026] transition-colors leading-relaxed"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setIsAdjustModalOpen(false)}
                                    className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={adjustLoading}
                                    className="h-10 px-5 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5"
                                >
                                    {adjustLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATE MATERIAL DIALOG MOBILE */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-[90vw] max-w-[380px] p-6 border border-slate-100 shadow-2xl space-y-4 transform animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Tambah Bahan Baku</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-3">
                            <div className="flex flex-col items-center gap-2">
                                {createImagePreview ? (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border">
                                        <img src={createImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setCreateImage(null);
                                                setCreateImagePreview(null);
                                            }}
                                            className="absolute top-1 right-1 bg-red-550 text-white rounded-full p-0.5 border hover:bg-red-650"
                                        >
                                            <X className="w-3 h-3 text-red-500" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => createFileInputRef.current?.click()}
                                        className="w-full h-20 bg-slate-55/50 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-[#D25026] hover:text-[#D25026] transition-all cursor-pointer"
                                    >
                                        <ImagePlus className="w-5 h-5 text-slate-400" />
                                        <span className="text-[10px] font-bold">Pilih Gambar</span>
                                    </button>
                                )}
                                <input 
                                    type="file" 
                                    ref={createFileInputRef} 
                                    onChange={handleCreateImageChange}
                                    accept="image/*"
                                    className="hidden" 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nama Bahan</label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.nama}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, nama: e.target.value }))}
                                    placeholder="Dryfit Milano"
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Stok Awal</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={createForm.stok === 0 ? "" : createForm.stok}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, stok: Math.max(0, parseInt(e.target.value) || 0) }))}
                                        placeholder="0"
                                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Harga / unit</label>
                                    <input
                                        type="text"
                                        required
                                        value={formatThousands(createForm.harga)}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            setCreateForm(prev => ({ ...prev, harga: val === "" ? 0 : Number(val) }));
                                        }}
                                        placeholder="0"
                                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Spesifikasi</label>
                                <textarea
                                    rows={2}
                                    value={createForm.deskripsi}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                                    placeholder="Tuliskan detail spesifikasi bahan..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#D25026] transition-colors leading-relaxed"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="h-10 px-5 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5"
                                >
                                    {createLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Buat"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL MOBILE */}
            {selectedDetailItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-[90vw] max-w-[380px] p-6 border border-slate-100 shadow-2xl space-y-4 transform animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Detail Bahan</h3>
                            <button onClick={() => setSelectedDetailItem(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {selectedDetailItem.imageUrl ? (
                            <div className="w-full h-32 rounded-xl overflow-hidden border">
                                <img src={UPLOADS_URL + selectedDetailItem.imageUrl} alt={selectedDetailItem.nama} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-full h-20 bg-slate-50 rounded-xl border flex flex-col items-center justify-center text-slate-400 text-xs">
                                <ImageIcon className="w-5 h-5 opacity-30" />
                                <span className="text-[9px] font-black uppercase tracking-widest italic mt-1">Tidak ada foto</span>
                            </div>
                        )}

                        <div className="space-y-3 text-xs leading-normal">
                            <div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Nama Bahan</span>
                                <h4 className="text-base font-extrabold text-slate-900 leading-tight">{selectedDetailItem.nama}</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic block">Stok Gudang</span>
                                    <span className="font-extrabold text-[#D25026] text-sm mt-0.5 inline-block">{selectedDetailItem.stok} unit</span>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic block">Harga / unit</span>
                                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 inline-block">Rp {selectedDetailItem.harga?.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            {selectedDetailItem.deskripsi && (
                                <div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic block">Deskripsi Spesifikasi</span>
                                    <p className="text-slate-650 italic mt-0.5 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border leading-relaxed">{selectedDetailItem.deskripsi}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2 text-xs">
                            <button
                                onClick={() => setSelectedDetailItem(null)}
                                className="h-10 px-5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX PREVIEW IMAGE MOBILE */}
            <div className={cn(
                "fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300",
                previewImage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )} onClick={() => setPreviewImage(null)}>
                <button className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <div className={cn(
                    "relative max-w-full max-h-full transition-transform duration-300 scale-95 flex items-center justify-center",
                    previewImage && "scale-100"
                )} onClick={e => e.stopPropagation()}>
                    {previewImage && (
                        <img 
                            src={previewImage} 
                            alt="Full Preview" 
                            className="rounded-xl shadow-xl object-contain max-w-[95vw] max-h-[85vh]" 
                        />
                    )}
                </div>
            </div>

            {/* EDIT DIALOG MOBILE */}
            {isEditModalOpen && editItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-[90vw] max-w-[380px] p-6 border border-slate-100 shadow-2xl space-y-4 transform animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Ubah Bahan</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <div className="flex flex-col items-center gap-2">
                                {editImagePreview ? (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border">
                                        <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setEditImage(null);
                                                setEditImagePreview(null);
                                                setDeleteExistingImage(true);
                                            }}
                                            className="absolute top-1 right-1 bg-red-550 text-white rounded-full p-0.5 border hover:bg-red-650"
                                        >
                                            <X className="w-3 h-3 text-red-500" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="w-full h-20 bg-slate-55/50 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-[#D25026] hover:text-[#D25026] transition-all cursor-pointer"
                                    >
                                        <ImagePlus className="w-5 h-5 text-slate-400" />
                                        <span className="text-[10px] font-bold">Pilih Gambar</span>
                                    </button>
                                )}
                                <input 
                                    type="file" 
                                    ref={editFileInputRef} 
                                    onChange={handleEditImageChange}
                                    accept="image/*"
                                    className="hidden" 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nama Bahan</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.nama}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, nama: e.target.value }))}
                                    placeholder="Dryfit Milano"
                                    className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Stok Gudang</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={editForm.stok}
                                        className="w-full h-10 bg-slate-100 border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none cursor-not-allowed text-slate-500"
                                        disabled
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Harga / unit</label>
                                    <input
                                        type="text"
                                        required
                                        value={formatThousands(editForm.harga)}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            setEditForm(prev => ({ ...prev, harga: val === "" ? 0 : Number(val) }));
                                        }}
                                        placeholder="0"
                                        className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Spesifikasi</label>
                                <textarea
                                    rows={2}
                                    value={editForm.deskripsi}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                                    placeholder="Tuliskan detail spesifikasi bahan..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#D25026] transition-colors leading-relaxed"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="h-10 px-5 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5"
                                >
                                    {editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION DIALOG MOBILE */}
            {isDeleteModalOpen && deleteItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-[90vw] max-w-[380px] p-6 border border-slate-100 shadow-2xl space-y-4 transform animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-black uppercase tracking-tight text-red-650 flex items-center gap-1.5">
                                <AlertTriangle className="w-4.5 h-4.5 text-red-550" />
                                Hapus Bahan
                            </h3>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2 text-xs">
                            <p className="text-slate-650 leading-relaxed">
                                Apakah Anda yakin ingin menghapus <strong className="text-slate-900">{deleteItem.nama}</strong>?
                            </p>
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-750 leading-relaxed font-medium">
                                Aksi ini permanen. Riwayat log stok akan tetap disimpan namun nama bahan akan dicatat sebagai bahan terhapus.
                            </div>
                        </div>

                        <form onSubmit={handleDeleteSubmit} className="flex justify-end gap-2 pt-2 text-xs">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={deleteLoading}
                                className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5"
                            >
                                {deleteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Hapus"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
