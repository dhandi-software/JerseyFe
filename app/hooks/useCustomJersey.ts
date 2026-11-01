import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { adminApi } from "~/api/admin";
import { isSeededDummyBahan } from "~/api/productApi";
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
                    const adminItems = res.data.filter(
                        (bahan: any) => !isSeededDummyBahan(bahan),
                    );
                    const mapped: CustomJerseyProduct[] = adminItems.map((bahan: any) => ({
                        id: bahan.id,
                        uuid: bahan.uuid,
                        title: bahan.nama,
                        category: "Jersey",
                        price: bahan.harga || 0,
                        status: bahan.status,
                        image: bahan.imageUrl
                            ? `${UPLOADS_URL}${bahan.imageUrl}`
                            : "/images/GambarBaju.png",
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

    const handlePreview = (product: { id: number; uuid?: string }) => {
        navigate(`/customer/custom-jersey/detail/${product.uuid || product.id}`);
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
