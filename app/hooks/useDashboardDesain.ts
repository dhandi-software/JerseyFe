import { useState, useEffect, useRef } from "react";
import { orderService } from "~/services/orderService";
import { useAuth } from "~/hooks/useAuth";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import type {
    DesainOrderItem,
    DesainFilterTab,
    DesainConfirmModalState,
    UseDashboardDesainReturn,
} from "~/types";

export function useDashboardDesain(): UseDashboardDesainReturn {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [orders, setOrders] = useState<DesainOrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<DesainOrderItem | null>(null);
    const [filterTab, setFilterTab] = useState<DesainFilterTab>("ALL");
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{
        title: string;
        variant: "success" | "destructive";
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [windowDragging, setWindowDragging] = useState(false);
    const [confirmModal, setConfirmModal] = useState<DesainConfirmModalState>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
    });

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const data = await orderService.getDesignerOrders(user.id);
                const formattedOrders: DesainOrderItem[] = data.map((o: any) => ({
                    id: o.orderId,
                    rawId: o.id,
                    customer: o.customerName,
                    product:
                        o.details.length > 0
                            ? o.details[0].productTitle
                            : "Custom Jersey",
                    qty: o.details.length,
                    status: o.status,
                    queueNumber: o.queueNumber,
                    isWorking: o.isWorking,
                    mockupUrl: o.mockupUrl,
                    designStatus: o.designStatus,
                    designFeedback: o.designFeedback,
                    layoutUrl: o.layoutUrl,
                    layoutStatus: o.layoutStatus,
                    layoutFeedback: o.layoutFeedback,
                    dateTime: new Date(o.createdAt).toLocaleString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    playerInfo: sortPlayersBySize(
                        o.details.map((d: any) => ({
                            name: d.playerName || "-",
                            number: d.playerNumber || "-",
                            size: d.playerSize || "-",
                        })),
                    ),
                    designNote: o.designNote,
                    designUrl: o.designUrl,
                    customerId: o.customerId,
                    totalAmount: o.totalAmount,
                }));
                setOrders(formattedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user?.id]);

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

        if (filterTab === "WAITING") {
            return order.status === "DESAIN" && !order.isWorking;
        }
        if (filterTab === "PROCESSING") {
            return (
                (order.status === "DESAIN" && order.isWorking) ||
                ["LAYOUT", "PRINT", "FINISHING"].includes(order.status)
            );
        }
        if (filterTab === "COMPLETED") {
            return order.status === "SELESAI";
        }
        return true;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (a.status === "SELESAI" && b.status !== "SELESAI") return 1;
        if (b.status === "SELESAI" && a.status !== "SELESAI") return -1;

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

    const handleUpdateStatus = (
        id: number,
        newStatus: string,
        isWorking?: boolean,
    ) => {
        let msg = "";
        if (newStatus === "LAYOUT")
            msg =
                "Apakah Anda yakin ingin menyelesaikan desain dan melanjutkan ke tahap Layout?";
        else if (newStatus === "PRINT")
            msg =
                "Apakah Anda yakin ingin menyelesaikan Layout dan melanjutkan ke cetak kain?";
        else if (newStatus === "FINISHING")
            msg =
                "Apakah Anda yakin ingin menyelesaikan Print dan melanjutkan ke Finishing?";
        else if (newStatus === "SELESAI")
            msg =
                "Apakah Anda yakin ingin menyelesaikan produksi pesanan ini?";
        else if (isWorking)
            msg = "Apakah Anda yakin ingin mulai mengerjakan pesanan ini?";
        else
            msg = `Apakah Anda yakin ingin mengubah status pesanan ini ke ${newStatus}?`;

        requestConfirmation(
            "Konfirmasi Perubahan Status",
            msg,
            async () => {
                try {
                    await orderService.updateOrderStatus(
                        id,
                        newStatus,
                        undefined,
                        isWorking,
                    );
                    setOrders((prev) =>
                        prev.map((o) =>
                            o.rawId === id
                                ? {
                                      ...o,
                                      status: newStatus,
                                      isWorking:
                                          isWorking !== undefined
                                              ? isWorking
                                              : o.isWorking,
                                  }
                                : o,
                        ),
                    );
                    if (selectedOrder?.rawId === id) {
                        setSelectedOrder((prev: any) => ({
                            ...prev,
                            status: newStatus,
                            isWorking:
                                isWorking !== undefined
                                    ? isWorking
                                    : prev.isWorking,
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

    const handleCancelMockup = async () => {
        if (!selectedOrder) return;
        requestConfirmation(
            "Batalkan Kirim Mockup",
            "Apakah Anda yakin ingin membatalkan / menarik kembali mockup ini agar bisa diedit kembali?",
            async () => {
                try {
                    await orderService.cancelMockup(selectedOrder.rawId);
                    setOrders((prev) =>
                        prev.map((o) =>
                            o.rawId === selectedOrder.rawId
                                ? {
                                      ...o,
                                      designStatus: "PENDING",
                                      mockupUrl: null,
                                  }
                                : o,
                        ),
                    );
                    setSelectedOrder((prev: any) => ({
                        ...prev,
                        designStatus: "PENDING",
                        mockupUrl: null,
                    }));
                    setToast({
                        title: "Pengiriman mockup berhasil dibatalkan",
                        variant: "success",
                    });
                } catch (error) {
                    console.error("Gagal membatalkan mockup:", error);
                    setToast({
                        title: "Gagal membatalkan mockup",
                        variant: "destructive",
                    });
                } finally {
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                }
            },
        );
    };

    const handleUploadMockup = async (
        fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    ) => {
        let file: File | undefined;
        if (fileOrEvent instanceof File) {
            file = fileOrEvent;
        } else if (fileOrEvent && "target" in fileOrEvent) {
            file = fileOrEvent.target.files?.[0];
        }
        if (!file || !selectedOrder) return;
        setUploading(true);
        try {
            const updated = await orderService.uploadMockup(
                selectedOrder.rawId,
                file,
            );
            setOrders((prev) =>
                prev.map((o) =>
                    o.rawId === selectedOrder.rawId
                        ? {
                              ...o,
                              mockupUrl: updated.mockupUrl,
                              designStatus: updated.designStatus,
                              designFeedback: null,
                          }
                        : o,
                ),
            );
            setSelectedOrder((prev: any) => ({
                ...prev,
                mockupUrl: updated.mockupUrl,
                designStatus: updated.designStatus,
                designFeedback: null,
            }));
            setToast({
                title: "Mockup berhasil diunggah dan dikirim!",
                variant: "success",
            });
        } catch (error) {
            console.error("Gagal mengupload mockup:", error);
            setToast({
                title: "Gagal mengupload mockup",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleCancelLayout = async () => {
        if (!selectedOrder) return;
        requestConfirmation(
            "Batalkan Kirim Layout",
            "Apakah Anda yakin ingin membatalkan / menarik kembali layout ini agar bisa diedit kembali?",
            async () => {
                try {
                    await orderService.cancelLayout(selectedOrder.rawId);
                    setOrders((prev) =>
                        prev.map((o) =>
                            o.rawId === selectedOrder.rawId
                                ? {
                                      ...o,
                                      layoutStatus: "PENDING",
                                      layoutUrl: null,
                                  }
                                : o,
                        ),
                    );
                    setSelectedOrder((prev: any) => ({
                        ...prev,
                        layoutStatus: "PENDING",
                        layoutUrl: null,
                    }));
                    setToast({
                        title: "Pengiriman layout berhasil dibatalkan",
                        variant: "success",
                    });
                } catch (error) {
                    console.error("Gagal membatalkan layout:", error);
                    setToast({
                        title: "Gagal membatalkan layout",
                        variant: "destructive",
                    });
                } finally {
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                }
            },
        );
    };

    const handleUploadLayout = async (
        fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    ) => {
        let file: File | undefined;
        if (fileOrEvent instanceof File) {
            file = fileOrEvent;
        } else if (fileOrEvent && "target" in fileOrEvent) {
            file = fileOrEvent.target.files?.[0];
        }
        if (!file || !selectedOrder) return;
        setUploading(true);
        try {
            const updated = await orderService.uploadLayout(
                selectedOrder.rawId,
                file,
            );
            setOrders((prev) =>
                prev.map((o) =>
                    o.rawId === selectedOrder.rawId
                        ? {
                              ...o,
                              layoutUrl: updated.layoutUrl,
                              layoutStatus: updated.layoutStatus,
                              layoutFeedback: null,
                          }
                        : o,
                ),
            );
            setSelectedOrder((prev: any) => ({
                ...prev,
                layoutUrl: updated.layoutUrl,
                layoutStatus: updated.layoutStatus,
                layoutFeedback: null,
            }));
            setToast({
                title: "Layout berhasil diunggah dan dikirim!",
                variant: "success",
            });
        } catch (error) {
            console.error("Gagal mengupload layout:", error);
            setToast({
                title: "Gagal mengupload layout",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const canUpload =
        Boolean(selectedOrder &&
        selectedOrder.isWorking &&
        selectedOrder.status === "DESAIN" &&
        (selectedOrder.designStatus === "PENDING" ||
            selectedOrder.designStatus === "REVISI"));

    const canUploadLayout =
        Boolean(selectedOrder &&
        selectedOrder.status === "LAYOUT" &&
        (selectedOrder.layoutStatus === "PENDING" ||
            selectedOrder.layoutStatus === "REVISI"));

    useEffect(() => {
        if (!canUpload && !canUploadLayout) {
            setWindowDragging(false);
            return;
        }

        const handleDragOver = (e: DragEvent) => {
            if (e.dataTransfer?.types.includes("Files")) {
                e.preventDefault();
                setWindowDragging(true);
            }
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            if (
                e.relatedTarget === null ||
                e.clientX <= 0 ||
                e.clientY <= 0 ||
                e.clientX >= window.innerWidth ||
                e.clientY >= window.innerHeight
            ) {
                setWindowDragging(false);
            }
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            setWindowDragging(false);
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                if (canUpload) {
                    handleUploadMockup(files[0]);
                } else if (canUploadLayout) {
                    handleUploadLayout(files[0]);
                }
            }
        };

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDrop);
        };
    }, [canUpload, canUploadLayout, selectedOrder?.rawId]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "SELESAI":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "FINISHING":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "PRINT":
                return "bg-cyan-50 text-cyan-700 border-cyan-200";
            case "LAYOUT":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "DESAIN":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "DITOLAK":
                return "bg-red-50 text-red-700 border-red-200";
            case "MENUNGGU":
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    return {
        user,
        fileInputRef,
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        filterTab,
        setFilterTab,
        searchInput,
        setSearchInput,
        searchQuery,
        setSearchQuery,
        uploading,
        toast,
        setToast,
        isDragging,
        setIsDragging,
        windowDragging,
        confirmModal,
        setConfirmModal,
        filteredOrders,
        sortedOrders,
        canUpload,
        canUploadLayout,
        handleUpdateStatus,
        handleCancelMockup,
        handleUploadMockup,
        handleCancelLayout,
        handleUploadLayout,
        requestConfirmation,
        getStatusStyle,
    };
}
