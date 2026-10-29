import { useState, useEffect, useMemo } from "react";
import {
    Clock,
    FileText,
    Printer,
    Scissors,
    CheckCircle2,
} from "lucide-react";
import { orderService } from "~/services/orderService";
import { generateInvoicePDF } from "~/lib/pdfHelper";
import { filterPlayersByQuery } from "~/lib/sizeUtils";
import { useAuth } from "~/context/AuthContext";
import { getDisplayStatus } from "./useTrackingPesanan";
import type { CustomerTrackedOrder } from "~/types/trackingPesanan";
import type {
    ProgressStage,
    ProgressToastMessage,
    UseProgressPesananReturn,
} from "~/types/progressPesanan";

export const PROGRESS_STAGES: ProgressStage[] = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: FileText, desc: "Mockup desain" },
    { id: "LAYOUT", label: "Layout", icon: FileText, desc: "Pola & Layout" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak kain" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Selesai" },
];

export const getProgressDisplayStatus = getDisplayStatus;

export function useProgressPesanan(): UseProgressPesananReturn {
    const { user } = useAuth();
    const [orders, setOrders] = useState<CustomerTrackedOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<CustomerTrackedOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [memberSearch, setMemberSearch] = useState("");

    const [feedbackInput, setFeedbackInput] = useState("");
    const [showRevisiForm, setShowRevisiForm] = useState(false);
    const [showLayoutRevisiForm, setShowLayoutRevisiForm] = useState(false);
    const [layoutFeedbackInput, setLayoutFeedbackInput] = useState("");
    const [submittingAction, setSubmittingAction] = useState(false);
    const [toast, setToast] = useState<ProgressToastMessage | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        setMemberSearch("");
    }, [selectedOrder?.id]);

    const totalPlayers = (selectedOrder?.details || []).length;
    const filteredPlayers = useMemo(
        () => filterPlayersByQuery(selectedOrder?.details || [], memberSearch),
        [selectedOrder?.details, memberSearch],
    );

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

    const syncUpdatedOrder = (updated: CustomerTrackedOrder) => {
        setSelectedOrder(updated);
        setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o)),
        );
    };

    const handleApprove = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.approveDesign(selectedOrder.id);
            syncUpdatedOrder({
                ...selectedOrder,
                designStatus: "APPROVED",
                designFeedback: null,
            });
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
            syncUpdatedOrder({
                ...selectedOrder,
                designStatus: "REVISI",
                designFeedback: feedbackInput,
            });
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
            syncUpdatedOrder({
                ...selectedOrder,
                layoutStatus: "APPROVED",
                layoutFeedback: null,
            });
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
            syncUpdatedOrder({
                ...selectedOrder,
                layoutStatus: "REVISI",
                layoutFeedback: layoutFeedbackInput,
            });
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
            syncUpdatedOrder({
                ...selectedOrder,
                designStatus: "SENT",
            });
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
            syncUpdatedOrder({
                ...selectedOrder,
                layoutStatus: "SENT",
            });
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
        memberSearch,
        setMemberSearch,
        filteredPlayers,
        totalPlayers,
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
