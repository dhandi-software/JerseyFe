import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { adminApi } from "~/api/admin";
import type { 
    BahanBajuItem, 
    BahanBajuHistoryItem, 
    BahanBajuToast, 
    BahanBajuTab, 
    BahanBajuSortColumn, 
    BahanBajuSortDirection 
} from "~/types/bahanBaju";

export function useBahanBaju() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<BahanBajuTab>("penyubliman");
    const [bahanList, setBahanList] = useState<BahanBajuItem[]>([]);
    const [historyList, setHistoryList] = useState<BahanBajuHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<BahanBajuToast | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bahanToDelete, setBahanToDelete] = useState<{ id: number; nama: string } | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [sortColumn, setSortColumn] = useState<BahanBajuSortColumn>(null);
    const [sortDirection, setSortDirection] = useState<BahanBajuSortDirection>("asc");

    const fetchData = async () => {
        setLoading(true);
        try {
            const resBahan = await adminApi.getBahanBaju();
            if (resBahan.status === "success") setBahanList(resBahan.data);

            const resHistory = await adminApi.getBahanBajuHistory();
            if (resHistory.status === "success") setHistoryList(resHistory.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteClick = (id: number, nama: string) => {
        setBahanToDelete({ id, nama });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!bahanToDelete) return;
        try {
            await adminApi.deleteBahanBaju(bahanToDelete.id);
            setToast({ title: "Bahan berhasil dihapus", variant: "success" });
            fetchData();
        } catch (error) {
            console.error(error);
            setToast({ title: "Gagal menghapus data", variant: "destructive" });
        } finally {
            setIsDeleteModalOpen(false);
            setBahanToDelete(null);
        }
    };

    const sortedBahanList = useMemo(() => {
        return [...bahanList].sort((a, b) => {
            if (!sortColumn) return 0;

            let valA: string | number;
            let valB: string | number;
            if (sortColumn === "nama") {
                valA = a.nama.toLowerCase();
                valB = b.nama.toLowerCase();
            } else if (sortColumn === "stok") {
                valA = a.kuantitasKg;
                valB = b.kuantitasKg;
            } else if (sortColumn === "harga") {
                valA = a.harga || 0;
                valB = b.harga || 0;
            } else if (sortColumn === "tanggal") {
                valA = new Date(a.createdAt).getTime();
                valB = new Date(b.createdAt).getTime();
            } else {
                return 0;
            }

            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [bahanList, sortColumn, sortDirection]);

    const toggleSort = (col: "nama" | "stok" | "harga" | "tanggal") => {
        if (sortColumn === col) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    return {
        activeTab,
        setActiveTab,
        bahanList,
        historyList,
        sortedBahanList,
        loading,
        toast,
        setToast,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        bahanToDelete,
        handleDeleteClick,
        confirmDelete,
        previewImage,
        setPreviewImage,
        sortColumn,
        sortDirection,
        toggleSort,
        navigate,
    };
}
