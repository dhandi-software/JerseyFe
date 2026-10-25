import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
    Clock,
    Palette,
    Ruler,
    Printer,
    Scissors,
    CheckCircle2,
} from "lucide-react";
import { orderService } from "~/services/orderService";
import { generateInvoicePDF } from "~/lib/pdfHelper";
import { adminApi } from "~/api/admin";
import type { TrackingStage, UseTrackingPesananReturn } from "~/types";

export const TRACKING_STAGES: TrackingStage[] = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: Palette, desc: "Mockup desain" },
    { id: "LAYOUT", label: "Layout", icon: Ruler, desc: "Pola & Layout" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak kain" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Selesai" },
];

export const getDisplayStatus = (status: string, isWorking: boolean) => {
    if (status === "MENUNGGU") return "Verifikasi Pembayaran";
    if (status === "DESAIN") {
        return isWorking ? "Pesanan Sedang Diproses" : "Pembayaran Diterima";
    }
    if (["LAYOUT", "PRINT", "FINISHING"].includes(status)) {
        return "Pesanan Sedang Diproses";
    }
    if (status === "SELESAI") return "Selesai";
    if (status === "DITOLAK") return "Ditolak";
    return status;
};

export function useTrackingPesanan(): UseTrackingPesananReturn {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get("id") || "");
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [feedbackInput, setFeedbackInput] = useState("");
    const [showRevisiForm, setShowRevisiForm] = useState(false);
    const [submittingAction, setSubmittingAction] = useState(false);
    const [toast, setToast] = useState<{
        title: string;
        variant: "success" | "destructive";
    } | null>(null);
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        const fetchBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    setBahanList(res.data);
                }
            } catch (err) {
                console.error("Error fetching bahan:", err);
            }
        };
        fetchBahan();
    }, []);

    const executeSearch = async (idToSearch: string) => {
        if (!idToSearch.trim()) return;

        setLoading(true);
        setError("");
        try {
            const data = await orderService.trackOrder(idToSearch.trim());
            setOrder(data);
        } catch (err: any) {
            setError(
                "ID Pesanan tidak ditemukan. Pastikan kode yang Anda masukkan benar.",
            );
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setOrderId(id);
            executeSearch(id);
        }
    }, [searchParams]);

    const handlePrintInvoice = async () => {
        if (!order) return;
        setIsPrinting(true);
        try {
            await generateInvoicePDF(order);
        } catch (err) {
            console.error("Failed to generate PDF", err);
            setToast({ title: "Gagal mencetak invoice", variant: "destructive" });
        } finally {
            setIsPrinting(false);
        }
    };

    const handleApprove = async () => {
        if (!order) return;
        setSubmittingAction(true);
        try {
            await orderService.approveDesign(order.id);
            setOrder((prev: any) => ({
                ...prev,
                designStatus: "APPROVED",
                designFeedback: null,
            }));
            setToast({ title: "Desain berhasil disetujui!", variant: "success" });
        } catch (err) {
            console.error("Gagal menyetujui desain:", err);
            setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleUnapproveDesign = async () => {
        if (!order) return;
        setSubmittingAction(true);
        try {
            await orderService.unapproveDesign(order.id);
            setOrder((prev: any) => ({
                ...prev,
                designStatus: "SENT",
            }));
            setToast({
                title: "Persetujuan desain dibatalkan!",
                variant: "success",
            });
        } catch (err) {
            console.error("Gagal membatalkan persetujuan desain:", err);
            setToast({
                title: "Gagal membatalkan persetujuan desain",
                variant: "destructive",
            });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleRevisi = async () => {
        if (!order || !feedbackInput.trim()) return;
        setSubmittingAction(true);
        try {
            await orderService.revisiDesign(order.id, feedbackInput);
            setOrder((prev: any) => ({
                ...prev,
                designStatus: "REVISI",
                designFeedback: feedbackInput,
            }));
            setShowRevisiForm(false);
            setFeedbackInput("");
            setToast({ title: "Revisi berhasil diajukan!", variant: "success" });
        } catch (err) {
            console.error("Gagal mengajukan revisi:", err);
            setToast({ title: "Gagal mengajukan revisi", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleSelectAlternative = async (bahanId: number | string) => {
        if (!order) return;
        try {
            await orderService.selectAlternative(order.id, Number(bahanId));
            setToast({
                title: "Bahan berhasil diganti ke alternatif!",
                variant: "success",
            });
            executeSearch(order.orderId || order.id);
        } catch (err) {
            console.error("Gagal memilih bahan alternatif:", err);
            setToast({
                title: "Gagal mengganti bahan",
                variant: "destructive",
            });
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(orderId);
    };

    const getCurrentStageIndex = () => {
        if (!order) return -1;
        return TRACKING_STAGES.findIndex((s) => s.id === order.status);
    };

    return {
        orderId,
        setOrderId,
        order,
        setOrder,
        loading,
        error,
        feedbackInput,
        setFeedbackInput,
        showRevisiForm,
        setShowRevisiForm,
        submittingAction,
        toast,
        setToast,
        bahanList,
        isPrinting,
        handlePrintInvoice,
        executeSearch,
        handleApprove,
        handleUnapproveDesign,
        handleRevisi,
        handleSelectAlternative,
        handleSearch,
        getCurrentStageIndex,
        stages: TRACKING_STAGES,
        getDisplayStatus,
    };
}
