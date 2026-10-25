export type GudangTab = "penyubliman" | "katalog" | "pesanan" | "riwayat";
export type GudangStockFilter = "all" | "low" | "empty";
export type GudangAdjustAction = "TAMBAH" | "KURANG";

export interface GudangEditFormState {
    nama: string;
    deskripsi: string;
    kuantitasKg: number;
    rasioKonversi: string | number;
    harga: number;
    status: string;
}

export interface UseDashboardGudangReturn {
    user: any;
    navigate: any;
    activeTab: GudangTab;
    setActiveTab: React.Dispatch<React.SetStateAction<GudangTab>>;
    bahanList: any[];
    historyList: any[];
    ordersList: any[];
    loading: boolean;
    toast: { title: string; variant: "success" | "destructive" } | null;
    setToast: React.Dispatch<
        React.SetStateAction<{ title: string; variant: "success" | "destructive" } | null>
    >;
    previewImage: string | null;
    setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>;
    previewMockup: string | null;
    setPreviewMockup: React.Dispatch<React.SetStateAction<string | null>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    stockFilter: GudangStockFilter;
    setStockFilter: React.Dispatch<React.SetStateAction<GudangStockFilter>>;
    logSearchQuery: string;
    setLogSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    finishingSearch: string;
    setFinishingSearch: React.Dispatch<React.SetStateAction<string>>;
    expandedOrderId: string | null;
    setExpandedOrderId: React.Dispatch<React.SetStateAction<string | null>>;
    packingLoading: boolean;
    confirmPackingModal: { isOpen: boolean; order: any | null };
    setConfirmPackingModal: React.Dispatch<
        React.SetStateAction<{ isOpen: boolean; order: any | null }>
    >;
    isAdjustModalOpen: boolean;
    setIsAdjustModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    adjustItem: any;
    setAdjustItem: React.Dispatch<React.SetStateAction<any>>;
    adjustAction: GudangAdjustAction;
    setAdjustAction: React.Dispatch<React.SetStateAction<GudangAdjustAction>>;
    adjustAmount: number;
    setAdjustAmount: React.Dispatch<React.SetStateAction<number>>;
    adjustNote: string;
    setAdjustNote: React.Dispatch<React.SetStateAction<string>>;
    adjustLoading: boolean;
    selectedDetailItem: any;
    setSelectedDetailItem: React.Dispatch<React.SetStateAction<any>>;
    isEditModalOpen: boolean;
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editItem: any;
    setEditItem: React.Dispatch<React.SetStateAction<any>>;
    editLoading: boolean;
    editForm: GudangEditFormState;
    setEditForm: React.Dispatch<React.SetStateAction<GudangEditFormState>>;
    parsedEditRasio: number;
    editImage: File | null;
    setEditImage: React.Dispatch<React.SetStateAction<File | null>>;
    editImagePreview: string | null;
    setEditImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
    deleteExistingImage: boolean;
    setDeleteExistingImage: React.Dispatch<React.SetStateAction<boolean>>;
    editFileInputRef: React.RefObject<HTMLInputElement | null>;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    deleteItem: any;
    setDeleteItem: React.Dispatch<React.SetStateAction<any>>;
    deleteLoading: boolean;
    sortColumn: "nama" | "kuantitasKg" | "harga" | null;
    setSortColumn: React.Dispatch<
        React.SetStateAction<"nama" | "kuantitasKg" | "harga" | null>
    >;
    sortDirection: "asc" | "desc";
    setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
    toggleSort: (col: "nama" | "kuantitasKg" | "harga") => void;
    filteredBahan: any[];
    sortedBahan: any[];
    filteredHistory: any[];
    totalMaterialsCount: number;
    totalKetersediaanKg: number;
    totalKetersediaanMeter: number;
    lowStockCount: number;
    outOfStockCount: number;
    fetchData: () => Promise<void>;
    handleOpenAdjust: (item: any) => void;
    handleAdjustSubmit: (e: React.FormEvent) => Promise<void>;
    handleOpenEdit: (item: any) => void;
    handleEditImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditSubmit: (e: React.FormEvent) => Promise<void>;
    handleOpenDelete: (item: any) => void;
    handleDeleteSubmit: (e: React.FormEvent) => Promise<void>;
    handleFinishPacking: (order: any) => Promise<void>;
    formatThousands: (value: number | string) => string;
}
