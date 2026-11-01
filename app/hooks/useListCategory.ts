import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { adminApi } from "~/api/admin";
import { isSeededDummyBahan } from "~/api/productApi";
import { UPLOADS_URL } from "~/api/client";
import { useCart } from "~/context/CartContext";
import { formatRupiah } from "~/lib/utils";
import type { ListCategoryItem, UseListCategoryReturn } from "~/types";

export const CATEGORY_OPTIONS = ["Semua", "Jersey"];
export const DESKTOP_ITEMS_PER_PAGE = 25; // 5x5 grid
export const MOBILE_ITEMS_PER_PAGE = 8; // 2x4 grid

export function useListCategory(
    itemsPerPage: number = DESKTOP_ITEMS_PER_PAGE,
): UseListCategoryReturn {
    const navigate = useNavigate();
    const { cart, subtotal } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [currentPage, setCurrentPage] = useState(1);
    const [uangDiterima, setUangDiterima] = useState("");
    const [materials, setMaterials] = useState<ListCategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMaterials = useCallback(() => {
        setLoading(true);
        setError(null);
        adminApi
            .getBahanBaju()
            .then((res) => {
                if (res.status === "success" && Array.isArray(res.data)) {
                    const adminItems = res.data.filter(
                        (m: any) => !isSeededDummyBahan(m),
                    );
                    const mapped: ListCategoryItem[] = adminItems.map((m: any) => ({
                        id: m.id,
                        uuid: m.uuid,
                        title: m.nama,
                        price: Number(m.harga) || 0,
                        image: m.imageUrl
                            ? m.imageUrl.startsWith("http")
                                ? m.imageUrl
                                : `${UPLOADS_URL}${m.imageUrl}`
                            : "/images/GambarBaju.png",
                        category: "Jersey",
                        status: m.status,
                        kuantitasKg: m.kuantitasKg,
                        rasioKonversi: m.rasioKonversi,
                        description:
                            m.deskripsi ||
                            "Bahan jersey pilihan FCSV Apparel untuk produksi seragam olahraga custom.",
                    }));
                    setMaterials(mapped);
                } else {
                    setMaterials([]);
                }
            })
            .catch((err) => {
                console.error("Gagal memuat bahan baju:", err);
                setError(
                    err?.message ||
                        "Tidak dapat terhubung ke server untuk memuat katalog bahan.",
                );
                setMaterials([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const filteredProducts = materials.filter((p) => {
        const matchesCategory =
            selectedCategory === "Semua" || p.category === selectedCategory;
        const cleanQuery = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !cleanQuery ||
            p.title.toLowerCase().includes(cleanQuery) ||
            (p.description || "").toLowerCase().includes(cleanQuery);
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / itemsPerPage),
    );
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage,
    );
    const startItemIndex = filteredProducts.length === 0 ? 0 : startIndex + 1;
    const endItemIndex = Math.min(
        startIndex + itemsPerPage,
        filteredProducts.length,
    );

    const handlePageChange = (page: number) => {
        const nextPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(nextPage);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const uangNumber = Number(uangDiterima) || 0;
    const kembalian = uangNumber > 0 ? uangNumber - subtotal : 0;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        navigate("/customer/custom-jersey/checkout");
    };

    const handleViewDetail = (product: ListCategoryItem) => {
        navigate(`/product/${product.uuid || product.id}`);
    };

    const handleCustomize = (product: ListCategoryItem) => {
        navigate(`/customer/custom-jersey/detail/${product.uuid || product.id}`);
    };

    return {
        materials,
        filteredProducts,
        paginatedProducts,
        currentPage: safeCurrentPage,
        totalPages,
        itemsPerPage,
        startItemIndex,
        endItemIndex,
        handlePageChange,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories: CATEGORY_OPTIONS,
        uangDiterima,
        setUangDiterima,
        kembalian,
        formatRupiah,
        handleCheckout,
        handleViewDetail,
        handleCustomize,
        refetch: fetchMaterials,
    };
}
