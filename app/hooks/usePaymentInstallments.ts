import { useState, useCallback, useMemo, useEffect } from "react";
import { orderService } from "~/services/orderService";
import type { OrderPayment, AddPaymentPayload, PaymentSummary } from "~/types/payment";

export interface UsePaymentInstallmentsOptions {
    initialPayments?: OrderPayment[];
    totalAmount?: number;
    initialPaidAmount?: number;
    orderId?: number;
    onPaymentAdded?: (updatedOrderData: {
        id?: number;
        rawId?: number;
        paidAmount: number;
        remainingAmount: number;
        paymentType: string;
        paymentUrl?: string;
    }) => void;
}

export function usePaymentInstallments({
    initialPayments = [],
    totalAmount = 0,
    initialPaidAmount = 0,
    orderId,
    onPaymentAdded
}: UsePaymentInstallmentsOptions = {}) {
    const [payments, setPayments] = useState<OrderPayment[]>(initialPayments);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal state for viewing payment proof
    const [selectedProof, setSelectedProof] = useState<{
        url: string;
        title: string;
        isPdf: boolean;
    } | null>(null);

    // Modal state for adding installment
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Sync payments if initialPayments changes
    const syncPayments = useCallback((newPayments: OrderPayment[]) => {
        setPayments(newPayments);
    }, []);

    // Fetch payments for an order from backend
    const fetchPayments = useCallback(async (targetOrderId?: number) => {
        const idToFetch = targetOrderId ?? orderId;
        if (!idToFetch) return [];

        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getPaymentInstallments(idToFetch);
            const sorted = Array.isArray(data)
                ? [...data].sort((a, b) => (a.installmentNo || 0) - (b.installmentNo || 0))
                : [];
            setPayments(sorted);
            return sorted;
        } catch (err: any) {
            const msg = err?.response?.data?.error || err?.message || "Gagal memuat riwayat pembayaran";
            setError(msg);
            console.error("fetchPayments error:", err);
            return [];
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    // Auto sync on mount / order change
    const initialPaymentsLength = initialPayments?.length ?? 0;
    useEffect(() => {
        if (initialPayments && initialPayments.length > 0) {
            setPayments(initialPayments);
        } else if (orderId) {
            fetchPayments(orderId);
        }
    }, [orderId, initialPaymentsLength, fetchPayments]);

    // Record a new payment installment
    const recordPayment = useCallback(async (
        targetOrderIdOrPayload: number | AddPaymentPayload,
        maybePayload?: AddPaymentPayload
    ) => {
        let idToUse: number | undefined;
        let payload: AddPaymentPayload;

        if (typeof targetOrderIdOrPayload === "number") {
            idToUse = targetOrderIdOrPayload;
            payload = maybePayload!;
        } else {
            idToUse = orderId;
            payload = targetOrderIdOrPayload;
        }

        if (!idToUse) {
            const msg = "ID pesanan tidak valid";
            setError(msg);
            throw new Error(msg);
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const res = await orderService.addPaymentInstallment(idToUse, payload as any);
            if (res?.payment) {
                setPayments(prev => {
                    const next = [...prev, res.payment];
                    return next.sort((a, b) => (a.installmentNo || 0) - (b.installmentNo || 0));
                });
            } else {
                await fetchPayments(idToUse);
            }

            if (res?.order && onPaymentAdded) {
                onPaymentAdded(res.order);
            }

            return res;
        } catch (err: any) {
            const msg = err?.response?.data?.error || err?.message || "Gagal mencatat pembayaran";
            setError(msg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [orderId, fetchPayments, onPaymentAdded]);

    // Real-time financial calculations
    const summary: PaymentSummary = useMemo(() => {
        const total = Number(totalAmount) || 0;
        const paid = payments.length > 0
            ? payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
            : (Number(initialPaidAmount) || 0);
        const remaining = Math.max(0, total - paid);
        const paymentType = remaining === 0 && total > 0 ? "FULL" : "DP";

        return {
            totalAmount: total,
            paidAmount: paid,
            remainingAmount: remaining,
            paymentType,
            installmentCount: payments.length
        };
    }, [payments, totalAmount, initialPaidAmount]);

    const openProofModal = useCallback((url: string, title: string = "Bukti Pembayaran") => {
        if (!url) return;
        const isPdf = url.toLowerCase().endsWith(".pdf");
        setSelectedProof({ url, title, isPdf });
    }, []);

    const closeProofModal = useCallback(() => {
        setSelectedProof(null);
    }, []);

    const openAddModal = useCallback(() => {
        setError(null);
        setIsAddModalOpen(true);
    }, []);

    const closeAddModal = useCallback(() => {
        setIsAddModalOpen(false);
        setError(null);
    }, []);

    return {
        payments,
        setPayments,
        syncPayments,
        loading,
        isSubmitting,
        error,
        setError,
        summary,
        selectedProof,
        openProofModal,
        closeProofModal,
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        fetchPayments,
        recordPayment
    };
}
