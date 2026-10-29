import type { MonitoringOrder, BahanItem, DesignerItem, ToastState } from "~/types";

export interface DetailCommonProps {
    selectedOrder: MonitoringOrder;
    toast: ToastState | null;
    onCloseToast: () => void;
    bahanList: BahanItem[];
    designers: DesignerItem[];
    isRecommendModalOpen: boolean;
    setIsRecommendModalOpen: (open: boolean) => void;
    tempRecommendedIds: number[];
    setTempRecommendedIds: React.Dispatch<React.SetStateAction<number[]>>;
    handleSendRecommendations: () => Promise<void>;
    isPrinting: boolean;
    handlePrintInvoice: () => Promise<void>;
    isUploadingProof: boolean;
    handleUploadProof: (e: React.ChangeEvent<HTMLInputElement>, slot?: "DP" | "FULL") => Promise<void>;
    isUploadingPrint: boolean;
    handleUploadPrint: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploadingFinishing: boolean;
    handleUploadFinishing: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleUpdateStatus: (id: number, newStatus: string, designerId?: number) => Promise<void>;
    handleApproveDesign: (id: number) => Promise<void>;
    handleRevisiDesign: (id: number, feedback: string) => Promise<void>;
    handleApproveLayout: (id: number) => Promise<void>;
    handleRevisiLayout: (id: number, feedback: string) => Promise<void>;
    isAssignModalOpen: boolean;
    setIsAssignModalOpen: (open: boolean) => void;
    selectedDesignerId: number | "";
    setSelectedDesignerId: (id: number | "") => void;
    orderToAssign: number | null;
    setOrderToAssign: (id: number | null) => void;
    handleUpdateNotesAndVideo?: (orderId: number, data: { videoUrl?: string; adminNote?: string; designNote?: string }) => Promise<any>;
    handleToggleMemberStatus?: (orderId: number, detailId: number, field: "statusBaju" | "statusCelana") => void;
    handleAddMember?: (orderId: number, data: { playerName: string; playerNumber?: string; playerSize: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    handleEditMember?: (orderId: number, detailId: number, data: { playerName?: string; playerNumber?: string; playerSize?: string; statusBaju?: boolean; statusCelana?: boolean }) => Promise<any>;
    handleDeleteMember?: (orderId: number, detailId: number) => Promise<any>;
}
