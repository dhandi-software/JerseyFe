import { useState, useEffect } from "react";
import { orderService } from "~/services/orderService";
import { useAuth } from "~/hooks/useAuth";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import type {
    PackingOrderItem,
    PackingFilterTab,
    PackingConfirmModalState,
    UsePackingReturn,
} from "~/types";

export function usePacking(): UsePackingReturn {
    const { user } = useAuth();
    const [orders, setOrders] = useState<PackingOrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<PackingOrderItem | null>(null);
    const [filterTab, setFilterTab] = useState<PackingFilterTab>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [toast, setToast] = useState<{
        title: string;
        variant: "success" | "destructive";
    } | null>(null);
    const [confirmModal, setConfirmModal] = useState<PackingConfirmModalState>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                const formattedOrders: PackingOrderItem[] = data.map((o: any) => ({
                    id: o.orderId,
                    rawId: o.id,
                    customer: o.customerName,
                    product:
                        o.details?.length > 0
                            ? o.details[0].productTitle
                            : "Custom Jersey",
                    qty: o.details?.length || 0,
                    status: o.status,
                    queueNumber: o.queueNumber,
                    mockupUrl: o.mockupUrl,
                    layoutUrl: o.layoutUrl,
                    dateTime: new Date(o.createdAt).toLocaleString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    playerInfo: sortPlayersBySize(
                        (o.details || []).map((d: any) => {
                            let baseSize = d.playerSize || "-";
                            let sleeve = "-";
                            if (baseSize.includes("(")) {
                                const parts = baseSize.split("(");
                                baseSize = parts[0].trim();
                                sleeve = parts[1].replace(")", "").trim();
                            }
                            return {
                                name: d.playerName || "-",
                                number: d.playerNumber || "-",
                                size: baseSize,
                                sleeve: sleeve,
                                playerSize: d.playerSize,
                            };
                        }),
                    ),
                    designNote: o.designNote,
                }));
                const gudangOrders = formattedOrders.filter((o) =>
                    ["PRINT", "FINISHING", "SELESAI"].includes(o.status),
                );
                setOrders(gudangOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filterTab !== "ALL" && order.status !== filterTab) {
            return false;
        }
        return true;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (!a.queueNumber) return 1;
        if (!b.queueNumber) return -1;
        return a.queueNumber.localeCompare(b.queueNumber);
    });

    const requestConfirmation = (
        title: string,
        message: string,
        onConfirm: () => void,
    ) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm,
        });
    };

    const handleUpdateStatus = (id: number, newStatus: string) => {
        let msg = `Apakah Anda yakin ingin mengubah status pesanan ini ke ${newStatus}?`;
        if (newStatus === "SELESAI") {
            msg =
                "Apakah pesanan ini sudah selesai dipacking dan siap dikirim/diserahkan ke pelanggan?";
        }

        requestConfirmation(
            "Konfirmasi Perubahan Status",
            msg,
            async () => {
                try {
                    await orderService.updateOrderStatus(id, newStatus);
                    setOrders((prev) =>
                        prev.map((o) =>
                            o.rawId === id ? { ...o, status: newStatus } : o,
                        ),
                    );
                    if (selectedOrder?.rawId === id) {
                        setSelectedOrder((prev: any) => ({
                            ...prev,
                            status: newStatus,
                        }));
                    }
                    setToast({
                        title: "Status pesanan berhasil diperbarui",
                        variant: "success",
                    });
                } catch (error) {
                    console.error("Error updating status:", error);
                    setToast({
                        title: "Gagal memperbarui status",
                        variant: "destructive",
                    });
                } finally {
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                }
            },
        );
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "SELESAI":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "FINISHING":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "PRINT":
                return "bg-cyan-50 text-cyan-700 border-cyan-200";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    return {
        user,
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        filterTab,
        setFilterTab,
        searchQuery,
        setSearchQuery,
        searchInput,
        setSearchInput,
        toast,
        setToast,
        confirmModal,
        setConfirmModal,
        filteredOrders,
        sortedOrders,
        handleUpdateStatus,
        requestConfirmation,
        getStatusStyle,
    };
}
