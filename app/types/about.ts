import type { HomeCompanyProfileInfo } from "./landing";

export interface AboutMaterialItem {
    id: number;
    uuid?: string;
    nama: string;
    deskripsi?: string | null;
    harga: number;
    kuantitasKg?: number;
    rasioKonversi?: number;
    status?: string;
    imageUrl?: string | null;
}

export interface AboutProductionStageItem {
    step: string;
    title: string;
    description: string;
}

export interface AboutServiceSpecItem {
    label: string;
    value: string;
}

export interface UseAboutReturn {
    companyProfile: HomeCompanyProfileInfo;
    materials: AboutMaterialItem[];
    loading: boolean;
    error: string | null;
    currentIndex: number;
    currentItem: AboutMaterialItem | null;
    currentImageSrc: string | null;
    currentProductHref: string;
    formattedCurrentPrice: string;
    productionStages: AboutProductionStageItem[];
    serviceSpecs: AboutServiceSpecItem[];
    setCurrentIndex: (index: number) => void;
    handleNext: () => void;
    handlePrev: () => void;
    fetchMaterials: () => void;
    formatPrice: (price?: number) => string;
}

