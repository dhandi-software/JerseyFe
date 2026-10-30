import { useState, useEffect } from "react";
import {
    Clock,
    FileText,
    Printer,
    Scissors,
    CheckCircle2,
} from "lucide-react";
import { orderService } from "~/services/orderService";
import { useAuth } from "~/context/AuthContext";
import {
    getDisplayStatus,
    useCustomerOrderSharedActions,
} from "./useTrackingPesanan";
import type { CustomerTrackedOrder } from "~/types/trackingPesanan";
import type {
    ProgressStage,
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
    const [showLayoutRevisiForm, setShowLayoutRevisiForm] = useState(false);
    const [layoutFeedbackInput, setLayoutFeedbackInput] = useState("");

    const syncUpdatedOrder = (updated: CustomerTrackedOrder) => {
        setSelectedOrder(updated);
        setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o)),
        );
    };

    const {
        setSubmittingAction,
        ...sharedActions
    } = useCustomerOrderSharedActions(selectedOrder, syncUpdatedOrder);

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
            sharedActions.setToast({
                title: "Layout berhasil disetujui!",
                variant: "success",
            });
        } catch (err) {
            console.error("Gagal menyetujui layout:", err);
            sharedActions.setToast({
                title: "Gagal menyetujui layout",
                variant: "destructive",
            });
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
            sharedActions.setToast({
                title: "Revisi layout berhasil diajukan!",
                variant: "success",
            });
        } catch (err) {
            console.error("Gagal mengajukan revisi layout:", err);
            sharedActions.setToast({
                title: "Gagal mengajukan revisi layout",
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
            sharedActions.setToast({
                title: "Persetujuan layout dibatalkan!",
                variant: "success",
            });
        } catch (err) {
            console.error("Gagal membatalkan persetujuan layout:", err);
            sharedActions.setToast({
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
        ...sharedActions,
        user,
        orders,
        selectedOrder,
        setSelectedOrder,
        loading,
        showLayoutRevisiForm,
        setShowLayoutRevisiForm,
        layoutFeedbackInput,
        setLayoutFeedbackInput,
        handleApproveLayout,
        handleUnapproveLayout,
        handleRevisiLayout,
        getCurrentStageIndex,
        stages: PROGRESS_STAGES,
    };
}
