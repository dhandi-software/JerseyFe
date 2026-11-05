export interface OrderPayment {
    id: number;
    orderId: number;
    installmentNo: number;
    stage: "DP" | "PELUNASAN" | string;
    amount: number;
    paymentMethod?: string | null;
    proofUrl?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface PaymentSummary {
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paymentType: "FULL" | "DP" | string;
    installmentCount: number;
}

export interface AddPaymentPayload {
    amount: number;
    stage?: string;
    paymentMethod?: string;
    proofUrl?: string | null;
    notes?: string | null;
}
