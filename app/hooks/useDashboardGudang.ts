import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { adminApi } from "~/api/admin";
import { orderService } from "~/services/orderService";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";
import type {
    GudangTab,
    GudangStockFilter,
    GudangAdjustAction,
    GudangEditFormState,
    UseDashboardGudangReturn,
} from "~/types";

export function useDashboardGudang(): UseDashboardGudangReturn {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<GudangTab>("penyubliman");
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{
        title: string;
        variant: "success" | "destructive";
    } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewMockup, setPreviewMockup] = useState<string | null>(null);

    // Finishing states
    const [finishingSearch, setFinishingSearch] = useState("");
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [packingLoading, setPackingLoading] = useState(false);
    const [confirmPackingModal, setConfirmPackingModal] = useState<{
        isOpen: boolean;
        order: any | null;
    }>({ isOpen: false, order: null });

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [stockFilter, setStockFilter] = useState<GudangStockFilter>("all");
    const [logSearchQuery, setLogSearchQuery] = useState("");

    // Modal states
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [adjustItem, setAdjustItem] = useState<any | null>(null);
    const [adjustAction, setAdjustAction] = useState<GudangAdjustAction>("TAMBAH");
    const [adjustAmount, setAdjustAmount] = useState<number>(0);
    const [adjustNote, setAdjustNote] = useState("");
    const [adjustLoading, setAdjustLoading] = useState(false);

    const [selectedDetailItem, setSelectedDetailItem] = useState<any | null>(null);

    // Edit states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editForm, setEditForm] = useState<GudangEditFormState>({
        nama: "",
        deskripsi: "",
        kuantitasKg: 0,
        rasioKonversi: "" as string | number,
        harga: 0,
        status: "Tersedia",
    });
    const parsedEditRasio =
        parseFloat(String(editForm.rasioKonversi).replace(",", ".")) || 2.5;
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [deleteExistingImage, setDeleteExistingImage] = useState(false);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Delete states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<any | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Sorting states
    const [sortColumn, setSortColumn] = useState<
        "nama" | "kuantitasKg" | "harga" | null
    >(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const formatThousands = (value: number | string) => {
        if (!value) return "";
        const num =
            typeof value === "string"
                ? value.replace(/[^0-9]/g, "")
                : value.toString();
        return new Intl.NumberFormat("id-ID").format(Number(num));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const resBahan = await adminApi.getBahanBaju();
            if (resBahan.status === "success") setBahanList(resBahan.data);

            const resHistory = await adminApi.getBahanBajuHistory();
            if (resHistory.status === "success") setHistoryList(resHistory.data);

            try {
                const ordersData = await orderService.getOrders();
                const formattedOrders = (ordersData || []).map((o: any) => ({
                    id: o.orderId,
                    rawId: o.id,
                    customer: o.customerName,
                    designer: o.designerName || "Belum Ada",
                    product:
                        o.details?.length > 0
                            ? o.details[0].productTitle
                            : "Custom Jersey",
                    qty: o.details?.length || 0,
                    status: o.status,
                    queueNumber: o.queueNumber,
                    mockupUrl: o.mockupUrl,
                    layoutUrl: o.layoutUrl,
                    designStatus: o.designStatus,
                    layoutStatus: o.layoutStatus,
                    dateTime: new Date(o.createdAt).toLocaleString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    playerInfo: sortPlayersBySize(
                        (o.details || []).map((d: any) => ({
                            name: d.playerName || "-",
                            number: d.playerNumber || "-",
                            size: d.playerSize || "-",
                        })),
                    ),
                    designNote: o.designNote,
                    totalAmount: o.totalAmount,
                }));
                setOrdersList(formattedOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setToast({
                title: "Gagal memuat data dari server",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFinishPacking = async (order: any) => {
        setPackingLoading(true);
        try {
            await orderService.updateOrderStatus(order.rawId, "SELESAI");
            setToast({
                title: `Pesanan ${order.id} selesai packing!`,
                variant: "success",
            });
            setConfirmPackingModal({ isOpen: false, order: null });
            fetchData();
        } catch (error) {
            console.error(error);
            setToast({
                title: "Gagal menyelesaikan packing",
                variant: "destructive",
            });
        } finally {
            setPackingLoading(false);
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

            const formData = new FormData();
            formData.append("nama", adjustItem.nama);
            formData.append("deskripsi", adjustItem.deskripsi || "");
            formData.append("kuantitasKg", newKuantitas.toString());
            formData.append(
                "rasioKonversi",
                (adjustItem.rasioKonversi || 2.5).toString(),
            );
            formData.append("harga", (adjustItem.harga || 0).toString());
            formData.append(
                "keterangan_ubah",
                adjustNote ||
                    (adjustAction === "TAMBAH"
                        ? "Penambahan ketersediaan bahan"
                        : "Pengurangan ketersediaan bahan"),
            );
            formData.append(
                "actor",
                (user as any)?.staff?.nama ||
                    (user as any)?.username ||
                    "Staf Gudang",
            );

            const res = await adminApi.updateBahanBaju(adjustItem.id, formData);
            if (res.status === "success") {
                setToast({
                    title: `Berhasil menyesuaikan ketersediaan ${adjustItem.nama}`,
                    variant: "success",
                });
                setIsAdjustModalOpen(false);
                fetchData();
            } else {
                setToast({
                    title: "Gagal menyimpan penyesuaian ketersediaan",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            setToast({
                title: "Terjadi kesalahan sistem",
                variant: "destructive",
            });
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
            rasioKonversi: item.rasioKonversi
                ? String(item.rasioKonversi).replace(".", ",")
                : "",
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
            setToast({
                title: "Nama bahan tidak boleh kosong",
                variant: "destructive",
            });
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
            formData.append(
                "actor",
                (user as any)?.staff?.nama ||
                    (user as any)?.username ||
                    "Staf Gudang",
            );

            if (editImage) {
                formData.append("image", editImage);
            } else if (deleteExistingImage) {
                formData.append("deleteImage", "true");
            }

            const res = await adminApi.updateBahanBaju(editItem.id, formData);
            if (res.status === "success") {
                setToast({
                    title: "Bahan berhasil diperbarui",
                    variant: "success",
                });
                setIsEditModalOpen(false);
                fetchData();
            } else {
                setToast({
                    title: "Gagal memperbarui bahan",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            setToast({
                title: "Terjadi kesalahan saat memperbarui bahan",
                variant: "destructive",
            });
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
            const res = await adminApi.deleteBahanBaju(
                deleteItem.id,
                (user as any)?.staff?.nama ||
                    (user as any)?.username ||
                    "Staf Gudang",
            );
            if (res.status === "success") {
                setToast({
                    title: `Bahan ${deleteItem.nama} berhasil dihapus`,
                    variant: "success",
                });
                setIsDeleteModalOpen(false);
                setDeleteItem(null);
                fetchData();
            } else {
                setToast({
                    title: "Gagal menghapus bahan",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            setToast({
                title: "Terjadi kesalahan saat menghapus bahan",
                variant: "destructive",
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    const toggleSort = (col: "nama" | "kuantitasKg" | "harga") => {
        if (sortColumn === col) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    // Filter materials
    const filteredBahan = bahanList.filter((item) => {
        const matchesSearch = item.nama
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        let matchesStock = true;
        if (stockFilter === "low") {
            matchesStock =
                item.status === "Tersedia" &&
                item.kuantitasKg * (item.rasioKonversi || 2.5) <= 20;
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
    const filteredHistory = historyList.filter((log) => {
        const namaBahan = log.namaBahan || log.bahan?.nama || "";
        const keterangan = log.keterangan || "";
        const query = logSearchQuery.toLowerCase();
        return (
            namaBahan.toLowerCase().includes(query) ||
            keterangan.toLowerCase().includes(query) ||
            log.aksi.toLowerCase().includes(query)
        );
    });

    const totalMaterialsCount = bahanList.length;
    const totalKetersediaanKg = bahanList.reduce(
        (sum, item) => sum + (item.kuantitasKg || 0),
        0,
    );
    const totalKetersediaanMeter = bahanList.reduce(
        (sum, item) => sum + (item.kuantitasKg || 0) * (item.rasioKonversi || 2.5),
        0,
    );
    const lowStockCount = bahanList.filter(
        (item) =>
            item.status === "Tersedia" &&
            item.kuantitasKg * (item.rasioKonversi || 2.5) <= 20,
    ).length;
    const outOfStockCount = bahanList.filter(
        (item) => item.status === "Habis" || item.kuantitasKg <= 0,
    ).length;

    return {
        user,
        navigate,
        activeTab,
        setActiveTab,
        bahanList,
        historyList,
        ordersList,
        loading,
        toast,
        setToast,
        previewImage,
        setPreviewImage,
        previewMockup,
        setPreviewMockup,
        searchQuery,
        setSearchQuery,
        stockFilter,
        setStockFilter,
        logSearchQuery,
        setLogSearchQuery,
        finishingSearch,
        setFinishingSearch,
        expandedOrderId,
        setExpandedOrderId,
        packingLoading,
        confirmPackingModal,
        setConfirmPackingModal,
        isAdjustModalOpen,
        setIsAdjustModalOpen,
        adjustItem,
        setAdjustItem,
        adjustAction,
        setAdjustAction,
        adjustAmount,
        setAdjustAmount,
        adjustNote,
        setAdjustNote,
        adjustLoading,
        selectedDetailItem,
        setSelectedDetailItem,
        isEditModalOpen,
        setIsEditModalOpen,
        editItem,
        setEditItem,
        editLoading,
        editForm,
        setEditForm,
        parsedEditRasio,
        editImage,
        setEditImage,
        editImagePreview,
        setEditImagePreview,
        deleteExistingImage,
        setDeleteExistingImage,
        editFileInputRef,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        deleteItem,
        setDeleteItem,
        deleteLoading,
        sortColumn,
        setSortColumn,
        sortDirection,
        setSortDirection,
        toggleSort,
        filteredBahan,
        sortedBahan,
        filteredHistory,
        totalMaterialsCount,
        totalKetersediaanKg,
        totalKetersediaanMeter,
        lowStockCount,
        outOfStockCount,
        fetchData,
        handleOpenAdjust,
        handleAdjustSubmit,
        handleOpenEdit,
        handleEditImageChange,
        handleEditSubmit,
        handleOpenDelete,
        handleDeleteSubmit,
        handleFinishPacking,
        formatThousands,
    };
}
