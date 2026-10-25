export interface TrackingStage {
    id: string;
    label: string;
    icon: any;
    desc: string;
}

export interface UseTrackingPesananReturn {
    orderId: string;
    setOrderId: React.Dispatch<React.SetStateAction<string>>;
    order: any | null;
    setOrder: React.Dispatch<React.SetStateAction<any | null>>;
    loading: boolean;
    error: string;
    feedbackInput: string;
    setFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
    showRevisiForm: boolean;
    setShowRevisiForm: React.Dispatch<React.SetStateAction<boolean>>;
    submittingAction: boolean;
    toast: { title: string; variant: "success" | "destructive" } | null;
    setToast: React.Dispatch<
        React.SetStateAction<{ title: string; variant: "success" | "destructive" } | null>
    >;
    bahanList: any[];
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
    getDisplayStatus: (status: string, isWorking: boolean) => string;
}

export interface UseProgressPesananReturn {
    user: any;
    orders: any[];
    selectedOrder: any | null;
    setSelectedOrder: React.Dispatch<React.SetStateAction<any | null>>;
    loading: boolean;
    feedbackInput: string;
    setFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
    showRevisiForm: boolean;
    setShowRevisiForm: React.Dispatch<React.SetStateAction<boolean>>;
    showLayoutRevisiForm: boolean;
    setShowLayoutRevisiForm: React.Dispatch<React.SetStateAction<boolean>>;
    layoutFeedbackInput: string;
    setLayoutFeedbackInput: React.Dispatch<React.SetStateAction<string>>;
    submittingAction: boolean;
    toast: { title: string; variant: "success" | "destructive" } | null;
    setToast: React.Dispatch<
        React.SetStateAction<{ title: string; variant: "success" | "destructive" } | null>
    >;
    isPrinting: boolean;
    handlePrintInvoice: () => Promise<void>;
    handleApprove: () => Promise<void>;
    handleUnapproveDesign: () => Promise<void>;
    handleRevisi: () => Promise<void>;
    handleApproveLayout: () => Promise<void>;
    handleUnapproveLayout: () => Promise<void>;
    handleRevisiLayout: () => Promise<void>;
    getCurrentStageIndex: (status?: string) => number;
    stages: TrackingStage[];
    getDisplayStatus: (status: string, isWorking: boolean) => string;
}
