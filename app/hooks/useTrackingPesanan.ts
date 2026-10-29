import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
    Clock,
    Palette,
    Ruler,
    Printer,
    Scissors,
    CheckCircle2,
} from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import { orderService } from "~/services/orderService";
import { generateInvoicePDF } from "~/lib/pdfHelper";
import { filterPlayersByQuery } from "~/lib/sizeUtils";
import { adminApi } from "~/api/admin";
import type {
    AlternativeBahan,
    CustomerDesignApprovalCardProps,
    CustomerTrackedOrder,
    TrackingStage,
    TrackingToastMessage,
    UseTrackingPesananReturn,
} from "~/types/trackingPesanan";

export const STORE_PICKUP_ADDRESS =
    "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178";

export function resolveCustomerUploadUrl(rawUrl?: string | null): string {
    if (!rawUrl) return "";
    if (rawUrl.startsWith("http")) return rawUrl;
    return `${UPLOADS_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

export const TRACKING_STAGES: TrackingStage[] = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: Palette, desc: "Mockup desain" },
    { id: "LAYOUT", label: "Layout", icon: Ruler, desc: "Pola & Layout" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak kain" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Selesai" },
];

export const getDisplayStatus = (status: string, isWorking?: boolean) => {
    if (status === "MENUNGGU") return "Verifikasi Pembayaran";
    if (status === "DESAIN") {
        return isWorking ? "Pesanan Sedang Diproses" : "Pembayaran Diterima";
    }
    if (["LAYOUT", "PRINT", "FINISHING"].includes(status)) {
        return "Pesanan Sedang Diproses";
    }
    if (status === "SELESAI") return "Selesai";
    if (status === "DITOLAK") return "Ditolak";
    return status;
};

export function useCustomerDesignApprovalCard({
    mode,
    variant = "desktop",
    fileUrl,
    feedback,
    interactive = true,
    onToggleRevisiForm,
    onFeedbackInputChange,
}: Pick<
    CustomerDesignApprovalCardProps,
    | "mode"
    | "variant"
    | "fileUrl"
    | "feedback"
    | "interactive"
    | "onToggleRevisiForm"
    | "onFeedbackInputChange"
>) {
    const isDesign = mode === "design";
    const resolvedUrl = resolveCustomerUploadUrl(fileUrl);
    const isPdf = Boolean(fileUrl && fileUrl.toLowerCase().endsWith(".pdf"));

    const title =
        variant === "desktop"
            ? isDesign
                ? "Hasil Desain Mockup Jersey Anda"
                : "Layout Pola Cetak Jersey Anda"
            : isDesign
              ? "Hasil Desain Mockup"
              : "Layout Pola Cetak";

    const description =
        variant === "desktop"
            ? isDesign
                ? "Tim desainer kami telah mengunggah mockup desain jersey Anda. Silakan tinjau desain di bawah ini sebelum kami melanjutkan ke proses Layout Pola Cetak."
                : interactive
                  ? "Tim desainer kami telah mengunggah layout pola cetak jersey Anda. Silakan tinjau layout di bawah ini sebelum kami melanjutkan ke proses print cetak kain."
                  : "Layout pola cetak jersey Anda."
            : isDesign
              ? "Silakan tinjau mockup desain jersey Anda di bawah ini sebelum kami melanjutkan ke proses layout pola cetak."
              : interactive
                ? "Silakan tinjau layout pola cetak jersey Anda di bawah ini sebelum kami melanjutkan ke proses print cetak kain."
                : "Layout pola cetak jersey Anda.";

    const statusPrefix =
        variant === "desktop"
            ? isDesign
                ? "Status Desain:"
                : "Status Layout:"
            : "Status:";

    const approveButtonLabel =
        variant === "desktop"
            ? isDesign
                ? "Setujui Desain"
                : "Setujui Layout"
            : isDesign
              ? "Setujui"
              : "Setujui Layout";

    const revisiFormLabel =
        variant === "desktop"
            ? isDesign
                ? "Detail Revisi yang Diinginkan:"
                : "Detail Revisi Layout yang Diinginkan:"
            : isDesign
              ? "Detail Revisi:"
              : "Detail Revisi Layout:";

    const revisiPlaceholder =
        variant === "desktop"
            ? isDesign
                ? "Contoh: Tolong warna tulisan sponsor diubah menjadi putih, dan logo tim digeser sedikit ke atas."
                : "Contoh: Tolong penempatan nama pemain dan nomor punggung diselaraskan kembali."
            : isDesign
              ? "Contoh: Tolong ganti warna..."
              : "Contoh: Tolong penempatan nama pemain...";

    const submitRevisiLabel =
        variant === "desktop"
            ? isDesign
                ? "Kirim Revisi"
                : "Kirim Revisi Layout"
            : isDesign
              ? "Kirim"
              : "Kirim Layout";

    const approvedMessage =
        variant === "desktop"
            ? isDesign
                ? "Desain telah disetujui! Pesanan akan segera dilanjutkan ke tahap Layout Pola & Cetak."
                : "Layout telah disetujui! Pesanan akan segera dilanjutkan ke tahap Print Cetak Kain."
            : isDesign
              ? "Desain disetujui! Segera dilanjutkan ke tahap berikutnya."
              : "Layout disetujui! Segera dilanjutkan ke proses cetak kain.";

    const handleStartRevisi = () => {
        onFeedbackInputChange?.("");
        onToggleRevisiForm?.(true);
    };

    const handleCancelRevisi = () => {
        onToggleRevisiForm?.(false);
        onFeedbackInputChange?.("");
    };

    const handleEditRevisiNote = () => {
        onFeedbackInputChange?.(feedback || "");
        onToggleRevisiForm?.(true);
    };

    return {
        isDesign,
        resolvedUrl,
        isPdf,
        title,
        description,
        statusPrefix,
        approveButtonLabel,
        revisiFormLabel,
        revisiPlaceholder,
        submitRevisiLabel,
        approvedMessage,
        handleStartRevisi,
        handleCancelRevisi,
        handleEditRevisiNote,
    };
}

export function useCustomerAlternativeFabric(
    order: CustomerTrackedOrder,
    bahanList: AlternativeBahan[]
) {
    const recommendedIds = order.recommendedBahanIds || [];
    const hasRecommendations = recommendedIds.length > 0;
    const recommendedItems = useMemo(
        () => bahanList.filter((b) => recommendedIds.includes(b.id)),
        [bahanList, recommendedIds]
    );

    return {
        hasRecommendations,
        recommendedItems,
    };
}

export function useCustomerProductionNotesVideo(order: CustomerTrackedOrder) {
    const hasNote = Boolean(order.adminNote && order.adminNote.trim().length > 0);
    const hasVideo = Boolean(order.videoUrl && order.videoUrl.trim().length > 0);

    const embedUrl = useMemo(() => {
        const url = order.videoUrl;
        if (!url) return null;
        try {
            const clean = url.trim();
            if (clean.includes("youtube.com/watch")) {
                const parsed = new URL(clean);
                const v = parsed.searchParams.get("v");
                if (v) return `https://www.youtube.com/embed/${v}`;
            }
            if (clean.includes("youtube.com/shorts/")) {
                const id = clean.split("youtube.com/shorts/")[1]?.split(/[?&/]/)[0];
                if (id) return `https://www.youtube.com/embed/${id}`;
            }
            if (clean.includes("youtu.be/")) {
                const id = clean.split("youtu.be/")[1]?.split("?")[0];
                if (id) return `https://www.youtube.com/embed/${id}`;
            }
            if (clean.includes("drive.google.com/file/d/")) {
                const match = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                if (match && match[1]) {
                    return `https://drive.google.com/file/d/${match[1]}/preview`;
                }
            }
        } catch {
            return null;
        }
        return null;
    }, [order.videoUrl]);

    const noteParts = useMemo(() => {
        if (!order.adminNote) return [];
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return order.adminNote.split(urlRegex).map((part) => ({
            text: part,
            isLink: /^https?:\/\/[^\s]+$/.test(part),
        }));
    }, [order.adminNote]);

    return {
        hasNote,
        hasVideo,
        embedUrl,
        noteParts,
    };
}

export function useCustomerSupportBanner(orderId?: string) {
    const waText = orderId
        ? `Halo Admin FCSV, saya ingin menanyakan status pesanan jersey dengan kode ${orderId}`
        : "Halo Admin FCSV, saya ingin menanyakan status pesanan jersey";
    const waUrl = `https://wa.me/6285892720034?text=${encodeURIComponent(waText)}`;

    const handleOpenSupport = () => {
        window.open(waUrl, "_blank");
    };

    return {
        waUrl,
        handleOpenSupport,
    };
}

export function useTrackingPesanan(): UseTrackingPesananReturn {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get("id") || "");
    const [order, setOrder] = useState<CustomerTrackedOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [memberSearch, setMemberSearch] = useState("");

    const [feedbackInput, setFeedbackInput] = useState("");
    const [showRevisiForm, setShowRevisiForm] = useState(false);
    const [submittingAction, setSubmittingAction] = useState(false);
    const [toast, setToast] = useState<TrackingToastMessage | null>(null);
    const [bahanList, setBahanList] = useState<AlternativeBahan[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        const fetchBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    setBahanList(res.data);
                }
            } catch (err) {
                console.error("Error fetching bahan:", err);
            }
        };
        fetchBahan();
    }, []);

    const executeSearch = async (idToSearch: string) => {
        if (!idToSearch.trim()) return;

        setLoading(true);
        setError("");
        setMemberSearch("");
        try {
            const data = await orderService.trackOrder(idToSearch.trim());
            setOrder(data);
        } catch {
            setError(
                "ID Pesanan tidak ditemukan. Pastikan kode yang Anda masukkan benar.",
            );
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setOrderId(id);
            executeSearch(id);
        }
    }, [searchParams]);

    const totalPlayers = (order?.details || []).length;
    const filteredPlayers = useMemo(
        () => filterPlayersByQuery(order?.details || [], memberSearch),
        [order?.details, memberSearch],
    );

    const handlePrintInvoice = async () => {
        if (!order) return;
        setIsPrinting(true);
        try {
            await generateInvoicePDF(order);
        } catch (err) {
            console.error("Failed to generate PDF", err);
            setToast({ title: "Gagal mencetak invoice", variant: "destructive" });
        } finally {
            setIsPrinting(false);
        }
    };

    const handleApprove = async () => {
        if (!order) return;
        setSubmittingAction(true);
        try {
            await orderService.approveDesign(order.id);
            setOrder((prev) =>
                prev
                    ? {
                          ...prev,
                          designStatus: "APPROVED",
                          designFeedback: null,
                      }
                    : null,
            );
            setToast({ title: "Desain berhasil disetujui!", variant: "success" });
        } catch (err) {
            console.error("Gagal menyetujui desain:", err);
            setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleUnapproveDesign = async () => {
        if (!order) return;
        setSubmittingAction(true);
        try {
            await orderService.unapproveDesign(order.id);
            setOrder((prev) =>
                prev
                    ? {
                          ...prev,
                          designStatus: "SENT",
                      }
                    : null,
            );
            setToast({
                title: "Persetujuan desain dibatalkan!",
                variant: "success",
            });
        } catch (err) {
            console.error("Gagal membatalkan persetujuan desain:", err);
            setToast({
                title: "Gagal membatalkan persetujuan desain",
                variant: "destructive",
            });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleRevisi = async () => {
        if (!order || !feedbackInput.trim()) return;
        setSubmittingAction(true);
        try {
            await orderService.revisiDesign(order.id, feedbackInput);
            setOrder((prev) =>
                prev
                    ? {
                          ...prev,
                          designStatus: "REVISI",
                          designFeedback: feedbackInput,
                      }
                    : null,
            );
            setShowRevisiForm(false);
            setFeedbackInput("");
            setToast({ title: "Revisi berhasil diajukan!", variant: "success" });
        } catch (err) {
            console.error("Gagal mengajukan revisi:", err);
            setToast({ title: "Gagal mengajukan revisi", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleSelectAlternative = async (bahanId: number | string) => {
        if (!order) return;
        try {
            await orderService.selectAlternative(order.id, Number(bahanId));
            setToast({
                title: "Bahan berhasil diganti ke alternatif!",
                variant: "success",
            });
            executeSearch(order.orderId || String(order.id));
        } catch (err) {
            console.error("Gagal memilih bahan alternatif:", err);
            setToast({
                title: "Gagal mengganti bahan",
                variant: "destructive",
            });
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(orderId);
    };

    const getCurrentStageIndex = () => {
        if (!order) return -1;
        return TRACKING_STAGES.findIndex((s) => s.id === order.status);
    };

    return {
        orderId,
        setOrderId,
        order,
        setOrder,
        loading,
        error,
        memberSearch,
        setMemberSearch,
        filteredPlayers,
        totalPlayers,
        feedbackInput,
        setFeedbackInput,
        showRevisiForm,
        setShowRevisiForm,
        submittingAction,
        toast,
        setToast,
        bahanList,
        isPrinting,
        handlePrintInvoice,
        executeSearch,
        handleApprove,
        handleUnapproveDesign,
        handleRevisi,
        handleSelectAlternative,
        handleSearch,
        getCurrentStageIndex,
        stages: TRACKING_STAGES,
        getDisplayStatus,
    };
}
