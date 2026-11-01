import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router";
import { adminApi } from "~/api/admin";
import { isSeededDummyBahan } from "~/api/productApi";
import { formatRupiah } from "~/lib/utils";

export const getSizeSurcharge = (size: string): number => {
    if (!size) return 0;
    const s = size.toUpperCase().trim();
    if (["XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL"].includes(s)) {
        return 0;
    }
    const numXlMatch = s.match(/^(\d+)XL$/);
    if (numXlMatch) {
        const xCount = parseInt(numXlMatch[1], 10);
        if (xCount >= 3) {
            return (xCount - 2) * 10000;
        }
    }
    const xMatches = s.match(/^(X+)L$/);
    if (xMatches) {
        const xCount = xMatches[1].length;
        if (xCount >= 3) {
            return (xCount - 2) * 10000;
        }
    }
    return 0;
};

export const isBigSize = (size: string): boolean => {
    const s = size.toUpperCase().trim();
    const numXlMatch = s.match(/^(\d+)XL$/);
    if (numXlMatch) return parseInt(numXlMatch[1], 10) >= 3;
    const xMatches = s.match(/^(X+)L$/);
    if (xMatches) return xMatches[1].length >= 3;
    return false;
};

export const getMaxOrderPcs = (
    kuantitasKg: number,
    size: string,
    sleeve: string,
): number | string => {
    if (!size) return "-";
    const isLongSleeve = sleeve === "Lengan Panjang";
    const big = isBigSize(size);

    if (isLongSleeve) {
        return Math.floor(kuantitasKg * (big ? 1 : 2));
    } else {
        return Math.floor(kuantitasKg * (big ? 2 : 3));
    }
};

export function useCustomJerseyDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSleeve, setSelectedSleeve] = useState(
        searchParams.get("sleeve") || "Lengan Pendek",
    );
    const [selectedSize, setSelectedSize] = useState(
        searchParams.get("size") || "",
    );
    const [playerName, setPlayerName] = useState("");
    const [playerNumber, setPlayerNumber] = useState("");

    const isPublicView = location.pathname.startsWith("/product/");
    const basePath = isPublicView
        ? "/product"
        : "/customer/custom-jersey/detail";

    useEffect(() => {
        const fetchAllBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success" && Array.isArray(res.data)) {
                    const adminItems = res.data.filter(
                        (b: any) => !isSeededDummyBahan(b),
                    );
                    setBahanList(adminItems);
                    const idx = adminItems.findIndex(
                        (b: any) =>
                            b.uuid === id || String(b.id) === String(id),
                    );
                    if (idx !== -1) {
                        setCurrentIndex(idx);
                        const matched = adminItems[idx];
                        if (matched?.uuid && id !== matched.uuid) {
                            navigate(`${basePath}/${matched.uuid}${location.search}`, {
                                replace: true,
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllBahan();
    }, [id, basePath, navigate]);

    const handleNext = () => {
        const nextIdx = (currentIndex + 1) % bahanList.length;
        setCurrentIndex(nextIdx);
        const target = bahanList[nextIdx].uuid || bahanList[nextIdx].id;
        navigate(`${basePath}/${target}`, { replace: true });
    };

    const handlePrev = () => {
        const prevIdx =
            (currentIndex - 1 + bahanList.length) % bahanList.length;
        setCurrentIndex(prevIdx);
        const target = bahanList[prevIdx].uuid || bahanList[prevIdx].id;
        navigate(`${basePath}/${target}`, { replace: true });
    };

    const selectBahan = (idx: number) => {
        setCurrentIndex(idx);
        const target = bahanList[idx].uuid || bahanList[idx].id;
        navigate(`${basePath}/${target}`, { replace: true });
    };

    const currentBahan = bahanList[currentIndex] || null;

    const handleCustomize = () => {
        if (!selectedSize) {
            alert("Silakan pilih ukuran terlebih dahulu");
            return;
        }
        if (!currentBahan) return;
        const params = new URLSearchParams({
            productId: String(currentBahan.id),
            size: selectedSize,
            sleeve: selectedSleeve,
            name: playerName,
            number: playerNumber,
        });
        navigate(`/customer/custom-jersey/checkout?${params.toString()}`);
    };

    return {
        loading,
        bahanList,
        currentBahan,
        currentIndex,
        setCurrentIndex,
        selectedSleeve,
        setSelectedSleeve,
        selectedSize,
        setSelectedSize,
        playerName,
        setPlayerName,
        playerNumber,
        setPlayerNumber,
        formatRupiah,
        getSizeSurcharge,
        isBigSize,
        getMaxOrderPcs,
        isPublicView,
        basePath,
        handleNext,
        handlePrev,
        selectBahan,
        handleCustomize,
    };
}
