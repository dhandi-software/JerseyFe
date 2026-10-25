import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { formatRupiah } from "~/lib/utils";
import type { CustomJerseyProduct, UseCustomJerseyReturn } from "~/types";

export function useCustomJersey(): UseCustomJerseyReturn {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [jerseyProducts, setJerseyProducts] = useState<CustomJerseyProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi
            .getBahanBaju()
            .then((res) => {
                if (res.status === "success" && Array.isArray(res.data)) {
                    const mapped: CustomJerseyProduct[] = res.data.map((bahan: any) => ({
                        id: bahan.id,
                        title: bahan.nama,
                        category: "Jersey",
                        price: bahan.harga || 150000,
                        status: bahan.status,
                        image: bahan.imageUrl
                            ? `${UPLOADS_URL}${bahan.imageUrl}`
                            : "https://via.placeholder.com/300?text=No+Image",
                        kuantitasKg: bahan.kuantitasKg,
                        rasioKonversi: bahan.rasioKonversi,
                    }));
                    setJerseyProducts(mapped);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredProducts = jerseyProducts.filter((p) => {
        return p.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handlePreview = (product: { id: number }) => {
        navigate(`/customer/custom-jersey/detail/${product.id}`);
    };

    const handleCustomize = (product: { id: number }) => {
        navigate(`/customer/custom-jersey/checkout?productId=${product.id}`);
    };

    return {
        jerseyProducts,
        filteredProducts,
        loading,
        searchQuery,
        setSearchQuery,
        handlePreview,
        handleCustomize,
        formatRupiah,
    };
}
