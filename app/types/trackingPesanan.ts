import type React from "react";
import type { LucideIcon } from "lucide-react";

export interface TrackingStage {
    id: string;
    label: string;
    icon: LucideIcon;
    desc: string;
}

export interface CustomerOrderPlayerDetail {
    id?: number;
    productId?: number;
    productTitle?: string;
    playerName?: string;
    playerNumber?: string;
    playerSize?: string;
    statusBaju?: boolean;
    statusCelana?: boolean;
}

export interface AlternativeBahan {
    id: number;
    nama: string;
    harga?: number;
    imageUrl?: string | null;
}

export interface CustomerTrackedOrder {
    id: number;
    orderId: string;
    queueNumber?: string | null;
    customerId?: number | null;
    customerName?: string;
    customerPhone?: string | null;
    designerId?: number | null;
    designerName?: string;
    status: string;
    isWorking?: boolean;
    totalAmount?: number;
    paidAmount?: number;
    remainingAmount?: number;
    paymentType?: string;
    paymentUrl?: string | null;
    designUrl?: string | null;
    designNote?: string | null;
    adminNote?: string | null;
    videoUrl?: string | null;
    mockupUrl?: string | null;
    designStatus?: "PENDING" | "SENT" | "APPROVED" | "REVISI" | string;
    designFeedback?: string | null;
    layoutUrl?: string | null;
    layoutStatus?: "PENDING" | "SENT" | "APPROVED" | "REVISI" | string;
    layoutFeedback?: string | null;
    printUrl?: string | null;
    finishingUrl?: string | null;
    shippingMethod?: "PICKUP" | "COD" | string;
    shippingAddress?: string | null;
    recommendedBahanIds?: number[];
    createdAt: string;
    details?: CustomerOrderPlayerDetail[];
}

export interface TrackingToastMessage {
    title: string;
    variant: "success" | "destructive";
}

export interface UseTrackingPesananReturn {
    orderId: string;
    setOrderId: React.Dispatch<React.SetStateAction<string>>;
    order: CustomerTrackedOrder | null;
    setOrder: React.Dispatch<React.SetStateAction<CustomerTrackedOrder | null>>;
    loading: boolean;
    error: string;
    memberSearch: string;
    setMemberSearch: React.Dispatch<React.SetStateAction<string>>;
    filteredPlayers: CustomerOrderPlayerDetail[];
    totalPlayers: number;
    feedbackInput: string;
    setFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
    showRevisiForm: boolean;
    setShowRevisiForm: React.Dispatch<React.SetStateAction<boolean>>;
    submittingAction: boolean;
    toast: TrackingToastMessage | null;
    setToast: React.Dispatch<React.SetStateAction<TrackingToastMessage | null>>;
    bahanList: AlternativeBahan[];
    isPrinting: boolean;
    handlePrintInvoice: () => Promise<void>;
    executeSearch: (idToSearch: string) => Promise<void>;
    handleApprove: () => Promise<void>;
    handleUnapproveDesign: () => Promise<void>;
    handleRevisi: () => Promise<void>;
    handleSelectAlternative: (bahanId: number | string) => Promise<void>;
    handleSearch: (e: React.FormEvent) => Promise<void>;
    getCurrentStageIndex: () => number;
    stages: TrackingStage[];
    getDisplayStatus: (status: string, isWorking?: boolean) => string;
}

export interface CustomerOrderStepperProps {
    order: CustomerTrackedOrder;
    stages: TrackingStage[];
    currentStageIndex: number;
    displayStatus: string;
    variant?: "desktop" | "mobile";
    mobileHeaderMode?: "orderId" | "productTitle";
    children?: React.ReactNode;
}

export interface CustomerDesignApprovalCardProps {
    mode: "design" | "layout";
    variant?: "desktop" | "mobile";
    fileUrl?: string | null;
    status?: string | null;
    feedback?: string | null;
    interactive?: boolean;
    canUnapprove?: boolean;
    submittingAction?: boolean;
    showRevisiForm?: boolean;
    onToggleRevisiForm?: (show: boolean) => void;
    feedbackInput?: string;
    onFeedbackInputChange?: (value: string) => void;
    onApprove?: () => void;
    onUnapprove?: () => void;
    onSubmitRevisi?: () => void;
    className?: string;
}

export interface CustomerAlternativeFabricBannerProps {
    order: CustomerTrackedOrder;
    bahanList: AlternativeBahan[];
    onSelectAlternative: (bahanId: number | string) => void;
    variant?: "desktop" | "mobile";
}

export interface CustomerProgressMediaAndInfoSectionProps {
    order: CustomerTrackedOrder;
    isPrinting: boolean;
    onPrintInvoice: () => void;
    variant?: "desktop" | "mobile";
}

export interface CustomerTrackingSummaryGridProps {
    order: CustomerTrackedOrder;
    isPrinting?: boolean;
    onPrintInvoice?: () => void;
    sectionMode?: "both" | "orderSummaryOnly" | "shippingOnly";
    variant?: "desktop" | "mobile";
}

export interface TrackingHeroHeaderProps {
    orderId: string;
    onOrderIdChange: (value: string) => void;
    loading: boolean;
    onSearch: (e: React.FormEvent) => void;
    variant?: "desktop" | "mobile";
}

export interface TrackingGuideSectionProps {
    stages: TrackingStage[];
    variant?: "desktop" | "mobile";
}

export interface CustomerProductionNotesVideoSectionProps {
    order: CustomerTrackedOrder;
    variant?: "desktop" | "mobile";
}

export interface CustomerPlayerListSectionProps {
    players: CustomerOrderPlayerDetail[];
    totalPlayers: number;
    memberSearch: string;
    onMemberSearchChange: (value: string) => void;
    variant?: "desktop" | "mobile";
}

export interface CustomerSupportBannerProps {
    orderId?: string;
    variant?: "desktop" | "mobile";
}
