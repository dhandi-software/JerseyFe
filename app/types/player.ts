export type PlayerSize = 
    | "XXS" 
    | "XS" 
    | "S" 
    | "M" 
    | "L" 
    | "XL" 
    | "XXL" 
    | "2XL" 
    | "3XL" 
    | "4XL" 
    | "5XL"
    | string;

export type PlayerSleeve = "Lengan Pendek" | "Lengan Panjang" | string;

export interface PlayerRow {
    id: string;
    productId: number;
    productTitle: string;
    price: number;
    unitPrice?: number;
    image?: string;
    name: string;
    number: string;
    size: string;
    sleeve: string;
}

export interface UsePlayerTableManagerOptions {
    activeProduct: { id: number; title: string; price: number; image?: string; rasioKonversi?: number } | null;
    effectiveBasePrice: number;
    isCustomMaterial: boolean;
    customMaterialName: string;
    sizeParam?: string;
    sleeveParam?: string;
    cartLength?: number;
    cartItems?: Array<{ product: any; quantity: number }>;
    isEditing?: boolean;
    editOrderId?: string | null;
    onToast?: (toast: { show: boolean; message: string; variant: "success" | "destructive" | "default" }) => void;
}

export interface UsePlayerTableManagerReturn {
    customDetails: PlayerRow[];
    setCustomDetails: React.Dispatch<React.SetStateAction<PlayerRow[]>>;
    handleDetailChange: (id: string, field: keyof PlayerRow, value: string) => void;
    handleAddMember: (productId: number) => void;
    handleRemoveMember: (id: string) => void;
    generateTable: () => void;
    resetTable: () => void;
    handlePasteSubmit: () => void;
    handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleTextareaPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    handlePdfImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isPasteDialogOpen: boolean;
    setIsPasteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pasteText: string;
    setPasteText: React.Dispatch<React.SetStateAction<string>>;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    isResetDialogOpen: boolean;
    setIsResetDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    playerCountInput: string;
    setPlayerCountInput: React.Dispatch<React.SetStateAction<string>>;
    pdfFile: File | null;
    setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
    validatePlayerRows: () => { isValid: boolean; invalidIndex: number };
}
