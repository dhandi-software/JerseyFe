export type DesainFilterTab = "ALL" | "WAITING" | "PROCESSING" | "COMPLETED";

export interface DesainPlayerInfo {
    name: string;
    number: string;
    size: string;
    sleeve?: string;
}

export interface DesainOrderItem {
    id: string;
    rawId: number;
    customer: string;
    product: string;
    qty: number;
    status: string;
    queueNumber: string;
    isWorking: boolean;
    mockupUrl: string | null;
    designStatus: string | null;
    designFeedback: string | null;
    layoutUrl: string | null;
    layoutStatus: string | null;
    layoutFeedback: string | null;
    dateTime: string;
    playerInfo: DesainPlayerInfo[];
    designNote?: string;
    designUrl?: string;
    customerId?: number | string;
    totalAmount?: number;
}

export interface DesainConfirmModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

export interface UseDashboardDesainReturn {
    user: any;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    orders: DesainOrderItem[];
    loading: boolean;
    selectedOrder: DesainOrderItem | null;
    setSelectedOrder: React.Dispatch<React.SetStateAction<DesainOrderItem | null>>;
    filterTab: DesainFilterTab;
    setFilterTab: React.Dispatch<React.SetStateAction<DesainFilterTab>>;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    uploading: boolean;
    toast: { title: string; variant: "success" | "destructive" } | null;
    setToast: React.Dispatch<
        React.SetStateAction<{ title: string; variant: "success" | "destructive" } | null>
    >;
    isDragging: boolean;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    windowDragging: boolean;
    confirmModal: DesainConfirmModalState;
    setConfirmModal: React.Dispatch<React.SetStateAction<DesainConfirmModalState>>;
    filteredOrders: DesainOrderItem[];
    sortedOrders: DesainOrderItem[];
    canUpload: boolean | null;
    canUploadLayout: boolean | null;
    handleUpdateStatus: (id: number, newStatus: string, isWorking?: boolean) => void;
    handleCancelMockup: () => Promise<void>;
    handleUploadMockup: (
        fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    ) => Promise<void>;
    handleCancelLayout: () => Promise<void>;
    handleUploadLayout: (
        fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    ) => Promise<void>;
    requestConfirmation: (
        title: string,
        message: string,
        onConfirm: () => void,
    ) => void;
    getStatusStyle: (status: string) => string;
}
