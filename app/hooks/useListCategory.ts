import { useState, useEffect } from "react";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { useCart } from "~/context/CartContext";
import { formatRupiah } from "~/lib/utils";
import type { ListCategoryItem, UseListCategoryReturn } from "~/types";

export const CATEGORY_OPTIONS = ["Semua", "Jersey"];

export function useListCategory(): UseListCategoryReturn {
    const { cart, subtotal } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [uangDiterima, setUangDiterima] = useState("");
    const [materials, setMaterials] = useState<ListCategoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        adminApi
            .getBahanBaju()
            .then((res) => {
                if (!isMounted) return;
                if (res.status === "success" && Array.isArray(res.data)) {
                    const mapped: ListCategoryItem[] = res.data.map((m: any) => ({
                        id: m.id,
                        title: m.nama,
                        price: Number(m.harga) || 0,
                        image: m.imageUrl
                            ? `${UPLOADS_URL}${m.imageUrl}`
                            : "/images/mockup-jersey.jpg",
                        category: "Jersey",
                        status: m.status,
                        kuantitasKg: m.kuantitasKg,
                        rasioKonversi: m.rasioKonversi,
                        description: m.deskripsi || "Bahan jersey premium.",
                    }));
                    setMaterials(mapped);
                } else {
                    setMaterials([]);
                }
            })
            .catch((err) => {
                console.error("Gagal memuat bahan baju:", err);
                if (isMounted) setMaterials([]);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredProducts = materials.filter((p) => {
        const matchesCategory =
            selectedCategory === "Semua" || p.category === selectedCategory;
        const matchesSearch = p.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim());
        return matchesCategory && matchesSearch;
    });

    const uangNumber = Number(uangDiterima) || 0;
    const kembalian = uangNumber > 0 ? uangNumber - subtotal : 0;

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const waNumber = "6285892720034";
        let message = "Halo FCSV, saya ingin memesan barang berikut:\n\n";

        cart.forEach((item) => {
            message += `- ${item.product.title} (x${item.quantity}) - ${formatRupiah(item.product.price * item.quantity)}\n`;
        });

        message += `\n*Total: ${formatRupiah(subtotal)}*`;
        if (uangDiterima) {
            message += `\nUang Diterima: ${formatRupiah(Number(uangDiterima))}`;
        }

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, "_blank");
    };

    return {
        materials,
        filteredProducts,
        loading,
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
    };
}
