import type { StorageLocation } from "./storageLocation";

export type PackingFilterTab = "ALL" | "PRINT" | "FINISHING" | "SELESAI";

export interface PackingPlayerInfo {
    id?: number;
    name: string;
    number: string;
    size: string;
    sleeve: string;
    playerSize?: string;
    statusBaju?: boolean;
    statusCelana?: boolean;
}

export interface PackingOrderItem {
    id: string;
    rawId: number;
    customer: string;
    product: string;
    qty: number;
    status: string;
    queueNumber: string;
    mockupUrl: string | null;
    layoutUrl: string | null;
    dateTime: string;
    playerInfo: PackingPlayerInfo[];
    designNote?: string;
    storageLocationId?: number | null;
    storageLocation?: StorageLocation | null;
}

export interface PackingConfirmModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}

export interface UsePackingReturn {
    user: any;
    orders: PackingOrderItem[];
    loading: boolean;
    selectedOrder: PackingOrderItem | null;
    setSelectedOrder: React.Dispatch<React.SetStateAction<PackingOrderItem | null>>;
    filterTab: PackingFilterTab;
    setFilterTab: React.Dispatch<React.SetStateAction<PackingFilterTab>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    toast: { title: string; variant: "success" | "destructive" } | null;
    setToast: React.Dispatch<
        React.SetStateAction<{ title: string; variant: "success" | "destructive" } | null>
    >;
    confirmModal: PackingConfirmModalState;
    setConfirmModal: React.Dispatch<React.SetStateAction<PackingConfirmModalState>>;
    filteredOrders: PackingOrderItem[];
    sortedOrders: PackingOrderItem[];
    handleUpdateStatus: (id: number, newStatus: string) => void;
    requestConfirmation: (
        title: string,
        message: string,
        onConfirm: () => void,
    ) => void;
    getStatusStyle: (status: string) => string;
    handleToggleDetailStatus: (
        orderRawId: number,
        detailId: number,
        field: "statusBaju" | "statusCelana"
    ) => Promise<void>;
    handleAssignStorageLocation: (
        orderRawId: number,
        storageLocationId: number | null
    ) => Promise<void>;
}
