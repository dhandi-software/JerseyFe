import { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { isSeededDummyBahan } from "~/api/productApi";
import { FCSV_COMPANY_PROFILE } from "~/hooks/useHome";
import { generateBahanUuid } from "~/lib/utils";
import type {
    AboutMaterialItem,
    AboutProductionStageItem,
    AboutServiceSpecItem,
    UseAboutReturn,
} from "~/types";

export const ABOUT_PRODUCTION_STAGES: AboutProductionStageItem[] = [
    {
        step: "01",
        title: "Data Pemain & Bahan",
        description:
            "Pengecekan daftar nama punggung, nomor, ukuran baju (S sampai 5XL), model lengan, dan stok kain di gudang.",
    },
    {
        step: "02",
        title: "Mockup Desain",
        description:
            "Tim desain menyiapkan pratinjau jersey sesuai warna, logo tim, dan sponsor untuk disetujui pelanggan.",
    },
    {
        step: "03",
        title: "Pola & Layout Cetak",
        description:
            "Pecah pola per ukuran anggota tim ke dalam kertas transfer agar posisi motif dan tulisan pas saat dijahit.",
    },
    {
        step: "04",
        title: "Press Sublimasi Kain",
        description:
            "Proses pemindahan tinta sublimasi ke kain dryfit dengan suhu terukur supaya warna keluar pekat dan awet.",
    },
    {
        step: "05",
        title: "Jahit, Cek Kualitas & Kirim",
        description:
            "Penjahitan setelan baju dan celana, pengecekan kerapian per potong, lalu pengemasan untuk diambil atau dikirim.",
    },
];

export const ABOUT_SERVICE_SPECS: AboutServiceSpecItem[] = [
    {
        label: "Cabang Olahraga",
        value: "Sepak Bola, Futsal, Basket, Voli, Badminton, Running, Esport",
    },
    {
        label: "Kebutuhan Pesanan",
        value: "Tim Komunitas, Sekolah, Kampus, Turnamen, dan Instansi",
    },
    {
        label: "Teknik Produksi",
        value: "Sublimasi Full Print, Jahit Overdeck & Obras Rapi",
    },
    {
        label: "Rentang Ukuran",
        value: "Reguler (XS s/d 2XL) dan Big Size (3XL s/d 5XL), Lengan Pendek & Panjang",
    },
];

function resolveMaterialImage(imageUrl?: string | null): string | null {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) {
        return imageUrl;
    }
    return `${UPLOADS_URL}${imageUrl}`;
}

export function formatMaterialPrice(price?: number): string {
    return new Intl.NumberFormat("id-ID").format(Number(price) || 150000);
}

export function useAbout(): UseAboutReturn {
    const [materials, setMaterials] = useState<AboutMaterialItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const fetchMaterials = useCallback(() => {
        setLoading(true);
        setError(null);
        adminApi
            .getBahanBaju()
            .then((res) => {
                if (res.status === "success" && Array.isArray(res.data)) {
                    const validItems = res.data.filter(
                        (item: AboutMaterialItem) => !isSeededDummyBahan(item)
                    );
                    setMaterials(validItems);
                    setCurrentIndex(0);
                } else {
                    setMaterials([]);
                }
            })
            .catch(() => {
                setError(
                    "Belum berhasil memuat daftar bahan dari server. Silakan coba muat ulang."
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const currentItem = useMemo<AboutMaterialItem | null>(() => {
        if (materials.length === 0) return null;
        return materials[Math.min(currentIndex, materials.length - 1)];
    }, [materials, currentIndex]);

    const handleNext = useCallback(() => {
        if (materials.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % materials.length);
        }
    }, [materials.length]);

    const handlePrev = useCallback(() => {
        if (materials.length > 0) {
            setCurrentIndex(
                (prev) => (prev - 1 + materials.length) % materials.length
            );
        }
    }, [materials.length]);

    const currentImageSrc = useMemo(
        () => resolveMaterialImage(currentItem?.imageUrl),
        [currentItem?.imageUrl]
    );

    const currentProductHref = useMemo(() => {
        if (!currentItem) return "/category";
        return `/product/${generateBahanUuid(currentItem.id, currentItem.uuid)}`;
    }, [currentItem]);

    const formattedCurrentPrice = useMemo(
        () => formatMaterialPrice(currentItem?.harga),
        [currentItem?.harga]
    );

    return {
        companyProfile: FCSV_COMPANY_PROFILE,
        materials,
        loading,
        error,
        currentIndex,
        currentItem,
        currentImageSrc,
        currentProductHref,
        formattedCurrentPrice,
        productionStages: ABOUT_PRODUCTION_STAGES,
        serviceSpecs: ABOUT_SERVICE_SPECS,
        setCurrentIndex,
        handleNext,
        handlePrev,
        fetchMaterials,
        formatPrice: formatMaterialPrice,
    };
}

