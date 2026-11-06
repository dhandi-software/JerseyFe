export interface BahanBajuItem {
    id: number;
    nama: string;
    harga?: number;
    kuantitasKg?: number;
    rasioKonversi?: number;
    status?: string;
    imageUrl?: string;
    deskripsi?: string;
}

export type MaterialOption = BahanBajuItem;

export interface MaterialProduct {
    id: number;
    title: string;
    price: number;
    status?: string;
    kuantitasKg?: number;
    rasioKonversi?: number;
    image?: string;
}

export interface UseMaterialPricingOptions {
    productIdParam?: string | null;
    cartProduct?: MaterialProduct | null;
    playerRows: Array<{ size: string; sleeve: string }>;
    initialMaterialState?: {
        materialId?: number | null;
        materialName?: string | null;
        materialPrice?: number | null;
        discount?: number | null;
    };
}

export interface MaterialPricingState {
    allBahan: BahanBajuItem[];
    activeProduct: MaterialProduct | null;
    activeBahan: BahanBajuItem | undefined;
    isLoadingProduct: boolean;
    availableKg: number;
    selectedBahanId: string;
    isCustomMaterial: boolean;
    setIsCustomMaterial: React.Dispatch<React.SetStateAction<boolean>>;
    customMaterialName: string;
    setCustomMaterialName: (val: string) => void;
    materialPriceInput: number;
    setMaterialPriceInput: (val: number) => void;
    discountInput: number;
    setDiscountInput: React.Dispatch<React.SetStateAction<number>>;
    effectiveBasePrice: number;
    subtotalCalculated: number;
    discountAmount: number;
    totalCalculated: number;
    totalRequiredKg: number;
    isOverLimit: boolean;
    handleSelectBahan: (val: string) => void;
    registerCreatedBahan: (newBahan: BahanBajuItem) => void;
    setDirectProduct: React.Dispatch<React.SetStateAction<MaterialProduct | null>>;
    setMaterialPriceInputState: React.Dispatch<React.SetStateAction<number>>;
    setCustomMaterialNameState: React.Dispatch<React.SetStateAction<string>>;
}

export type UseMaterialPricingReturn = MaterialPricingState;
