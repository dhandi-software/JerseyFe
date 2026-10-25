export interface ListCategoryItem {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    status?: string;
    kuantitasKg?: number;
    rasioKonversi?: number;
    description?: string;
}

export interface UseListCategoryReturn {
    materials: ListCategoryItem[];
    filteredProducts: ListCategoryItem[];
    loading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    categories: string[];
    uangDiterima: string;
    setUangDiterima: (val: string) => void;
    kembalian: number;
    formatRupiah: (number: number) => string;
    handleCheckout: () => void;
}
