import { useState, useEffect, useRef, useMemo } from "react";
import { orderService } from "~/services/orderService";
import { useAuth } from "~/hooks/useAuth";
import type { 
    ReturOrder, 
    DamageHistoryItem, 
    ReturBarangToast, 
    ReturBarangSortOption 
} from "~/types/returBarang";

export function useReturBarang() {
    const [orders, setOrders] = useState<ReturOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<ReturOrder | null>(null);
    const [toast, setToast] = useState<ReturBarangToast | null>(null);
    const { user } = useAuth();

    // Form Kerusakan
    const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | "">("");
    const [damagedPcs, setDamagedPcs] = useState<number | "">("");
    const [damageKeterangan, setDamageKeterangan] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Damage Histories & Edit
    const [damageHistories, setDamageHistories] = useState<DamageHistoryItem[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<DamageHistoryItem | null>(null);
    const [editDamagedPcs, setEditDamagedPcs] = useState<number | "">("");
    const [editDamageKeterangan, setEditDamageKeterangan] = useState("");

    // Search, Sort states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<ReturBarangSortOption>("newest");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Click outside handler for dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getOrders();
            const formattedOrders: ReturOrder[] = data.map((o: any) => ({
                id: o.orderId,
                rawId: o.id,
                customer: o.customerName,
                product: o.details.length > 0 ? o.details[0].productTitle : "Custom Jersey",
                qty: o.details.length,
                status: o.status,
                damagedPcs: o.damagedPcs || 0,
                date: new Date(o.createdAt).toISOString().split("T")[0],
                dateTime: new Date(o.createdAt).toLocaleString("id-ID", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric", 
                    hour: "2-digit", 
                    minute: "2-digit" 
                }),
                details: o.details
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDamageHistories = async (orderId: number) => {
        try {
            const data = await orderService.getDamageHistory(orderId);
            setDamageHistories(data);
        } catch (error) {
            console.error("Failed to fetch damage history:", error);
        }
    };

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

    const handleReportDamage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;
        
        const productId = selectedOrder.details.length > 0 ? selectedOrder.details[0].productId : null;
        if (!productId) {
            setToast({ title: "Pesanan tidak memiliki detail produk", variant: "destructive" });
            return;
        }

        if (!damagedPcs || Number(damagedPcs) <= 0) {
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
            
            setToast({ title: "Laporan kerusakan berhasil dicatat dan stok bahan telah dikurangi", variant: "success" });
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
            setToast({ title: "Laporan kerusakan berhasil diperbarui", variant: "success" });
            setIsEditModalOpen(false);
            fetchOrders();
            if (selectedOrder) fetchDamageHistories(selectedOrder.rawId);
        } catch (error: any) {
            console.error("Error update damage:", error);
            setToast({ title: error.response?.data?.error || "Gagal memperbarui laporan kerusakan", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (history: DamageHistoryItem) => {
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

    const filteredAndSortedOrders = useMemo(() => {
        return orders.filter(o => {
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
    }, [orders, searchQuery, sortBy]);

    return {
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        toast,
        setToast,
        user,
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
        setSelectedHistory,
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
    };
}
