import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Wrench, AlertCircle, ChevronLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { orderService } from "~/services/orderService";
import { useAuth } from "~/hooks/useAuth";
import { Toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function ReturBarangMobile() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const { user } = useAuth();

    // Form Kerusakan
    const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");
    const [damagedPcs, setDamagedPcs] = useState<number | "">("");
    const [damageKeterangan, setDamageKeterangan] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Damage Histories & Edit
    const [damageHistories, setDamageHistories] = useState<any[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
    const [editDamagedPcs, setEditDamagedPcs] = useState<number | "">("");
    const [editDamageKeterangan, setEditDamageKeterangan] = useState("");

    // Search, Sort states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            fetchDamageHistories(selectedOrder.rawId);
        } else {
            setDamageHistories([]);
        }
    }, [selectedOrder]);

    const fetchDamageHistories = async (orderId: number) => {
        try {
            const data = await orderService.getDamageHistory(orderId);
            setDamageHistories(data);
        } catch (error) {
            console.error("Failed to fetch damage history:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            const formattedOrders = data.map((o: any) => ({
                id: o.orderId,
                rawId: o.id,
                customer: o.customerName,
                product: o.details.length > 0 ? o.details[0].productTitle : "Custom Jersey",
                qty: o.details.length,
                status: o.status,
                damagedPcs: o.damagedPcs || 0,
                date: new Date(o.createdAt).toISOString().split('T')[0],
                details: o.details
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportDamage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        
        const productId = selectedOrder.details.length > 0 ? selectedOrder.details[0].productId : null;
        if (!productId) {
            setToast({ title: "Pesanan tidak memiliki detail produk", variant: "destructive" });
            return;
        }

        if (!damagedPcs || damagedPcs <= 0) {
            setToast({ title: "Jumlah pcs (valid) wajib diisi", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await orderService.reportDamage(selectedOrder.rawId, {
                productId: Number(productId),
                pcs: Number(damagedPcs),
                keterangan: damageKeterangan,
                actor: user ? ((user as any).staff?.nama || user.username) : "Admin"
            });
            
            const trackOrder = await orderService.trackOrder(selectedOrder.id);
            setOrders(prev => prev.map(o => o.rawId === selectedOrder.rawId ? { ...o, damagedPcs: trackOrder.damagedPcs } : o));
            setSelectedOrder({ ...selectedOrder, damagedPcs: trackOrder.damagedPcs });
            
            setToast({ title: "Laporan kerusakan dicatat", variant: "success" });
            setIsDamageModalOpen(false);
            setDamagedPcs("");
            setDamageKeterangan("");
        } catch (error: any) {
            console.error("Error report damage:", error);
            setToast({ title: error.response?.data?.error || "Gagal melaporkan kerusakan", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditDamage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedHistory || !editDamagedPcs) return;

        setIsSubmitting(true);
        try {
            await orderService.updateDamageReport(selectedHistory.id, {
                pcs: Number(editDamagedPcs),
                keterangan: editDamageKeterangan,
                actor: user ? ((user as any).staff?.nama || user.username) : "Admin"
            });
            setToast({ title: "Laporan kerusakan diperbarui", variant: "success" });
            setIsEditModalOpen(false);
            fetchOrders();
            if (selectedOrder) fetchDamageHistories(selectedOrder.rawId);
        } catch (error: any) {
            console.error("Error update damage:", error);
            setToast({ title: error.response?.data?.error || "Gagal memperbarui", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (history: any) => {
        setSelectedHistory(history);
        setEditDamagedPcs(history.pcs || 0);
        let cleanKet = history.keterangan || "";
        if (cleanKet.startsWith("Kerusakan menjahit - ")) {
            cleanKet = cleanKet.replace("Kerusakan menjahit - ", "");
        } else if (cleanKet === "Kerusakan menjahit") {
            cleanKet = "";
        }
        setEditDamageKeterangan(cleanKet);
        setIsEditModalOpen(true);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "SELESAI": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "FINISHING": return "bg-blue-50 text-blue-700 border-blue-200";
            case "PRINT": return "bg-cyan-50 text-cyan-700 border-cyan-200";
            case "LAYOUT": return "bg-amber-50 text-amber-700 border-amber-200";
            case "DESAIN": return "bg-purple-50 text-purple-700 border-purple-200";
            case "DITOLAK": return "bg-red-50 text-red-700 border-red-200";
            case "MENUNGGU": default: return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    const filteredAndSortedOrders = orders.filter(o => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            (o.id && o.id.toLowerCase().includes(query)) ||
            (o.customer && o.customer.toLowerCase().includes(query)) ||
            (o.product && o.product.toLowerCase().includes(query))
        );
    }).sort((a, b) => {
        if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === "damage-highest") return (b.damagedPcs || 0) - (a.damagedPcs || 0);
        return 0;
    });

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
                        <p className="text-xl font-black text-red-600">{orders.reduce((acc, o) => acc + (o.damagedPcs || 0), 0)} Pcs</p>
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
