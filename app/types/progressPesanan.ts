import type React from "react";
import type {
    CustomerOrderSharedActionsReturn,
    CustomerTrackedOrder,
    TrackingStage,
    TrackingToastMessage,
} from "./trackingPesanan";

export type ProgressStage = TrackingStage;
export type ProgressToastMessage = TrackingToastMessage;

export interface UseProgressPesananReturn
    extends Omit<CustomerOrderSharedActionsReturn, "setSubmittingAction"> {
    user: any;
    orders: CustomerTrackedOrder[];
    selectedOrder: CustomerTrackedOrder | null;
    setSelectedOrder: React.Dispatch<React.SetStateAction<CustomerTrackedOrder | null>>;
    loading: boolean;
    showLayoutRevisiForm: boolean;
    setShowLayoutRevisiForm: React.Dispatch<React.SetStateAction<boolean>>;
    layoutFeedbackInput: string;
    setLayoutFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
    handleApproveLayout: () => Promise<void>;
    handleUnapproveLayout: () => Promise<void>;
    handleRevisiLayout: () => Promise<void>;
    getCurrentStageIndex: (status?: string) => number;
    stages: ProgressStage[];
}

export interface ProgressOrderListSectionProps {
    orders: CustomerTrackedOrder[];
    loading: boolean;
    onSelectOrder: (order: CustomerTrackedOrder) => void;
    getDisplayStatus: (status: string, isWorking?: boolean) => string;
    variant?: "desktop" | "mobile";
}
