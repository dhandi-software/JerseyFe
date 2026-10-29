import type React from "react";
import type {
    CustomerOrderPlayerDetail,
    CustomerTrackedOrder,
    TrackingStage,
    TrackingToastMessage,
} from "./trackingPesanan";

export type ProgressStage = TrackingStage;
export type ProgressToastMessage = TrackingToastMessage;

export interface UseProgressPesananReturn {
    user: any;
    orders: CustomerTrackedOrder[];
    selectedOrder: CustomerTrackedOrder | null;
    setSelectedOrder: React.Dispatch<React.SetStateAction<CustomerTrackedOrder | null>>;
    loading: boolean;
    memberSearch: string;
    setMemberSearch: React.Dispatch<React.SetStateAction<string>>;
    filteredPlayers: CustomerOrderPlayerDetail[];
    totalPlayers: number;
    feedbackInput: string;
    setFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
    showRevisiForm: boolean;
    setShowRevisiForm: React.Dispatch<React.SetStateAction<boolean>>;
    showLayoutRevisiForm: boolean;
    setShowLayoutRevisiForm: React.Dispatch<React.SetStateAction<boolean>>;
    layoutFeedbackInput: string;
    setLayoutFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
    submittingAction: boolean;
    toast: ProgressToastMessage | null;
    setToast: React.Dispatch<React.SetStateAction<ProgressToastMessage | null>>;
    isPrinting: boolean;
    handlePrintInvoice: () => Promise<void>;
    handleApprove: () => Promise<void>;
    handleUnapproveDesign: () => Promise<void>;
    handleRevisi: () => Promise<void>;
    handleApproveLayout: () => Promise<void>;
    handleUnapproveLayout: () => Promise<void>;
    handleRevisiLayout: () => Promise<void>;
    getCurrentStageIndex: (status?: string) => number;
    stages: ProgressStage[];
    getDisplayStatus: (status: string, isWorking?: boolean) => string;
}

export interface ProgressOrderListSectionProps {
    orders: CustomerTrackedOrder[];
    loading: boolean;
    onSelectOrder: (order: CustomerTrackedOrder) => void;
    getDisplayStatus: (status: string, isWorking?: boolean) => string;
    variant?: "desktop" | "mobile";
}
