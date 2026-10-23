import { sortPlayersBySize } from "~/lib/sizeUtils";
import type { MonitoringOrder } from "~/types";

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
        designUrl: o.designUrl,
        paymentProofUrl: o.paymentUrl,
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
        details: o.details || [],
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
