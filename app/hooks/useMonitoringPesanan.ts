import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { orderService } from "~/services/orderService";
import { chatService } from "~/services/chatService";
import { adminApi } from "~/api/admin";
import { generateInvoicePDF } from "~/lib/pdfHelper";
import { formatOrderData } from "~/features/admin/monitoring-pesanan/utils";
import type { 
    MonitoringOrder, 
    DesignerItem, 
    BahanItem, 
    ToastState, 
    MonitoringFilterTab, 
    MonitoringSortOption 
} from "~/types";

export function useMonitoringPesanan() {
    const [orders, setOrders] = useState<MonitoringOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<MonitoringOrder | null>(null);
    const [designers, setDesigners] = useState<DesignerItem[]>([]);
    const [bahanList, setBahanList] = useState<BahanItem[]>([]);
    const [toast, setToast] = useState<ToastState | null>(null);

    // Filter, search, and sort states
    const [filterTab, setFilterTab] = useState<MonitoringFilterTab>("MENUNGGU");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<MonitoringSortOption>("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const itemsPerPage = 10;
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Expandable member rows and sub-searches
    const [expandedOrderRowId, setExpandedOrderRowId] = useState<number | null>(null);
    const [subSearchQueries, setSubSearchQueries] = useState<Record<number, string>>({});
    const [debouncedSubSearchQueries, setDebouncedSubSearchQueries] = useState<Record<number, string>>({});

    // Modal and action states
    const [isPrinting, setIsPrinting] = useState(false);
    const [isUploadingProof, setIsUploadingProof] = useState(false);
    const [isUploadingPrint, setIsUploadingPrint] = useState(false);
    const [isUploadingFinishing, setIsUploadingFinishing] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDesignerId, setSelectedDesignerId] = useState<number | "">("");
    const [orderToAssign, setOrderToAssign] = useState<number | null>(null);
    const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
    const [tempRecommendedIds, setTempRecommendedIds] = useState<number[]>([]);

    const proofInputRef = useRef<HTMLInputElement>(null);
    const printInputRef = useRef<HTMLInputElement>(null);
    const finishingInputRef = useRef<HTMLInputElement>(null);

    // Reset pagination when search, sort, or tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, filterTab]);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync recommendation IDs when selectedOrder changes
    useEffect(() => {
        if (selectedOrder) {
            setTempRecommendedIds(selectedOrder.recommendedBahanIds || []);
        }
    }, [selectedOrder]);

    // Debounce sub-search inputs (200ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSubSearchQueries(subSearchQueries);
        }, 200);
        return () => clearTimeout(handler);
    }, [subSearchQueries]);

    // Fetch orders from API with optional search query
    const fetchOrders = useCallback(async (query?: string) => {
        try {
            setLoading(true);
            const data = await orderService.getOrders(query && query.trim() ? { search: query.trim() } : undefined);
            setOrders(formatOrderData(data));
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce main search (350ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            fetchOrders(searchQuery);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchOrders]);

    // Fetch initial metadata: designers and fabrics
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [designersRes, bahanRes] = await Promise.all([
                    adminApi.getDesigners(),
                    adminApi.getBahanBaju()
                ]);
                if (designersRes?.data) setDesigners(designersRes.data);
                if (bahanRes?.status === "success") setBahanList(bahanRes.data);
            } catch (error) {
                console.error("Error fetching initial metadata:", error);
            }
        };

        fetchInitialData();
    }, []);

    // Auto-expand row when search matches member name or number
    useEffect(() => {
        const q = debouncedSearchQuery.toLowerCase().trim();
        if (q) {
            const matched = orders.find(o =>
                (o.details || []).some((d: any) =>
                    d.playerName?.toLowerCase().includes(q) ||
                    d.playerNumber?.toString().toLowerCase().includes(q)
                )
            );
            if (matched) {
                setExpandedOrderRowId(matched.rawId);
            }
        }
    }, [debouncedSearchQuery, orders]);

    // Filter and sort orders
    const filteredAndSortedOrders = useMemo(() => {
        return orders.filter(o => {
            if (filterTab !== "ALL") {
                const status = (o.status || "").toUpperCase();
                if (filterTab === "MENUNGGU" && status !== "MENUNGGU" && status !== "MENUNGGU VERIFIKASI") {
                    return false;
                } else if (filterTab !== "MENUNGGU" && status !== filterTab) {
                    return false;
                }
            }

            const query = searchQuery.toLowerCase().trim();
            if (!query) return true;

            const matchId = o.id && o.id.toLowerCase().includes(query);
            const matchCustomer = o.customer && o.customer.toLowerCase().includes(query);
            const matchProduct = o.product && o.product.toLowerCase().includes(query);
            const matchMember = (o.details || []).some((d: any) => 
                (d.playerName && d.playerName.toLowerCase().includes(query)) ||
                (d.playerNumber && d.playerNumber.toString().toLowerCase().includes(query)) ||
                (d.playerSize && d.playerSize.toLowerCase().includes(query))
            );
            return matchId || matchCustomer || matchProduct || matchMember;
        }).sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
            if (sortBy === "oldest") {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            if (sortBy === "name-asc") {
                return (a.customer || "").localeCompare(b.customer || "");
            }
            if (sortBy === "name-desc") {
                return (b.customer || "").localeCompare(a.customer || "");
            }
            if (sortBy === "price-highest") {
                return (b.totalAmount || 0) - (a.totalAmount || 0);
            }
            if (sortBy === "price-lowest") {
                return (a.totalAmount || 0) - (b.totalAmount || 0);
            }
            if (sortBy === "qty-highest") {
                return (b.qty || 0) - (a.qty || 0);
            }
            if (sortBy === "qty-lowest") {
                return (a.qty || 0) - (b.qty || 0);
            }
            return 0;
        });
    }, [orders, filterTab, searchQuery, sortBy]);

    // Pagination calculations
    const totalItems = filteredAndSortedOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedOrders = useMemo(() => {
        return filteredAndSortedOrders.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

    const getPageNumbers = useCallback(() => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "ellipsis", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
            }
        }
        return pages;
    }, [totalPages, currentPage]);

    // Quick stats counts
    const stats = useMemo(() => ({
        total: orders.length,
        menunggu: orders.filter(o => o.status === "MENUNGGU" || o.status === "MENUNGGU VERIFIKASI").length,
        desain: orders.filter(o => o.status === "DESAIN").length,
        produksi: orders.filter(o => ["LAYOUT", "PRINT", "FINISHING"].includes(o.status)).length,
        selesai: orders.filter(o => o.status === "SELESAI").length
    }), [orders]);

    // Action: Print Invoice
    const handlePrintInvoice = async () => {
        if (!selectedOrder) return;
        setIsPrinting(true);
        try {
            await generateInvoicePDF(selectedOrder);
        } catch (error) {
            console.error("Failed to generate PDF", error);
            setToast({ title: "Gagal mencetak invoice", variant: "destructive" });
        } finally {
            setIsPrinting(false);
        }
    };

    // Action: Upload payment proof
    const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedOrder) return;
        
        setIsUploadingProof(true);
        try {
            const res = await chatService.uploadFile(file);
            const newPaymentUrl = res.url;
            await orderService.updatePaymentUrl(selectedOrder.rawId, newPaymentUrl);
            
            setToast({ title: "Bukti pembayaran berhasil diunggah!", variant: "success" });
            setSelectedOrder({ ...selectedOrder, paymentProofUrl: newPaymentUrl });
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, paymentProofUrl: newPaymentUrl } : o));
        } catch (error) {
            console.error("Gagal mengunggah bukti pembayaran", error);
            setToast({ title: "Gagal mengunggah bukti pembayaran", variant: "destructive" });
        } finally {
            setIsUploadingProof(false);
            if (proofInputRef.current) proofInputRef.current.value = "";
        }
    };

    // Action: Upload print progress photo
    const handleUploadPrint = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedOrder) return;
        
        setIsUploadingPrint(true);
        try {
            const res = await orderService.uploadPrint(selectedOrder.rawId, file);
            setToast({ title: "Foto progres Print berhasil diunggah!", variant: "success" });
            setSelectedOrder({ ...selectedOrder, printUrl: res.printUrl });
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, printUrl: res.printUrl } : o));
        } catch (error) {
            console.error("Gagal mengunggah foto Print", error);
            setToast({ title: "Gagal mengunggah foto Print", variant: "destructive" });
        } finally {
            setIsUploadingPrint(false);
            if (printInputRef.current) printInputRef.current.value = "";
        }
    };

    // Action: Upload finishing progress photo
    const handleUploadFinishing = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedOrder) return;
        
        setIsUploadingFinishing(true);
        try {
            const res = await orderService.uploadFinishing(selectedOrder.rawId, file);
            setToast({ title: "Foto progres Finishing berhasil diunggah!", variant: "success" });
            setSelectedOrder({ ...selectedOrder, finishingUrl: res.finishingUrl });
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, finishingUrl: res.finishingUrl } : o));
        } catch (error) {
            console.error("Gagal mengunggah foto Finishing", error);
            setToast({ title: "Gagal mengunggah foto Finishing", variant: "destructive" });
        } finally {
            setIsUploadingFinishing(false);
            if (finishingInputRef.current) finishingInputRef.current.value = "";
        }
    };

    // Action: Update status (with optional designer assignment)
    const handleUpdateStatus = async (id: number, newStatus: string, designerId?: number) => {
        try {
            await orderService.updateOrderStatus(id, newStatus, designerId);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, status: newStatus } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder(prev => prev ? ({ ...prev, status: newStatus }) : null);
            }
            
            if (newStatus === "DESAIN") {
                setToast({ title: "Pesanan berhasil diserahkan ke tim desain", variant: "success" });
            } else {
                setToast({ title: `Status pesanan diperbarui ke ${newStatus}`, variant: "success" });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setToast({ title: "Gagal memperbarui status", variant: "destructive" });
        }
    };

    // Action: Design approval / revision
    const handleApproveDesign = async (id: number) => {
        try {
            await orderService.approveDesign(id);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, designStatus: "APPROVED" } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder(prev => prev ? ({ ...prev, designStatus: "APPROVED" }) : null);
            }
            setToast({ title: "Desain berhasil disetujui", variant: "success" });
        } catch (error) {
            console.error("Error approving design:", error);
            setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
        }
    };

    const handleRevisiDesign = async (id: number, feedback: string) => {
        try {
            await orderService.revisiDesign(id, feedback);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, designStatus: "REVISI", designFeedback: feedback } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder(prev => prev ? ({ ...prev, designStatus: "REVISI", designFeedback: feedback }) : null);
            }
            setToast({ title: "Revisi desain berhasil dikirim", variant: "success" });
        } catch (error) {
            console.error("Error requesting revision:", error);
            setToast({ title: "Gagal mengirim revisi", variant: "destructive" });
        }
    };

    // Action: Layout approval / revision
    const handleApproveLayout = async (id: number) => {
        try {
            await orderService.approveLayout(id);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, layoutStatus: "APPROVED" } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder(prev => prev ? ({ ...prev, layoutStatus: "APPROVED" }) : null);
            }
            setToast({ title: "Layout berhasil disetujui", variant: "success" });
        } catch (error) {
            console.error("Error approving layout:", error);
            setToast({ title: "Gagal menyetujui layout", variant: "destructive" });
        }
    };

    const handleRevisiLayout = async (id: number, feedback: string) => {
        try {
            await orderService.revisiLayout(id, feedback);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, layoutStatus: "REVISI", layoutFeedback: feedback } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder(prev => prev ? ({ ...prev, layoutStatus: "REVISI", layoutFeedback: feedback }) : null);
            }
            setToast({ title: "Revisi layout berhasil dikirim", variant: "success" });
        } catch (error) {
            console.error("Error requesting revision:", error);
            setToast({ title: "Gagal mengirim revisi", variant: "destructive" });
        }
    };

    // Action: Send fabric recommendations
    const handleSendRecommendations = async () => {
        if (!selectedOrder) return;
        try {
            await orderService.recommendAlternatives(selectedOrder.rawId, tempRecommendedIds);
            setOrders(prev => prev.map(o => o.rawId === selectedOrder.rawId ? { ...o, recommendedBahanIds: tempRecommendedIds } : o));
            setSelectedOrder(prev => prev ? ({ ...prev, recommendedBahanIds: tempRecommendedIds }) : null);
            setIsRecommendModalOpen(false);
            setToast({ title: "Rekomendasi bahan alternatif berhasil dikirim", variant: "success" });
        } catch (error) {
            console.error("Error sending recommendations:", error);
            setToast({ title: "Gagal mengirim rekomendasi", variant: "destructive" });
        }
    };

    const setSubSearch = (orderId: number, query: string) => {
        setSubSearchQueries(prev => ({ ...prev, [orderId]: query }));
    };

    return {
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        designers,
        bahanList,
        toast,
        setToast,

        // Filters and pagination
        filterTab,
        setFilterTab,
        searchQuery,
        setSearchQuery,
        debouncedSearchQuery,
        sortBy,
        setSortBy,
        showSortDropdown,
        setShowSortDropdown,
        sortDropdownRef,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        paginatedOrders,
        getPageNumbers,
        stats,

        // Member expandable sub-row
        expandedOrderRowId,
        setExpandedOrderRowId,
        subSearchQueries,
        debouncedSubSearchQueries,
        setSubSearch,

        // Upload refs
        proofInputRef,
        printInputRef,
        finishingInputRef,
        isPrinting,
        isUploadingProof,
        isUploadingPrint,
        isUploadingFinishing,

        // Modals
        isAssignModalOpen,
        setIsAssignModalOpen,
        selectedDesignerId,
        setSelectedDesignerId,
        orderToAssign,
        setOrderToAssign,
        isRecommendModalOpen,
        setIsRecommendModalOpen,
        tempRecommendedIds,
        setTempRecommendedIds,

        // Handlers
        handlePrintInvoice,
        handleUploadProof,
        handleUploadPrint,
        handleUploadFinishing,
        handleUpdateStatus,
        handleApproveDesign,
        handleRevisiDesign,
        handleApproveLayout,
        handleRevisiLayout,
        handleSendRecommendations,
        fetchOrders
    };
}

export type UseMonitoringPesananReturn = ReturnType<typeof useMonitoringPesanan>;
