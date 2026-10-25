import { Search, ChevronDown, Wrench, AlertCircle, ChevronLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useReturBarang } from "~/hooks/useReturBarang";

export function ReturBarangMobile() {
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
        handleReportDamage,
        handleEditDamage,
        openEditModal,
        getStatusStyle,
        filteredAndSortedOrders,
    } = useReturBarang();


    if (selectedOrder) {
        const uniqueProductsMap = new Map();
        selectedOrder.details.forEach((d: any) => {
            if (d.productId && d.productTitle) {
                uniqueProductsMap.set(d.productId, d.productTitle);
            }
        });
        const uniqueProducts = Array.from(uniqueProductsMap, ([id, title]) => ({ id, title }));

        return (
            <div className="min-h-screen bg-slate-50 font-geist pb-24">
                {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
                
                <div className="bg-white px-6 py-6 border-b border-slate-200 sticky top-0 z-20 shadow-sm flex items-center gap-3">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 uppercase tracking-widest">Detail Kerusakan</h1>
                        <p className="text-[11px] font-medium text-slate-500 mt-1">{selectedOrder.id}</p>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase", getStatusStyle(selectedOrder.status))}>
                                {selectedOrder.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xl font-black italic uppercase tracking-tighter text-slate-900">{selectedOrder.product}</p>
                            <p className="text-sm text-slate-500 font-medium">{selectedOrder.customer}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-red-900 uppercase tracking-widest italic">Total Kerusakan / Retur</p>
                                <p className="text-2xl font-black text-red-600">{selectedOrder.damagedPcs} Pcs</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-sm font-black italic text-slate-900 uppercase tracking-widest">Catat Kerusakan Barang</h3>
                            <p className="text-[10px] text-slate-500 font-medium mt-1">Jika ada kesalahan potong/jahit, catat di sini agar stok bahan otomatis berkurang.</p>
                        </div>
                        
                        <Dialog open={isDamageModalOpen} onOpenChange={setIsDamageModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-[#D25026] text-white rounded-xl h-12 font-black uppercase tracking-widest text-[10px] hover:bg-[#B34320] active:scale-95 transition-all shadow-sm">
                                    + Input Kerusakan
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[90vw] max-w-[400px] rounded-3xl p-6 font-geist">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Input Kerusakan</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleReportDamage} className="py-4 space-y-5">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 italic">Bahan yang Digunakan</label>
                                        <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-medium rounded-xl px-3 py-2.5 text-sm">
                                            {uniqueProducts.map(p => p.title).join(", ")}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 italic">Jumlah Rusak (Pcs) <span className="text-red-500">*</span></label>
                                        <Input 
                                            required
                                            type="number"
                                            min="1"
                                            value={damagedPcs}
                                            onChange={(e) => setDamagedPcs(e.target.value ? Number(e.target.value) : "")}
                                            placeholder="Contoh: 2"
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 italic">Keterangan (Opsional)</label>
                                        <textarea
                                            value={damageKeterangan}
                                            onChange={(e) => setDamageKeterangan(e.target.value)}
                                            placeholder="Contoh: Salah jahit kerah"
                                            rows={3}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#D25026] resize-none"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsDamageModalOpen(false)}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-[10px] h-10 uppercase tracking-widest"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-4 py-2 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] text-[10px] h-10 uppercase tracking-widest"
                                        >
                                            {isSubmitting ? "Proses..." : "Simpan"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* List of past damage reports */}
                    {damageHistories.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="text-xs font-black italic text-slate-900 uppercase tracking-widest">Riwayat Laporan</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {damageHistories.map(history => (
                                    <div key={history.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">{history.namaBahan}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(history.createdAt).toLocaleDateString('id-ID')} - {new Date(history.createdAt).toLocaleTimeString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-red-600">{history.pcs} Pcs</p>
                                            </div>
                                        </div>
                                        {history.keterangan && (
                                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                <p className="text-[10px] text-slate-600 font-medium line-clamp-2">{history.keterangan}</p>
                                            </div>
                                        )}
                                        <div className="flex justify-end pt-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(history)}
                                                className="h-7 text-[10px] font-bold rounded-lg border-slate-200 hover:bg-slate-100 uppercase tracking-widest px-3"
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="w-[90vw] max-w-[400px] rounded-3xl p-6 font-geist">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Edit Kerusakan</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditDamage} className="py-4 space-y-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 italic">Jumlah Rusak (Pcs) <span className="text-red-500">*</span></label>
                                    <Input 
                                        required
                                        type="number"
                                        min="1"
                                        value={editDamagedPcs}
                                        onChange={(e) => setEditDamagedPcs(e.target.value ? Number(e.target.value) : "")}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5 italic">Keterangan (Opsional)</label>
                                    <textarea
                                        value={editDamageKeterangan}
                                        onChange={(e) => setEditDamageKeterangan(e.target.value)}
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#D25026] resize-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-[10px] h-10 uppercase tracking-widest"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] text-[10px] h-10 uppercase tracking-widest"
                                    >
                                        {isSubmitting ? "Proses..." : "Simpan"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-24">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            <div className="bg-white px-6 py-6 border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-1.5 bg-red-100 rounded-lg">
                        <Wrench className="text-red-600 w-4 h-4" />
                    </div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Retur & Kerusakan</h1>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic ml-9">Pantau Kerusakan Pesanan</p>
            </div>

            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Pesanan</p>
                        <p className="text-xl font-black text-slate-900">{orders.length}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-center">
                        <p className="text-[9px] font-black text-red-800 uppercase tracking-widest mb-1 italic">Total Rusak</p>
                        <p className="text-xl font-black text-red-600">{orders.reduce((acc: number, o: any) => acc + (o.damagedPcs || 0), 0)} Pcs</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Cari pesanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-3 bg-white border-slate-200 rounded-xl w-full text-xs font-medium focus:ring-1 focus:ring-[#D25026] h-11"
                    />
                </div>

                <div className="flex gap-2 pb-1 overflow-x-auto custom-scrollbar">
                    {[
                        { val: "newest", label: "Terbaru" },
                        { val: "oldest", label: "Terlama" },
                        { val: "damage-highest", label: "Rusak Terbanyak" }
                    ].map(opt => (
                        <button
                            key={opt.val}
                            onClick={() => setSortBy(opt.val)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic whitespace-nowrap transition-colors border",
                                sortBy === opt.val 
                                    ? "bg-[#FFF0EB] text-[#D25026] border-[#D25026]/20" 
                                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-white rounded-2xl border border-slate-200">
                            <span className="animate-spin w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#D25026]" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-400">Memuat data...</span>
                        </div>
                    ) : filteredAndSortedOrders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-2 bg-white rounded-2xl border border-slate-200">
                            <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-400">Tidak ada pesanan</span>
                        </div>
                    ) : (
                        filteredAndSortedOrders.map((order) => (
                            <div key={order.rawId} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-black text-slate-900 font-mono tracking-tighter">{order.id}</div>
                                        <div className="text-[10px] font-medium text-slate-400 mt-0.5">{order.date}</div>
                                    </div>
                                    <span className={cn("px-2 py-1 rounded-md text-[9px] font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                                        {order.status}
                                    </span>
                                </div>
                                
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Customer</p>
                                    <p className="text-sm font-bold text-slate-900">{order.customer}</p>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Produk</p>
                                        <p className="text-xs font-bold text-slate-700">{order.product} <span className="font-medium text-slate-400">({order.qty})</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-0.5 italic">Rusak/Retur</p>
                                        <p className={cn("text-sm font-black italic", order.damagedPcs > 0 ? "text-red-600" : "text-slate-500")}>{order.damagedPcs} Pcs</p>
                                    </div>
                                </div>

                                <Button 
                                    onClick={() => setSelectedOrder(order)}
                                    className="w-full bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 font-black uppercase tracking-widest text-[10px] h-10 rounded-xl"
                                >
                                    Detail & Lapor
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
