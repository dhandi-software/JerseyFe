export interface ListCategoryItem {
    id: number;
    uuid?: string;
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
    paginatedProducts: ListCategoryItem[];
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    startItemIndex: number;
    endItemIndex: number;
    handlePageChange: (page: number) => void;
    loading: boolean;
    error: string | null;
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
    handleViewDetail: (product: ListCategoryItem) => void;
    handleCustomize: (product: ListCategoryItem) => void;
    refetch: () => void;
}
