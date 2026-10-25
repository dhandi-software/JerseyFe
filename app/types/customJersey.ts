export interface CustomJerseyProduct {
    id: number;
    title: string;
    category: string;
    price: number;
    status?: string;
    image: string;
    kuantitasKg?: number;
    rasioKonversi?: number;
}

export interface UseCustomJerseyReturn {
    jerseyProducts: CustomJerseyProduct[];
    filteredProducts: CustomJerseyProduct[];
    loading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handlePreview: (product: { id: number }) => void;
    handleCustomize: (product: { id: number }) => void;
    formatRupiah: (number: number) => string;
}

export interface UseCustomJerseyDetailReturn {
    loading: boolean;
    bahanList: any[];
    currentBahan: any | null;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    selectedSleeve: string;
    setSelectedSleeve: (sleeve: string) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    playerName: string;
    setPlayerName: (name: string) => void;
    playerNumber: string;
    setPlayerNumber: (num: string) => void;
    formatRupiah: (number: number) => string;
    getSizeSurcharge: (size: string) => number;
    isBigSize: (size: string) => boolean;
    getMaxOrderPcs: (kuantitasKg: number, size: string, sleeve: string) => number | string;
    handlePrev: () => void;
    handleNext: () => void;
    handleDirectOrder: () => void;
    handleAddToCart: () => void;
}

export interface CustomJerseyDetailItem {
    id: string;
    productId: number;
    productTitle: string;
    price: number;
    image: string;
    name: string;
    number: string;
    size: string;
    sleeve: string;
}

export interface CustomJerseyCheckoutStep {
    id: number;
    name: string;
    icon: any;
}

export interface UseCustomJerseyCheckoutReturn {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    activeProduct: any | null;
    activeBahan: any | null;
    allBahan: any[];
    availableKg: number;
    customDetails: CustomJerseyDetailItem[];
    setCustomDetails: React.Dispatch<React.SetStateAction<CustomJerseyDetailItem[]>>;
    designNote: string;
    setDesignNote: (val: string) => void;
    designReferenceFile: File | null;
    setDesignReferenceFile: (file: File | null) => void;
    paymentProofFile: File | null;
    setPaymentProofFile: (file: File | null) => void;
    paymentType: "FULL" | "DP";
    setPaymentType: (type: "FULL" | "DP") => void;
    dpAmountInput: number;
    setDpAmountInput: (val: number) => void;
    pdfFile: File | null;
    setPdfFile: (file: File | null) => void;
    isUploading: boolean;
    uploadProgress: number;
    shippingMethod: string;
    setShippingMethod: (method: string) => void;
    shippingAddress: string;
    setShippingAddress: (addr: string) => void;
    pasteText: string;
    setPasteText: (text: string) => void;
    isPasteDialogOpen: boolean;
    setIsPasteDialogOpen: (open: boolean) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    isResetDialogOpen: boolean;
    setIsResetDialogOpen: (open: boolean) => void;
    playerCountInput: string;
    setPlayerCountInput: (val: string) => void;
    showValidation: boolean;
    setShowValidation: (val: boolean) => void;
    totalRequiredKg: number;
    isOverLimit: boolean;
    toast: { show: boolean; message: string; variant: "success" | "destructive" | "default" };
    setToast: React.Dispatch<React.SetStateAction<{ show: boolean; message: string; variant: "success" | "destructive" | "default" }>>;
    user: any | null;
    existingOrder: any | null;
    setExistingOrder: React.Dispatch<React.SetStateAction<any | null>>;
    isEditing: boolean;
    steps: CustomJerseyCheckoutStep[];
    formatRupiah: (num: number) => string;
    getSizeSurcharge: (size: string) => number;
    generateTable: () => void;
    resetTable: () => void;
    parsePasteData: () => void;
    handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleTextareaPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    removeUnit: (id: string) => void;
    updateUnitQuantity: (productId: number, delta: number) => void;
    handleDetailChange: (id: string, field: string, value: string) => void;
    handlePdfImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isStepValid: () => boolean;
    handleNextStep: () => void;
    handleSubmit: () => Promise<void>;
    totalCalculated: number;
    effectivePaidAmount: number;
    effectiveRemainingAmount: number;
}
