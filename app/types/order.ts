export type OrderStatus = 
    | "MENUNGGU" 
    | "DESAIN" 
    | "LAYOUT" 
    | "CETAK" 
    | "FINISHING" 
    | "PACKING" 
    | "SELESAI" 
    | "DIBATALKAN"
    | string;

export type PaymentType = "FULL" | "DP" | string;

export type ShippingMethod = "PICKUP" | "COD" | "JNE" | "JNT" | "SICEPAT" | string;

export interface OrderDetailPayload {
    productId: number | null;
    productTitle: string;
    playerName: string;
    playerNumber: string;
    playerSize: string;
    unitPrice: number;
    statusBaju?: boolean;
    statusCelana?: boolean;
}

export interface CreateOrderPayload {
    customerId: number;
    materialId: number | null;
    materialName: string | null;
    materialPrice: number;
    subtotalAmount: number;
    discount: number;
    totalAmount: number;
    paymentType: PaymentType;
    paidAmount: number;
    remainingAmount: number;
    designNote?: string;
    designUrl?: string;
    paymentUrl?: string;
    shippingMethod: string;
    shippingAddress?: string;
    customerName: string;
    customerPhone: string;
    details: OrderDetailPayload[];
}

export interface OrderToast {
    show: boolean;
    message: string;
    variant: "success" | "destructive" | "default";
}

export interface UseOrderSubmissionOptions {
    editOrderId?: string | null;
    existingOrder?: any | null;
    materialPricing: {
        activeProduct: any | null;
        isCustomMaterial: boolean;
        customMaterialName: string;
        effectiveBasePrice: number;
        subtotalCalculated: number;
        discountAmount: number;
        totalCalculated: number;
        isOverLimit: boolean;
        availableKg: number;
        totalRequiredKg: number;
    };
    playerManager: {
        customDetails: any[];
        pdfFile: File | null;
        validatePlayerRows: () => { isValid: boolean; invalidIndex: number };
    };
    onSuccess?: () => void;
}

export interface UseOrderSubmissionReturn {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    handleNextStep: () => void;
    customerName: string;
    setCustomerName: React.Dispatch<React.SetStateAction<string>>;
    customerPhone: string;
    setCustomerPhone: (val: string) => void;
    designNote: string;
    setDesignNote: React.Dispatch<React.SetStateAction<string>>;
    designReferenceFile: File | null;
    setDesignReferenceFile: React.Dispatch<React.SetStateAction<File | null>>;
    paymentProofFile: File | null;
    setPaymentProofFile: React.Dispatch<React.SetStateAction<File | null>>;
    paymentType: PaymentType;
    setPaymentType: React.Dispatch<React.SetStateAction<PaymentType>>;
    dpAmountInput: number;
    setDpAmountInput: React.Dispatch<React.SetStateAction<number>>;
    effectivePaidAmount: number;
    effectiveRemainingAmount: number;
    shippingMethod: string;
    setShippingMethod: React.Dispatch<React.SetStateAction<string>>;
    shippingAddress: string;
    setShippingAddress: React.Dispatch<React.SetStateAction<string>>;
    isUploading: boolean;
    uploadProgress: number;
    toast: OrderToast;
    setToast: React.Dispatch<React.SetStateAction<OrderToast>>;
    showValidation: boolean;
    setShowValidation: React.Dispatch<React.SetStateAction<boolean>>;
    isStepValid: () => boolean;
    validateAndFocusCurrentStep: () => boolean;
    scrollToElementAndFocus: (
        elementId: string, 
        options?: { focusSelector?: string; clickTrigger?: boolean }
    ) => void;
    handleSubmit: () => Promise<void>;
    isEditing: boolean;
    editOrderId: string | null;
    existingOrder: any | null;
}
