import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { 
  Plus, Edit, History, Package, Loader2, Image as ImageIcon, 
  ChevronUp, ChevronDown, ChevronsUpDown, X, Save, ImagePlus, Eye, 
  Search, AlertTriangle, Check, ArrowUpRight, ArrowDownRight, RefreshCw,
  Trash2
} from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";
import { useAuth } from "~/hooks/useAuth";

export function DashboardGudangDesktop() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"penyubliman" | "katalog" | "riwayat">("penyubliman");
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

    const [selectedDetailItem, setSelectedDetailItem] = useState<any | null>(null);

    // Edit states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        nama: "",
        deskripsi: "",
        kuantitasKg: 0,
        rasioKonversi: "" as string | number,
        harga: 0,
        status: "Tersedia",
    });
    const parsedEditRasio = parseFloat(String(editForm.rasioKonversi).replace(',', '.')) || 2.5;
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
            setToast({ title: "Gagal memuat data dari server", variant: "destructive" });
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
            const currentKuantitas = adjustItem.kuantitasKg || 0;
            const change = adjustAction === "TAMBAH" ? adjustAmount : -adjustAmount;
            const newKuantitas = Math.max(0, currentKuantitas + change);

            // API expects FormData
            const formData = new FormData();
            formData.append("nama", adjustItem.nama);
            formData.append("deskripsi", adjustItem.deskripsi || "");
            formData.append("kuantitasKg", newKuantitas.toString());
            formData.append("rasioKonversi", (adjustItem.rasioKonversi || 2.5).toString());
            formData.append("harga", (adjustItem.harga || 0).toString());
            formData.append("keterangan_ubah", adjustNote || (adjustAction === "TAMBAH" ? "Penambahan ketersediaan bahan" : "Pengurangan ketersediaan bahan"));
            formData.append("actor", (user as any)?.staff?.nama || (user as any)?.username || "Staf Gudang");

            const res = await adminApi.updateBahanBaju(adjustItem.id, formData);
            if (res.status === "success") {
                setToast({ title: `Berhasil menyesuaikan ketersediaan ${adjustItem.nama}`, variant: "success" });
                setIsAdjustModalOpen(false);
                fetchData();
            } else {
                setToast({ title: "Gagal menyimpan penyesuaian ketersediaan", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            setToast({ title: "Terjadi kesalahan sistem", variant: "destructive" });
        } finally {
            setAdjustLoading(false);
        }
    };



    // Edit material handlers
    const handleOpenEdit = (item: any) => {
        setEditItem(item);
        setEditForm({
            nama: item.nama,
            deskripsi: item.deskripsi || "",
            kuantitasKg: item.kuantitasKg || 0,
            rasioKonversi: item.rasioKonversi ? String(item.rasioKonversi).replace('.', ',') : "",
            harga: item.harga || 0,
            status: item.status || "Tersedia",
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
            formData.append("kuantitasKg", editForm.kuantitasKg.toString());
            formData.append("rasioKonversi", String(parsedEditRasio));
            formData.append("harga", editForm.harga.toString());
            formData.append("status", editForm.status);
            formData.append("actor", (user as any)?.staff?.nama || (user as any)?.username || "Staf Gudang");
            
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
            setToast({ title: "Terjadi kesalahan saat memperbarui bahan", variant: "destructive" });
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
            const res = await adminApi.deleteBahanBaju(deleteItem.id, (user as any)?.staff?.nama || (user as any)?.username || "Staf Gudang");
            if (res.status === "success") {
                setToast({ title: `Bahan ${deleteItem.nama} berhasil dihapus`, variant: "success" });
                setIsDeleteModalOpen(false);
                setDeleteItem(null);
                fetchData();
            } else {
                setToast({ title: "Gagal menghapus bahan", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            setToast({ title: "Terjadi kesalahan saat menghapus bahan", variant: "destructive" });
        } finally {
            setDeleteLoading(false);
        }
    };

    // Sorting states
    const [sortColumn, setSortColumn] = useState<"nama" | "kuantitasKg" | "harga" | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const toggleSort = (col: "nama" | "kuantitasKg" | "harga") => {
        if (sortColumn === col) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    // Filter materials
    const filteredBahan = bahanList.filter(item => {
        const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesStock = true;
        if (stockFilter === "low") {
            matchesStock = item.status === "Tersedia" && (item.kuantitasKg * (item.rasioKonversi || 2.5)) <= 20;
        } else if (stockFilter === "empty") {
            matchesStock = item.status === "Habis" || item.kuantitasKg <= 0;
        }

        return matchesSearch && matchesStock;
    });

    // Sort materials
    const sortedBahan = [...filteredBahan].sort((a, b) => {
        if (!sortColumn) return 0;
        
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (typeof valA === "string") {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // Filter history logs
    const filteredHistory = historyList.filter(log => {
        const namaBahan = log.namaBahan || log.bahan?.nama || "";
        const keterangan = log.keterangan || "";
        const query = logSearchQuery.toLowerCase();
        return namaBahan.toLowerCase().includes(query) || keterangan.toLowerCase().includes(query) || log.aksi.toLowerCase().includes(query);
    });

    // Overview Stats
    const totalMaterialsCount = bahanList.length;
    const totalKetersediaanKg = bahanList.reduce((sum, item) => sum + (item.kuantitasKg || 0), 0);
    const totalKetersediaanMeter = bahanList.reduce((sum, item) => sum + ((item.kuantitasKg || 0) * (item.rasioKonversi || 2.5)), 0);
    const lowStockCount = bahanList.filter(item => item.status === "Tersedia" && (item.kuantitasKg * (item.rasioKonversi || 2.5)) <= 20).length;
    const outOfStockCount = bahanList.filter(item => item.status === "Habis" || item.kuantitasKg <= 0).length;

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-['Inter'] p-8 relative">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                        Dashboard <span className="text-[#D25026]">Gudang</span>
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Manajemen persediaan bahan baku dan monitoring log fisik.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchData}
                        className="h-11 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                        title="Segarkan data"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button 
                        onClick={() => navigate("/gudang/bahan-baju/create")}
                        className="h-11 px-6 bg-[#D25026] hover:bg-[#B34320] text-slate-900 font-bold rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#D25026]/10"
                    >
                        <Plus className="w-4 h-4 text-slate-900" />
                        Tambah Bahan Baku
                    </button>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Materials */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-20 h-20 bg-slate-50 rounded-bl-[4rem] flex items-center justify-center">
                        <Package className="w-7 h-7 text-slate-400 opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Jenis Bahan</span>
                        <h3 className="text-slate-900 text-3xl font-black mt-2">{totalMaterialsCount}</h3>
                        <p className="text-slate-500 text-xs mt-2 italic">Jumlah variasi jenis bahan baku</p>
                    </div>
                </div>

                {/* Total Stock */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group col-span-1 md:col-span-2">
                    <div className="absolute right-0 top-0 w-20 h-20 bg-blue-50 rounded-bl-[4rem] flex items-center justify-center">
                        <Package className="w-7 h-7 text-blue-500 opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total Ketersediaan Bahan</span>
                        <h3 className="text-slate-900 text-2xl font-black mt-2 text-blue-600">
                            {totalKetersediaanKg.toFixed(1)} <span className="text-sm font-bold text-slate-400">kg</span>
                            <span className="text-slate-400 mx-2 text-lg">/</span>
                            {totalKetersediaanMeter.toFixed(1)} <span className="text-sm font-bold text-slate-400">meter</span>
                        </h3>
                        <p className="text-slate-500 text-xs mt-2 italic">Akumulasi seluruh bahan di gudang (berat & panjang)</p>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-20 h-20 bg-amber-50 rounded-bl-[4rem] flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-amber-500 opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Stok Menipis</span>
                        <h3 className="text-slate-900 text-3xl font-black mt-2 text-amber-500">{lowStockCount} <span className="text-sm font-bold text-slate-400">Bahan</span></h3>
                        <p className="text-slate-500 text-xs mt-2 italic">Bahan dengan stok di bawah 20 unit</p>
                    </div>
                </div>

                {/* Out of Stock Alert */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-20 h-20 bg-red-50 rounded-bl-[4rem] flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-red-500 opacity-60" />
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Stok Habis</span>
                        <h3 className="text-slate-900 text-3xl font-black mt-2 text-red-500">{outOfStockCount} <span className="text-sm font-bold text-slate-400">Bahan</span></h3>
                        <p className="text-slate-500 text-xs mt-2 italic">Bahan yang kehabisan persediaan</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
                <button 
                    onClick={() => setActiveTab("penyubliman")}
                    className={cn(
                        "pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2",
                        activeTab === "penyubliman" ? "text-[#D25026]" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Package className="w-4 h-4" />
                    Tahap Penyubliman
                    {activeTab === "penyubliman" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D25026] rounded-t-full" />
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab("katalog")}
                    className={cn(
                        "pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2",
                        activeTab === "katalog" ? "text-[#D25026]" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <Package className="w-4 h-4" />
                    Katalog Penjualan
                    {activeTab === "katalog" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D25026] rounded-t-full" />
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab("riwayat")}
                    className={cn(
                        "pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2",
                        activeTab === "riwayat" ? "text-[#D25026]" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <History className="w-4 h-4" />
                    Riwayat Log Aktivitas
                    {activeTab === "riwayat" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D25026] rounded-t-full" />
                    )}
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#D25026]" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">Memproses Data Gudang...</p>
                </div>
            ) : (
                <div className="w-full">
                    {/* TAHAP PENYUBLIMAN TAB */}
                    {activeTab === "penyubliman" && (
                        <div className="w-full space-y-6">
                            {/* Filters Bar */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex gap-2 w-full md:w-auto">
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            placeholder="Cari nama bahan baku..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#D25026] focus:ring-1 focus:ring-[#D25026] transition-colors w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto justify-center">
                                    {(["all", "low", "empty"] as const).map((filter) => {
                                        const labels = { all: "Semua", low: "Stok Tipis", empty: "Habis" };
                                        const counts = {
                                            all: bahanList.length,
                                            low: lowStockCount,
                                            empty: outOfStockCount
                                        };
                                        const isActive = stockFilter === filter;
                                        return (
                                            <button
                                                key={filter}
                                                onClick={() => setStockFilter(filter)}
                                                className={cn(
                                                    "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider italic transition-all",
                                                    isActive ? "bg-white text-[#D25026] shadow-sm" : "text-slate-400 hover:text-slate-700"
                                                )}
                                            >
                                                {labels[filter]} ({counts[filter]})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Materials Catalog Table */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden w-full">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[140px]">Gambar</th>
                                                <th 
                                                    className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic cursor-pointer hover:bg-slate-50/50 transition-colors w-[260px]"
                                                    onClick={() => toggleSort("nama")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Nama Bahan
                                                        <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[160px] cursor-pointer hover:bg-slate-50/50 transition-colors text-center"
                                                    onClick={() => toggleSort("kuantitasKg")}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        Ketersediaan
                                                        <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
                                                    </div>
                                                </th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[220px] text-center">Estimasi Hasil Produksi</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[160px]">Harga Beli</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[160px] text-center">Bukti Nota</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[320px]">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {sortedBahan.length > 0 ? (
                                                sortedBahan.map((item) => (
                                                    <tr key={`penyubliman-${item.id}`} className="hover:bg-slate-50/30 transition-colors group">
                                                        <td className="px-8 py-5 align-top">
                                                            {item.imageUrl ? (
                                                                <div 
                                                                    onClick={() => setPreviewImage(UPLOADS_URL + item.imageUrl)}
                                                                    className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 group-hover:scale-105 transition-all duration-300 cursor-zoom-in shadow-sm"
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
                                                                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                                                    <ImageIcon className="w-6 h-6 opacity-40" />
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="font-bold text-slate-800 text-sm mt-2">{item.nama}</div>
                                                            <span className="text-[10px] font-mono text-slate-400 block mt-1">ID Ref: #{item.id}</span>
                                                        </td>
                                                        <td className="px-8 py-5 align-top text-center">
                                                            <div className="flex flex-col items-center justify-center gap-1 mt-2">
                                                                <span className={cn(
                                                                    "inline-flex py-0.5 px-2 rounded-lg text-[10px] font-black border uppercase tracking-wider",
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
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="grid grid-cols-2 gap-1 w-full mt-2">
                                                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-blue-500 uppercase tracking-wide leading-none mb-0.5">Lengan Pendek S-2XL</div>
                                                                    <div className="text-[10.5px] font-black text-blue-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 0.8333))} pcs</div>
                                                                </div>
                                                                <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-blue-500 uppercase tracking-wide leading-none mb-0.5">Lengan Pendek 3XL+</div>
                                                                    <div className="text-[10.5px] font-black text-blue-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                </div>
                                                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-indigo-500 uppercase tracking-wide leading-none mb-0.5">Lengan Panjang S-2XL</div>
                                                                    <div className="text-[10.5px] font-black text-indigo-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                </div>
                                                                <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-indigo-500 uppercase tracking-wide leading-none mb-0.5">Lengan Panjang 3XL+</div>
                                                                    <div className="text-[10.5px] font-black text-indigo-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 2.5))} pcs</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="font-extrabold text-orange-600 text-sm mt-2">
                                                                Rp {new Intl.NumberFormat('id-ID').format(item.hargaBeli || 0)}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 align-top text-center">
                                                            {item.buktiNotaUrl ? (
                                                                <a 
                                                                    href={UPLOADS_URL + item.buktiNotaUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 mt-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-colors"
                                                                >
                                                                    Lihat Nota
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-slate-400 italic block mt-3">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <button 
                                                                    onClick={() => setSelectedDetailItem(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shadow-sm flex items-center justify-center"
                                                                    title="Lihat detail bahan"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Detail</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleOpenAdjust(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-[#FFF0EB] hover:bg-[#FFE0D5] text-[#D25026] border border-[#FFD9CD] transition-all flex items-center justify-center"
                                                                    title="Sesuaikan stok bahan"
                                                                >
                                                                    <Save className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Stok</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleOpenEdit(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all flex items-center justify-center"
                                                                    title="Edit bahan"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Edit</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleOpenDelete(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 transition-all flex items-center justify-center"
                                                                    title="Hapus bahan"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Hapus</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                                            <Package className="w-12 h-12 text-slate-200" />
                                                            <p className="text-sm font-bold italic uppercase tracking-wider">Tidak ada bahan baku yang cocok</p>
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

                    {/* KATALOG PENJUALAN TAB */}
                    {activeTab === "katalog" && (
                        <div className="w-full space-y-6">
                            {/* Filters Bar */}
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex gap-2 w-full md:w-auto">
                                    <div className="relative w-full md:w-80">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            placeholder="Cari nama bahan baku..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#D25026] focus:ring-1 focus:ring-[#D25026] transition-colors w-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto justify-center">
                                    {(["all", "low", "empty"] as const).map((filter) => {
                                        const labels = { all: "Semua", low: "Stok Tipis", empty: "Habis" };
                                        const counts = {
                                            all: bahanList.length,
                                            low: lowStockCount,
                                            empty: outOfStockCount
                                        };
                                        const isActive = stockFilter === filter;
                                        return (
                                            <button
                                                key={filter}
                                                onClick={() => setStockFilter(filter)}
                                                className={cn(
                                                    "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider italic transition-all",
                                                    isActive ? "bg-white text-[#D25026] shadow-sm" : "text-slate-400 hover:text-slate-700"
                                                )}
                                            >
                                                {labels[filter]} ({counts[filter]})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Materials Catalog Table */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden w-full">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[140px]">Gambar</th>
                                                <th 
                                                    className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic cursor-pointer hover:bg-slate-50/50 transition-colors w-[260px]"
                                                    onClick={() => toggleSort("nama")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Nama Bahan
                                                        <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
                                                    </div>
                                                </th>
                                                <th 
                                                    className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic cursor-pointer hover:bg-slate-50/50 transition-colors w-[160px]"
                                                    onClick={() => toggleSort("harga")}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Harga
                                                        <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
                                                    </div>
                                                </th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Deskripsi</th>
                                                <th 
                                                    className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[160px] cursor-pointer hover:bg-slate-50/50 transition-colors text-center"
                                                    onClick={() => toggleSort("kuantitasKg")}
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        Ketersediaan
                                                        <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />
                                                    </div>
                                                </th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[220px] text-center">Estimasi Hasil Jersey</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[320px]">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {sortedBahan.length > 0 ? (
                                                sortedBahan.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                                                        <td className="px-8 py-5 align-top">
                                                            {item.imageUrl ? (
                                                                <div 
                                                                    onClick={() => setPreviewImage(UPLOADS_URL + item.imageUrl)}
                                                                    className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 group-hover:scale-105 transition-all duration-300 cursor-zoom-in shadow-sm"
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
                                                                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                                                    <ImageIcon className="w-6 h-6 opacity-40" />
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="font-bold text-slate-800 text-sm mt-2">{item.nama}</div>
                                                            <span className="text-[10px] font-mono text-slate-400 block mt-1">ID Ref: #{item.id}</span>
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="font-extrabold text-[#D25026] text-sm mt-2">
                                                                Rp {new Intl.NumberFormat('id-ID').format(item.harga || 0)}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2 italic">
                                                                {item.deskripsi || "Tidak ada deskripsi"}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 align-top text-center">
                                                            <div className="flex flex-col items-center justify-center gap-1 mt-2">
                                                                <span className={cn(
                                                                    "inline-flex py-0.5 px-2 rounded-lg text-[10px] font-black border uppercase tracking-wider",
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
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="grid grid-cols-2 gap-1 w-full mt-2">
                                                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-blue-500 uppercase tracking-wide leading-none mb-0.5">Lengan Pendek S-2XL</div>
                                                                    <div className="text-[10.5px] font-black text-blue-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 0.8333))} pcs</div>
                                                                </div>
                                                                <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-blue-500 uppercase tracking-wide leading-none mb-0.5">Lengan Pendek 3XL+</div>
                                                                    <div className="text-[10.5px] font-black text-blue-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                </div>
                                                                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-indigo-500 uppercase tracking-wide leading-none mb-0.5">Lengan Panjang S-2XL</div>
                                                                    <div className="text-[10.5px] font-black text-indigo-700">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 1.25))} pcs</div>
                                                                </div>
                                                                <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-1 text-center">
                                                                    <div className="text-[7.5px] font-bold text-indigo-500 uppercase tracking-wide leading-none mb-0.5">Lengan Panjang 3XL+</div>
                                                                    <div className="text-[10.5px] font-black text-indigo-600">{Math.floor(item.kuantitasKg * ((item.rasioKonversi || 2.5) / 2.5))} pcs</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <button 
                                                                    onClick={() => setSelectedDetailItem(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all shadow-sm flex items-center justify-center"
                                                                    title="Lihat detail bahan"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Detail</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleOpenAdjust(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-[#FFF0EB] hover:bg-[#FFE0D5] text-[#D25026] border border-[#FFD9CD] transition-all flex items-center justify-center"
                                                                    title="Sesuaikan stok bahan"
                                                                >
                                                                    <Save className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Stok</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleOpenEdit(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all flex items-center justify-center"
                                                                    title="Edit bahan"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Edit</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleOpenDelete(item)}
                                                                    className="h-10 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 transition-all flex items-center justify-center"
                                                                    title="Hapus bahan"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Hapus</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                                            <Package className="w-12 h-12 text-slate-200" />
                                                            <p className="text-sm font-bold italic uppercase tracking-wider">Tidak ada bahan baku yang cocok</p>
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

                    {/* RIWAYAT LOG TAB */}
                    {activeTab === "riwayat" && (
                        <div className="w-full space-y-6">
                            {/* Search bar */}
                            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input 
                                        type="text"
                                        placeholder="Cari log berdasarkan bahan, jenis aksi, atau keterangan..."
                                        value={logSearchQuery}
                                        onChange={(e) => setLogSearchQuery(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#D25026] focus:ring-1 focus:ring-[#D25026] transition-colors w-full"
                                    />
                                </div>
                            </div>

                            {/* Logs list */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden w-full">
                                <div className="overflow-x-auto w-full">
                                    <table className="w-full text-left border-collapse min-w-[900px]">
                                        <thead className="bg-slate-50/50">
                                            <tr>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[200px]">Waktu Pencatatan</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[220px]">Nama Bahan</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[130px]">Jenis Aksi</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic w-[150px]">Aktor</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic text-center w-[120px]">Selisih</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic text-center w-[120px]">Stok Akhir</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Catatan Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredHistory.length > 0 ? (
                                                filteredHistory.map((hist) => (
                                                    <tr key={hist.id} className="hover:bg-slate-50/30 transition-colors">
                                                        <td className="px-8 py-5 whitespace-nowrap align-top">
                                                            <div className="text-xs font-bold text-slate-500 mt-1">
                                                                {new Date(hist.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="font-bold text-slate-900 text-sm">{hist.namaBahan || hist.bahan?.nama || "Bahan Terhapus"}</div>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase block mt-0.5">Ref ID: #{hist.bahanId || "Deleted"}</span>
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <span className={cn(
                                                                "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border mt-0.5",
                                                                hist.aksi === 'TAMBAH' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                                hist.aksi === 'KURANG' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                                                hist.aksi === 'BUAT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                                hist.aksi === 'HAPUS' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                'bg-slate-50 text-slate-600 border-slate-100'
                                                            )}>
                                                                {hist.aksi}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="text-xs font-bold text-slate-800 mt-1">{hist.actor || "System"}</div>
                                                        </td>
                                                        <td className="px-8 py-5 text-center align-top font-mono font-extrabold text-sm">
                                                            {hist.aksi === 'TAMBAH' ? <span className="text-emerald-600">+{hist.jumlah}</span> : 
                                                             hist.aksi === 'KURANG' ? <span className="text-orange-600">-{hist.jumlah}</span> : 
                                                             hist.aksi === 'HAPUS' ? <span className="text-red-600">-{hist.jumlah}</span> :
                                                             <span className="text-slate-400">{hist.jumlah}</span>}
                                                        </td>
                                                        <td className="px-8 py-5 text-center align-top font-black text-slate-900 text-sm">{hist.stokAkhir}</td>
                                                        <td className="px-8 py-5 align-top">
                                                            <div className="text-xs font-semibold text-slate-500 italic whitespace-pre-wrap mt-0.5 leading-relaxed">{hist.keterangan || "-"}</div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                                                            <History className="w-12 h-12 text-slate-200" />
                                                            <p className="text-sm font-bold italic uppercase tracking-wider">Log riwayat kosong atau tidak ditemukan</p>
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
                </div>
            )}

            {/* QUICK STOCK ADJUST MODAL */}
            {isAdjustModalOpen && adjustItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-[90vw] max-w-[450px] p-8 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Sesuaikan Stok Fisik</h3>
                            <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            {adjustItem.imageUrl ? (
                                <img src={UPLOADS_URL + adjustItem.imageUrl} alt={adjustItem.nama} className="w-12 h-12 rounded-xl object-cover border" />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-450"><Package className="w-5 h-5 text-slate-400" /></div>
                            )}
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 leading-tight">{adjustItem.nama}</h4>
                                <p className="text-xs font-semibold text-[#D25026] mt-0.5">Ketersediaan Saat Ini: {adjustItem.kuantitasKg || 0} kg (~ {((adjustItem.kuantitasKg || 0) * (adjustItem.rasioKonversi || 2.5)).toFixed(1)} meter)</p>
                            </div>
                        </div>

                        <form onSubmit={handleAdjustSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic block">Aksi Stok</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setAdjustAction("TAMBAH")}
                                        className={cn(
                                            "h-12 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all text-xs",
                                            adjustAction === "TAMBAH" 
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm ring-1 ring-emerald-500/10"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                        TAMBAH STOK
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAdjustAction("KURANG")}
                                        className={cn(
                                            "h-12 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all text-xs",
                                            adjustAction === "KURANG" 
                                                ? "bg-orange-50 border-orange-200 text-orange-700 shadow-sm ring-1 ring-orange-500/10"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <ArrowDownRight className="w-4 h-4" />
                                        KURANGI STOK
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Jumlah Selisih (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    required
                                    value={adjustAmount === 0 ? "" : adjustAmount}
                                    onChange={(e) => setAdjustAmount(Math.max(0.01, parseFloat(e.target.value) || 0))}
                                    placeholder="0.00"
                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                />
                                {adjustAmount > 0 && (
                                    <div className="text-[10px] text-slate-500 font-semibold space-y-0.5 mt-1 italic text-left">
                                        <p>Estimasi Penyesuaian Ketersediaan: <span className="text-[#D25026] font-bold">{(adjustAmount * (adjustItem.rasioKonversi || 2.5)).toFixed(1)} meter</span> bahan.</p>
                                        <p className="text-slate-400">Total Ketersediaan Baru:</p>
                                        <span className="text-slate-700 font-bold block">
                                            {Math.max(0, (adjustAction === "TAMBAH" ? (adjustItem.kuantitasKg || 0) + adjustAmount : (adjustItem.kuantitasKg || 0) - adjustAmount)).toFixed(2)} kg
                                            (~ {Math.max(0, (adjustAction === "TAMBAH" ? (adjustItem.kuantitasKg || 0) + adjustAmount : (adjustItem.kuantitasKg || 0) - adjustAmount) * (adjustItem.rasioKonversi || 2.5)).toFixed(1)} meter).
                                        </span>
                                        <p className="text-slate-400 mt-1">Estimasi Hasil Baru:</p>
                                        <div className="grid grid-cols-2 gap-1 mt-0.5">
                                            <span className="text-blue-600 font-bold block">• Lengan Pendek S-2XL: ~{Math.floor(Math.max(0, adjustAction === "TAMBAH" ? (adjustItem.kuantitasKg || 0) + adjustAmount : (adjustItem.kuantitasKg || 0) - adjustAmount) * ((adjustItem.rasioKonversi || 2.5) / 0.8333))} pcs</span>
                                            <span className="text-blue-500 font-bold block">• Lengan Pendek 3XL+: ~{Math.floor(Math.max(0, adjustAction === "TAMBAH" ? (adjustItem.kuantitasKg || 0) + adjustAmount : (adjustItem.kuantitasKg || 0) - adjustAmount) * ((adjustItem.rasioKonversi || 2.5) / 1.25))} pcs</span>
                                            <span className="text-indigo-600 font-bold block">• Lengan Panjang S-2XL: ~{Math.floor(Math.max(0, adjustAction === "TAMBAH" ? (adjustItem.kuantitasKg || 0) + adjustAmount : (adjustItem.kuantitasKg || 0) - adjustAmount) * ((adjustItem.rasioKonversi || 2.5) / 1.25))} pcs</span>
                                            <span className="text-indigo-500 font-bold block">• Lengan Panjang 3XL+: ~{Math.floor(Math.max(0, adjustAction === "TAMBAH" ? (adjustItem.kuantitasKg || 0) + adjustAmount : (adjustItem.kuantitasKg || 0) - adjustAmount) * ((adjustItem.rasioKonversi || 2.5) / 2.5))} pcs</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic block">Keterangan / Alasan</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={adjustNote}
                                    onChange={(e) => setAdjustNote(e.target.value)}
                                    placeholder="Contoh: Penambahan stok baru masuk / Penyesuaian jersey pesanan #1234"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#D25026] transition-colors leading-relaxed"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdjustModalOpen(false)}
                                    className="h-11 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={adjustLoading}
                                    className="h-11 px-6 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-[#D25026]/10 flex items-center gap-2"
                                >
                                    {adjustLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Stok"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedDetailItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] w-[90vw] max-w-[500px] p-8 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Rincian Spesifikasi Bahan</h3>
                            <button onClick={() => setSelectedDetailItem(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-12 gap-8">
                            {/* Left Column: Image */}
                            <div className="col-span-5">
                                {selectedDetailItem.imageUrl ? (
                                    <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                                        <img src={UPLOADS_URL + selectedDetailItem.imageUrl} alt={selectedDetailItem.nama} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[4/5] rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1.5 shadow-sm">
                                        <ImageIcon className="w-10 h-10 opacity-30" />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">Tidak ada foto</span>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Details */}
                            <div className="col-span-7 space-y-5">
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nama Bahan Baku</span>
                                    <h4 className="text-2xl font-extrabold text-slate-900 leading-tight">{selectedDetailItem.nama}</h4>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Ketersediaan</span>
                                        <span className="text-sm font-extrabold text-slate-800 mt-1 inline-block">
                                            {selectedDetailItem.kuantitasKg} kg <span className="text-xs font-normal text-slate-400">~ {(selectedDetailItem.kuantitasKg * (selectedDetailItem.rasioKonversi || 2.5)).toFixed(1)} m</span>
                                        </span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Harga Jual / unit</span>
                                        <span className="text-sm font-extrabold text-[#D25026] mt-1 inline-block">
                                            Rp {new Intl.NumberFormat('id-ID').format(selectedDetailItem.harga || 0)}
                                        </span>
                                    </div>
                                    
                                    {activeTab === "penyubliman" && (
                                        <>
                                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block flex justify-between items-center">
                                                    Bukti Nota 
                                                    {selectedDetailItem.buktiNotaUrl && (
                                                        <a 
                                                            href={UPLOADS_URL + selectedDetailItem.buktiNotaUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-[8px] font-bold bg-white text-blue-600 border border-blue-200 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition-colors"
                                                        >
                                                            Lihat
                                                        </a>
                                                    )}
                                                </span>
                                                {selectedDetailItem.buktiNotaUrl ? (
                                                    <div className="mt-2 w-full h-16 bg-white rounded-lg border border-blue-100 overflow-hidden flex items-center justify-center relative group">
                                                        {selectedDetailItem.buktiNotaUrl.endsWith('.pdf') ? (
                                                            <div className="text-blue-500 font-black text-xs">PDF</div>
                                                        ) : (
                                                            <img src={UPLOADS_URL + selectedDetailItem.buktiNotaUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Bukti Nota" />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-400 italic block mt-2">-</span>
                                                )}
                                            </div>
                                            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                                                <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block">Harga Modal (Beli)</span>
                                                <span className="text-sm font-extrabold text-orange-600 mt-1 inline-block">
                                                    Rp {new Intl.NumberFormat('id-ID').format(selectedDetailItem.hargaBeli || 0)}
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    <div className="col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Estimasi Hasil Jersey ({selectedDetailItem.rasioKonversi || 2.5} m)</span>
                                        <div className="text-xs text-slate-550 font-semibold space-y-1 mt-2">
                                            <p className="flex justify-between"><span>Lgn Pendek S-2XL:</span> <span className="text-blue-600 font-bold">~{Math.floor(selectedDetailItem.kuantitasKg * ((selectedDetailItem.rasioKonversi || 2.5) / 0.8333))} pcs</span></p>
                                            <p className="flex justify-between"><span>Lgn Pendek 3XL+:</span> <span className="text-blue-500 font-bold">~{Math.floor(selectedDetailItem.kuantitasKg * ((selectedDetailItem.rasioKonversi || 2.5) / 1.25))} pcs</span></p>
                                            <p className="flex justify-between"><span>Lgn Panjang S-2XL:</span> <span className="text-indigo-600 font-bold">~{Math.floor(selectedDetailItem.kuantitasKg * ((selectedDetailItem.rasioKonversi || 2.5) / 1.25))} pcs</span></p>
                                            <p className="flex justify-between"><span>Lgn Panjang 3XL+:</span> <span className="text-indigo-500 font-bold">~{Math.floor(selectedDetailItem.kuantitasKg * ((selectedDetailItem.rasioKonversi || 2.5) / 2.5))} pcs</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic block">Deskripsi Detail</span>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-1">
                                    <p className="text-xs text-slate-650 leading-relaxed italic whitespace-pre-wrap">{selectedDetailItem.deskripsi || "Tidak ada keterangan deskripsi."}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase">
                                <span>Terdaftar Pada:</span>
                                <span>{new Date(selectedDetailItem.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                            </div>
                        </div>
                    </div>

                        <div className="flex justify-end pt-3">
                            <button
                                onClick={() => setSelectedDetailItem(null)}
                                className="h-11 px-6 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                Tutup Rincian
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX FOR IMAGE PREVIEW */}
            <div className={cn(
                "fixed inset-0 z-[99999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-8 transition-all duration-300",
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
                            className="rounded-2xl shadow-2xl border border-white/20 object-contain max-w-[90vw] max-h-[90vh]" 
                        />
                    )}
                </div>
            </div>

            {/* EDIT MATERIAL MODAL */}
            {isEditModalOpen && editItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-[90vw] max-w-[500px] p-8 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Ubah Bahan Baku</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Upload image slot */}
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic align-self-start">Foto Bahan (Opsional)</span>
                                {editImagePreview ? (
                                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                                        <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setEditImage(null);
                                                setEditImagePreview(null);
                                                setDeleteExistingImage(true);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 border border-white hover:bg-red-600 transition-colors shadow-sm"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="w-full h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:bg-slate-100/50 hover:border-[#D25026] hover:text-[#D25026] transition-all cursor-pointer"
                                    >
                                        <ImagePlus className="w-7 h-7" />
                                        <span className="text-xs font-bold">Pilih / Drag Gambar Bahan</span>
                                        <span className="text-[9px] uppercase tracking-wider opacity-60">PNG, JPG, JPEG (Maks. 5MB)</span>
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

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic block">Nama Bahan</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.nama}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, nama: e.target.value }))}
                                    placeholder="Contoh: Dryfit Milano / Milano Premium"
                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ketersediaan (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={editForm.kuantitasKg}
                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none cursor-not-allowed text-slate-500 bg-slate-100"
                                        disabled
                                        title="Ketersediaan hanya dapat diubah melalui tombol 'Stok' di luar modal ini agar riwayat log tercatat dengan selisih yang sesuai."
                                    />
                                    {editForm.kuantitasKg > 0 && (
                                        <div className="text-[10px] text-slate-500 font-semibold space-y-1 mt-2 text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <p className="text-slate-700 font-bold">Estimasi Konversi: <span className="text-[#D25026] font-black">{(editForm.kuantitasKg * parsedEditRasio).toFixed(1)} meter</span> bahan <span className="text-[8px] font-normal text-slate-400">(1kg = {parsedEditRasio}m)</span>.</p>
                                            <p className="text-slate-455 text-[9px] font-black uppercase tracking-wider mt-1.5">Estimasi Hasil Jersey:</p>
                                            <div className="grid grid-cols-2 gap-3 mt-1 not-italic">
                                                <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50 space-y-1">
                                                    <p className="font-black text-blue-700 text-[8.5px] uppercase tracking-wide">Lengan Pendek</p>
                                                    <p className="text-slate-600 text-[8px] flex justify-between">
                                                        <span>Size S-2XL:</span>
                                                        <span className="font-bold text-blue-800">~{Math.floor(editForm.kuantitasKg * (parsedEditRasio / 0.8333))} pcs <span className="text-[7px] text-slate-400 font-normal">({Math.floor(parsedEditRasio / 0.8333)}/kg)</span></span>
                                                    </p>
                                                    <p className="text-slate-600 text-[8px] flex justify-between">
                                                        <span>Size 3XL-4XL:</span>
                                                        <span className="font-bold text-blue-800">~{Math.floor(editForm.kuantitasKg * (parsedEditRasio / 1.25))} pcs <span className="text-[7px] text-slate-400 font-normal">({Math.floor(parsedEditRasio / 1.25)}/kg)</span></span>
                                                    </p>
                                                </div>
                                                <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/50 space-y-1">
                                                    <p className="font-black text-indigo-700 text-[8.5px] uppercase tracking-wide">Lengan Panjang</p>
                                                    <p className="text-slate-600 text-[8px] flex justify-between">
                                                        <span>Size S-2XL:</span>
                                                        <span className="font-bold text-indigo-800">~{Math.floor(editForm.kuantitasKg * (parsedEditRasio / 1.25))} pcs <span className="text-[7px] text-slate-400 font-normal">({Math.floor(parsedEditRasio / 1.25)}/kg)</span></span>
                                                    </p>
                                                    <p className="text-slate-600 text-[8px] flex justify-between">
                                                        <span>Size 3XL-4XL:</span>
                                                        <span className="font-bold text-indigo-800">~{Math.floor(editForm.kuantitasKg * (parsedEditRasio / 2.5))} pcs <span className="text-[7px] text-slate-400 font-normal">({Math.floor(parsedEditRasio / 2.5)}/kg)</span></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Harga Jual / unit (Rp)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formatThousands(editForm.harga)}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            setEditForm(prev => ({ ...prev, harga: val === "" ? 0 : Number(val) }));
                                        }}
                                        placeholder="0"
                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rasio Konversi ({editForm.kuantitasKg || "0"} kg = {String((editForm.kuantitasKg * parsedEditRasio).toFixed(1)).replace('.', ',')} meter)</label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.rasioKonversi}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, rasioKonversi: e.target.value.replace(/[^0-9,.]/g, "") }))}
                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</label>
                                    <select 
                                        required
                                        value={editForm.status}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-[#D25026] transition-colors"
                                    >
                                        <option value="Tersedia">Tersedia</option>
                                        <option value="Habis">Habis</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic block">Deskripsi Spesifikasi</label>
                                <textarea
                                    rows={3}
                                    value={editForm.deskripsi}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, deskripsi: e.target.value }))}
                                    placeholder="Tuliskan spesifikasi ketebalan serat kain, peruntukan jenis jersey, dll..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#D25026] transition-colors leading-relaxed"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="h-11 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="h-11 px-6 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-[#D25026]/10 flex items-center gap-2"
                                >
                                    {editLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && deleteItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-[90vw] max-w-[450px] p-8 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-tight text-red-650 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Hapus Bahan Baku
                            </h3>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Apakah Anda yakin ingin menghapus bahan baku <strong className="text-slate-900">{deleteItem.nama}</strong> secara permanen?
                            </p>
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-750 leading-relaxed font-medium">
                                Tindakan ini tidak dapat dibatalkan. Riwayat stok akan tetap disimpan namun nama bahan akan dicatat sebagai bahan terhapus.
                            </div>
                        </div>

                        <form onSubmit={handleDeleteSubmit} className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="h-11 px-5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-semibold transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={deleteLoading}
                                className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-red-600/10 flex items-center gap-2"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        Menghapus...
                                    </>
                                ) : (
                                    "Hapus Permanen"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
