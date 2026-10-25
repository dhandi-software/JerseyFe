import { AlertCircle, FileText, ChevronLeft, Search, ChevronDown, Wrench } from "lucide-react";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useReturBarang } from "~/hooks/useReturBarang";

export function ReturBarangDesktop() {
    const {
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        toast,
        setToast,
        isDamageModalOpen,
        setIsDamageModalOpen,
        selectedProductId,
        setSelectedProductId,
        damagedPcs,
        setDamagedPcs,
        damageKeterangan,
        setDamageKeterangan,
        isSubmitting,
        damageHistories,
        isEditModalOpen,
        setIsEditModalOpen,
        selectedHistory,
        editDamagedPcs,
        setEditDamagedPcs,
        editDamageKeterangan,
        setEditDamageKeterangan,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        showSortDropdown,
        setShowSortDropdown,
        sortDropdownRef,
        handleReportDamage,
        handleEditDamage,
        openEditModal,
        getStatusStyle,
        filteredAndSortedOrders,
    } = useReturBarang();


    // Detail View
    if (selectedOrder) {
        // Unique products in this order
        const uniqueProductsMap = new Map();
        selectedOrder.details.forEach((d: any) => {
            if (d.productId && d.productTitle) {
                uniqueProductsMap.set(d.productId, d.productTitle);
            }
        });
        const uniqueProducts = Array.from(uniqueProductsMap, ([id, title]) => ({ id, title }));

        return (
            <div className="min-h-screen bg-slate-50 font-geist">
                {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
                <div className="w-full px-8 py-10">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Monitoring Kerusakan
                    </button>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden ring-1 ring-black/5">
                        <div className="relative p-10 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase", getStatusStyle(selectedOrder.status))}>
                                        {selectedOrder.status}
                                    </span>
                                    <p className="text-sm font-bold text-slate-900 font-mono tracking-tighter bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                        {selectedOrder.id}
                                    </p>
                                </div>
                            </div>
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Detail Kerusakan Pesanan</h1>
                            <p className="text-slate-500 font-medium text-lg mt-2">{selectedOrder.product} - <span className="text-[#D25026]">{selectedOrder.customer}</span></p>
                            
                            <div className="mt-8 flex flex-wrap items-center gap-6 p-6 bg-red-50 rounded-2xl border border-red-100">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                                <div>
                                    <p className="text-sm font-black text-red-900 uppercase tracking-widest italic">Total Kerusakan / Retur (Pcs)</p>
                                    <p className="text-3xl font-black text-red-600">{selectedOrder.damagedPcs} Pcs</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50 space-y-12">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 ring-1 ring-black/5">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-black italic text-slate-900">Catat Kerusakan Barang</h3>
                                    <p className="text-sm text-slate-500 font-medium">Jika ada kesalahan potong/jahit, catat di sini agar stok bahan baju otomatis berkurang sesuai pcs.</p>
                                </div>
                                <Dialog open={isDamageModalOpen} onOpenChange={setIsDamageModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-[#D25026] text-white rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-xs hover:bg-[#B34320] active:scale-95 transition-all shadow-md shrink-0">
                                            + Input Kerusakan
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 bg-white">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Input Kerusakan</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleReportDamage} className="py-6 space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2 italic">Bahan yang Digunakan</label>
                                                <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-medium rounded-xl px-4 py-3 text-sm">
                                                    {uniqueProducts.map(p => p.title).join(", ")}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2 italic">Jumlah Rusak (Pcs) <span className="text-red-500">*</span></label>
                                                <Input 
                                                    required
                                                    type="number"
                                                    min="1"
                                                    value={damagedPcs}
                                                    onChange={(e) => setDamagedPcs(e.target.value ? Number(e.target.value) : "")}
                                                    placeholder="Contoh: 2"
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2 italic">Keterangan (Opsional)</label>
                                                <textarea
                                                    value={damageKeterangan}
                                                    onChange={(e) => setDamageKeterangan(e.target.value)}
                                                    placeholder="Contoh: Salah jahit bagian kerah"
                                                    rows={3}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D25026] resize-none"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3 mt-4">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => setIsDamageModalOpen(false)}
                                                    className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-6 py-3 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors"
                                                >
                                                    {isSubmitting ? "Memproses..." : "Simpan Kerusakan"}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {/* List of past damage reports */}
                            {damageHistories.length > 0 && (
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden ring-1 ring-black/5">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                                        <h3 className="text-lg font-black italic text-slate-900">Riwayat Laporan Kerusakan</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100 bg-white">
                                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Waktu</th>
                                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Bahan</th>
                                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic text-center">Rusak (Pcs)</th>
                                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Keterangan</th>
                                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {damageHistories.map(history => (
                                                    <tr key={history.id} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="text-sm font-bold text-slate-700">{new Date(history.createdAt).toLocaleDateString('id-ID')}</div>
                                                            <div className="text-xs font-medium text-slate-400">{new Date(history.createdAt).toLocaleTimeString('id-ID')}</div>
                                                        </td>
                                                        <td className="px-6 py-5 text-sm font-bold text-slate-700">{history.namaBahan}</td>
                                                        <td className="px-6 py-5 text-center text-sm font-black text-red-600">{history.pcs} Pcs</td>
                                                        <td className="px-6 py-5 text-sm font-medium text-slate-500 max-w-[250px] truncate">{history.keterangan || "-"}</td>
                                                        <td className="px-6 py-5 text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditModal(history)}
                                                                className="text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Edit Modal */}
                            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                <DialogContent className="sm:max-w-[500px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 bg-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Edit Laporan Kerusakan</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleEditDamage} className="py-6 space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 italic">Jumlah Rusak (Pcs) <span className="text-red-500">*</span></label>
                                            <Input 
                                                required
                                                type="number"
                                                min="1"
                                                value={editDamagedPcs}
                                                onChange={(e) => setEditDamagedPcs(e.target.value ? Number(e.target.value) : "")}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3"
                                            />
                                            <p className="text-xs text-slate-400 mt-2">Mengubah Pcs akan otomatis menyesuaikan kembali perhitungan stok bahan baku gudang.</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 italic">Keterangan (Opsional)</label>
                                            <textarea
                                                value={editDamageKeterangan}
                                                onChange={(e) => setEditDamageKeterangan(e.target.value)}
                                                rows={3}
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#D25026] resize-none"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 mt-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setIsEditModalOpen(false)}
                                                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-6 py-3 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors"
                                            >
                                                {isSubmitting ? "Memproses..." : "Simpan Perubahan"}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            <div className="w-full px-8 py-10">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 rounded-xl">
                                <Wrench className="text-red-600" size={24} />
                            </div>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Monitoring Kerusakan Barang</h1>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] italic">Catat Retur & Kerusakan per Pesanan Customer</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Total Pesanan Dipantau</p>
                        <p className="text-3xl font-black text-slate-900">{orders.length}</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 shadow-sm">
                        <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1 italic">Total Kerusakan Keseluruhan (Pcs)</p>
                        <p className="text-3xl font-black text-red-600">{orders.reduce((acc: number, o: any) => acc + (o.damagedPcs || 0), 0)} Pcs</p>
                    </div>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Cari ID Pesanan, Customer, Produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white border-slate-200 rounded-2xl w-full text-sm font-medium focus:ring-1 focus:ring-[#D25026]"
                        />
                    </div>
                    
                    <div ref={sortDropdownRef} className="flex items-center gap-3 w-full md:w-auto justify-end relative">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 italic whitespace-nowrap">Urutkan:</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center justify-between gap-4 bg-white border border-slate-200 px-5 py-3 rounded-2xl transition-all duration-200 min-w-[200px] text-left cursor-pointer shadow-sm text-xs font-black uppercase tracking-widest italic"
                            >
                                <span className="text-slate-700">
                                    {sortBy === "newest" && "Terbaru (Tanggal)"}
                                    {sortBy === "oldest" && "Terlama (Tanggal)"}
                                    {sortBy === "damage-highest" && "Kerusakan Terbanyak"}
                                </span>
                                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", showSortDropdown && "rotate-180")} />
                            </button>

                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-150 rounded-2xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                    {[
                                        { val: "newest", label: "Terbaru (Tanggal)" },
                                        { val: "oldest", label: "Terlama (Tanggal)" },
                                        { val: "damage-highest", label: "Kerusakan Terbanyak" }
                                    ].map((opt) => (
                                        <button
                                            key={opt.val}
                                            onClick={() => {
                                                setSortBy(opt.val);
                                                setShowSortDropdown(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest italic transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026] cursor-pointer border-none",
                                                sortBy === opt.val ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFAFA] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">ID Pesanan</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Customer</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Produk</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status Pesanan</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Kerusakan (Pcs)</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <div className="flex flex-col items-center gap-4">
                                                <span className="animate-spin w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#D25026]" />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic">Memuat data pesanan...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAndSortedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Pesanan tidak ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAndSortedOrders.map((order) => (
                                        <tr key={order.rawId} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5 font-bold text-slate-500 font-mono">
                                                {order.id}
                                                <div className="text-[10px] font-medium text-slate-400 mt-1">{order.date}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-black text-slate-900">{order.customer}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-bold text-slate-700">{order.product}</span>
                                                <span className="text-slate-400 font-medium text-xs ml-2">({order.qty} qty)</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase inline-block", getStatusStyle(order.status))}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-xs font-black italic inline-block",
                                                    order.damagedPcs > 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-slate-50 text-slate-500"
                                                )}>
                                                    {order.damagedPcs} Pcs
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    variant="ghost"
                                                    className="hover:bg-red-50 hover:text-red-600 text-slate-400 font-bold uppercase tracking-widest text-[10px] h-9"
                                                >
                                                    Detail & Lapor
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
