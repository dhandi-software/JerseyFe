import { UPLOADS_URL } from "~/api/client";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import type { BahanItem, MonitoringOrder } from "~/types";

export const resolveUploadImageUrl = (rawUrl?: string | null): string => {
    if (!rawUrl) return "";
    const trimmed = rawUrl.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http")) return trimmed;
    return `${UPLOADS_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

export const findOrderBahan = (
    order: Pick<MonitoringOrder, "productId" | "product">,
    bahanList: BahanItem[]
): BahanItem | undefined => {
    if (!bahanList || bahanList.length === 0) return undefined;
    if (order.productId !== null && order.productId !== undefined) {
        const byId = bahanList.find(b => Number(b.id) === Number(order.productId));
        if (byId) return byId;
    }
    if (order.product) {
        const targetName = order.product.trim().toLowerCase();
        return bahanList.find(b => b.nama?.trim().toLowerCase() === targetName);
    }
    return undefined;
};

export interface ParsedPaymentProofUrls {
    dpProofUrl: string;
    fullProofUrl: string;
    isAwaitingAdmin: boolean;
}

export const parsePaymentProofUrls = (
    rawUrl?: string | null,
    paymentType?: string
): ParsedPaymentProofUrls => {
    if (!rawUrl) {
        return { dpProofUrl: "", fullProofUrl: "", isAwaitingAdmin: false };
    }
    const trimmed = rawUrl.trim();
    if (trimmed === "MENUNGGU_PEMBAYARAN_ADMIN") {
        return { dpProofUrl: "", fullProofUrl: "", isAwaitingAdmin: true };
    }
    if (trimmed.startsWith("{")) {
        try {
            const parsed = JSON.parse(trimmed);
            const dp = typeof parsed?.dp === "string" && parsed.dp !== "MENUNGGU_PEMBAYARAN_ADMIN" ? parsed.dp : "";
            const full = typeof parsed?.full === "string" && parsed.full !== "MENUNGGU_PEMBAYARAN_ADMIN" ? parsed.full : "";
            return { dpProofUrl: dp, fullProofUrl: full, isAwaitingAdmin: false };
        } catch {
            // Fall through to plain URL handling if JSON is malformed.
        }
    }
    if (paymentType === "DP") {
        return { dpProofUrl: trimmed, fullProofUrl: "", isAwaitingAdmin: false };
    }
    return { dpProofUrl: "", fullProofUrl: trimmed, isAwaitingAdmin: false };
};

export const serializePaymentProofUrls = (
    currentRawUrl: string | undefined | null,
    currentPaymentType: string | undefined,
    slot: "DP" | "FULL",
    newUrl: string
): string => {
    const { dpProofUrl, fullProofUrl } = parsePaymentProofUrls(currentRawUrl, currentPaymentType);
    const nextDp = slot === "DP" ? newUrl : dpProofUrl;
    const nextFull = slot === "FULL" ? newUrl : fullProofUrl;
    return JSON.stringify({
        dp: nextDp || undefined,
        full: nextFull || undefined
    });
};

export const parseSleeveAndSize = (rawSize: string) => {
    if (!rawSize) return { size: "-", sleeve: "PENDEK" };
    const isLong = /panjang|pjg|long/i.test(rawSize);
    const cleanSize = rawSize
        .replace(/\([^)]*\)/g, "")
        .replace(/panjang|pendek|pjg|short|long/gi, "")
        .replace(/[\/\-_]/g, "")
        .trim();
    return {
        size: cleanSize || rawSize,
        sleeve: isLong ? "PANJANG" : "PENDEK"
    };
};

export const getStatusStyle = (status: string) => {
    switch (status) {
        case "SELESAI": return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "FINISHING": return "bg-blue-50 text-blue-700 border-blue-200";
        case "PRINT": return "bg-cyan-50 text-cyan-700 border-cyan-200";
        case "LAYOUT": return "bg-amber-50 text-amber-700 border-amber-200";
        case "DESAIN": return "bg-purple-50 text-purple-700 border-purple-200";
        case "DITOLAK": return "bg-red-50 text-red-700 border-red-200";
        case "MENUNGGU": default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
};

export const formatOrderData = (data: any[]): MonitoringOrder[] => {
    return data.map((o: any) => ({
        id: o.orderId,
        rawId: o.id,
        customer: o.customerName,
        designer: o.designerName || "Belum Ada",
        product: o.details?.length > 0 ? o.details[0].productTitle : "Custom Jersey",
        productId: o.details?.length > 0 ? o.details[0].productId : null,
        recommendedBahanIds: o.recommendedBahanIds || [],
        qty: o.details?.length || 0,
        status: o.status,
        queueNumber: o.queueNumber,
        isWorking: o.isWorking,
        date: new Date(o.createdAt).toISOString().split('T')[0],
        playerInfo: sortPlayersBySize((o.details || []).map((d: any) => ({
            name: d.playerName || "-",
            number: d.playerNumber || "-",
            size: d.playerSize || "-"
        }))),
        designNote: o.designNote,
        adminNote: o.adminNote,
        designUrl: o.designUrl,
        videoUrl: o.videoUrl,
        paymentProofUrl: o.paymentUrl,
        paymentType: o.paymentType || "FULL",
        paidAmount: o.paidAmount !== undefined ? o.paidAmount : (o.paymentType === "DP" ? 0 : (o.totalAmount || 0)),
        remainingAmount: o.remainingAmount !== undefined ? o.remainingAmount : (o.paymentType === "DP" ? (o.totalAmount || 0) : 0),
        isAdminOrder: !!o.isAdminOrder,
        totalAmount: o.totalAmount,
        shippingMethod: o.shippingMethod,
        shippingAddress: o.shippingAddress,
        mockupUrl: o.mockupUrl,
        designStatus: o.designStatus,
        designFeedback: o.designFeedback,
        layoutUrl: o.layoutUrl,
        layoutStatus: o.layoutStatus,
        layoutFeedback: o.layoutFeedback,
        printUrl: o.printUrl,
        finishingUrl: o.finishingUrl,
        details: (o.details || []).map((d: any) => ({
            id: d.id,
            productId: d.productId,
            productTitle: d.productTitle,
            playerName: d.playerName,
            playerNumber: d.playerNumber,
            playerSize: d.playerSize,
            statusBaju: Boolean(d.statusBaju),
            statusCelana: Boolean(d.statusCelana)
        })),
        dateTime: new Date(o.createdAt).toLocaleString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }));
};
