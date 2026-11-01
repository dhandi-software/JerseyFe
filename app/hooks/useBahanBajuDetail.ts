import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { adminApi } from "~/api/admin";
import type { BahanBajuItem } from "~/types/bahanBaju";

export function useBahanBajuDetail() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [bahanList, setBahanList] = useState<BahanBajuItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchAllBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    setBahanList(res.data);
                    const idx = res.data.findIndex(
                        (b: any) =>
                            b.uuid === id || String(b.id) === String(id),
                    );
                    if (idx !== -1) {
                        setCurrentIndex(idx);
                        const matched = res.data[idx];
                        if (matched?.uuid && id !== matched.uuid) {
                            navigate(`/admin/bahan-baju/detail/${matched.uuid}`, {
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
    }, [id, navigate]);

    const currentBahan = bahanList[currentIndex] || null;

    const handleNext = () => {
        if (bahanList.length === 0) return;
        const nextIdx = (currentIndex + 1) % bahanList.length;
        setCurrentIndex(nextIdx);
        const nextTarget = bahanList[nextIdx].uuid || bahanList[nextIdx].id;
        navigate(`/admin/bahan-baju/detail/${nextTarget}`, { replace: true });
    };

    const handlePrev = () => {
        if (bahanList.length === 0) return;
        const prevIdx = (currentIndex - 1 + bahanList.length) % bahanList.length;
        setCurrentIndex(prevIdx);
        const prevTarget = bahanList[prevIdx].uuid || bahanList[prevIdx].id;
        navigate(`/admin/bahan-baju/detail/${prevTarget}`, { replace: true });
    };

    const selectBahan = (idx: number) => {
        if (!bahanList[idx]) return;
        setCurrentIndex(idx);
        const target = bahanList[idx].uuid || bahanList[idx].id;
        navigate(`/admin/bahan-baju/detail/${target}`, { replace: true });
    };

    return {
        id,
        loading,
        bahanList,
        currentIndex,
        currentBahan,
        handleNext,
        handlePrev,
        selectBahan,
        navigate,
    };
}
