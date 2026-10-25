import { useState, useEffect } from "react";
import {
    Clock,
    FileText,
    Printer,
    Scissors,
    CheckCircle2,
} from "lucide-react";
import { orderService } from "~/services/orderService";
import { generateInvoicePDF } from "~/lib/pdfHelper";
import { useAuth } from "~/context/AuthContext";
import type { TrackingStage, UseProgressPesananReturn } from "~/types";

export const PROGRESS_STAGES: TrackingStage[] = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: FileText, desc: "Mockup desain" },
    { id: "LAYOUT", label: "Layout", icon: FileText, desc: "Pola & Layout" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak kain" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Selesai" },
];

export const getProgressDisplayStatus = (
    status: string,
    isWorking: boolean,
) => {
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

export function useProgressPesanan(): UseProgressPesananReturn {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const [feedbackInput, setFeedbackInput] = useState("");
    const [showRevisiForm, setShowRevisiForm] = useState(false);
    const [showLayoutRevisiForm, setShowLayoutRevisiForm] = useState(false);
    const [layoutFeedbackInput, setLayoutFeedbackInput] = useState("");
    const [submittingAction, setSubmittingAction] = useState(false);
    const [toast, setToast] = useState<{
        title: string;
        variant: "success" | "destructive";
    } | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrintInvoice = async () => {
        if (!selectedOrder) return;
        setIsPrinting(true);
        try {
            await generateInvoicePDF(selectedOrder);
        } catch (err) {
            console.error("Failed to generate PDF", err);
            setToast({ title: "Gagal mencetak invoice", variant: "destructive" });
        } finally {
            setIsPrinting(false);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const data = await orderService.getCustomerOrders(user.id);
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user?.id]);

    const handleApprove = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.approveDesign(selectedOrder.id);
            const updated = {
                ...selectedOrder,
                designStatus: "APPROVED",
                designFeedback: null,
            };
            setSelectedOrder(updated);
            setOrders((prev) =>
                prev.map((o) => (o.id === selectedOrder.id ? updated : o)),
            );
            setToast({ title: "Desain berhasil disetujui!", variant: "success" });
        } catch (err) {
            console.error("Gagal menyetujui desain:", err);
            setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleRevisi = async () => {
        if (!selectedOrder || !feedbackInput.trim()) return;
        setSubmittingAction(true);
        try {
            await orderService.revisiDesign(selectedOrder.id, feedbackInput);
            const updated = {
                ...selectedOrder,
                designStatus: "REVISI",
                designFeedback: feedbackInput,
            };
            setSelectedOrder(updated);
            setOrders((prev) =>
                prev.map((o) => (o.id === selectedOrder.id ? updated : o)),
            );
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

    const handleApproveLayout = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.approveLayout(selectedOrder.id);
            const updated = {
                ...selectedOrder,
                layoutStatus: "APPROVED",
                layoutFeedback: null,
            };
            setSelectedOrder(updated);
            setOrders((prev) =>
                prev.map((o) => (o.id === selectedOrder.id ? updated : o)),
            );
            setToast({ title: "Layout berhasil disetujui!", variant: "success" });
        } catch (err) {
            console.error("Gagal menyetujui layout:", err);
            setToast({ title: "Gagal menyetujui layout", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleRevisiLayout = async () => {
        if (!selectedOrder || !layoutFeedbackInput.trim()) return;
        setSubmittingAction(true);
        try {
            await orderService.revisiLayout(
                selectedOrder.id,
                layoutFeedbackInput,
            );
            const updated = {
                ...selectedOrder,
                layoutStatus: "REVISI",
                layoutFeedback: layoutFeedbackInput,
            };
            setSelectedOrder(updated);
            setOrders((prev) =>
                prev.map((o) => (o.id === selectedOrder.id ? updated : o)),
            );
            setShowLayoutRevisiForm(false);
            setLayoutFeedbackInput("");
            setToast({
                title: "Revisi layout berhasil diajukan!",
                variant: "success",
            });
        } catch (err) {
            console.error("Gagal mengajukan revisi layout:", err);
            setToast({
                title: "Gagal mengajukan revisi layout",
                variant: "destructive",
            });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleUnapproveDesign = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.unapproveDesign(selectedOrder.id);
            const updated = {
                ...selectedOrder,
                designStatus: "SENT",
            };
            setSelectedOrder(updated);
            setOrders((prev) =>
                prev.map((o) => (o.id === selectedOrder.id ? updated : o)),
            );
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

    const handleUnapproveLayout = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.unapproveLayout(selectedOrder.id);
            const updated = {
                ...selectedOrder,
                layoutStatus: "SENT",
            };
            setSelectedOrder(updated);
            setOrders((prev) =>
                prev.map((o) => (o.id === selectedOrder.id ? updated : o)),
            );
            setToast({
                title: "Persetujuan layout dibatalkan!",
                variant: "success",
            });
        } catch (err) {
            console.error("Gagal membatalkan persetujuan layout:", err);
            setToast({
                title: "Gagal membatalkan persetujuan layout",
                variant: "destructive",
            });
        } finally {
            setSubmittingAction(false);
        }
    };

    const getCurrentStageIndex = (status?: string) => {
        const s = status || selectedOrder?.status;
        if (!s) return -1;
        return PROGRESS_STAGES.findIndex((stage) => stage.id === s);
    };

    return {
        user,
        orders,
        selectedOrder,
        setSelectedOrder,
        loading,
        feedbackInput,
        setFeedbackInput,
        showRevisiForm,
        setShowRevisiForm,
        showLayoutRevisiForm,
        setShowLayoutRevisiForm,
        layoutFeedbackInput,
        setLayoutFeedbackInput,
        submittingAction,
        toast,
        setToast,
        isPrinting,
        handlePrintInvoice,
        handleApprove,
        handleUnapproveDesign,
        handleRevisi,
        handleApproveLayout,
        handleUnapproveLayout,
        handleRevisiLayout,
        getCurrentStageIndex,
        stages: PROGRESS_STAGES,
        getDisplayStatus: getProgressDisplayStatus,
    };
}
