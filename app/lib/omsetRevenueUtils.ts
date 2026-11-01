import { START_YEAR } from "~/features/admin/omset/constants";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export const getRecognizedOrderRevenue = (order: any): number => {
    if (!order || order.status === "DITOLAK") return 0;
    const total = Number(order.totalAmount) || 0;
    if (total <= 0) return 0;

    if (order.status === "SELESAI") {
        return total;
    }

    const proofMarker = order.paymentUrl ?? order.paymentProofUrl;
    if (proofMarker === "MENUNGGU_PEMBAYARAN_ADMIN") {
        return 0;
    }

    const paid = Number(order.paidAmount) || 0;
    return Math.min(total, Math.max(0, paid));
};

export const computeDashboardStatsFromOrders = (
    rawOrders: any[],
    options?: { year?: number; month?: number }
) => {
    const now = new Date();
    const filterYear = options?.year ? Number(options.year) : null;
    const filterMonth = options?.month ? Number(options.month) : null;

    const validOrders = (rawOrders || []).filter(
        (o) => o && !(o.orderId || "").startsWith("SEED-") && o.status !== "DITOLAK"
    );

    const accOrders = validOrders
        .map((order) => ({
            ...order,
            recognizedRevenue: getRecognizedOrderRevenue(order)
        }))
        .filter((order) => order.recognizedRevenue > 0);

    const totalRevenue = accOrders.reduce((sum, order) => sum + order.recognizedRevenue, 0);

    const dailySales: { name: string; pv: number; dateStr: string }[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const name = `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
        dailySales.push({ name, pv: 0, dateStr });
    }

    const monthlySales: { name: string; pv: number; monthKey: string }[] = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const name = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
        monthlySales.push({ name, pv: 0, monthKey: `${d.getFullYear()}-${d.getMonth()}` });
    }

    const currentYear = now.getFullYear();
    const startYear = START_YEAR || 2022;
    const yearlySales: { name: string; pv: number; year: number }[] = [];
    for (let y = startYear; y <= currentYear; y++) {
        yearlySales.push({ name: `${y}`, pv: 0, year: y });
    }

    const lifetimeSales: { name: string; pv: number; monthKey: string }[] = [];
    let tempYear = startYear;
    let tempMonth = 0;
    const currentMonth = now.getMonth();
    while (tempYear < currentYear || (tempYear === currentYear && tempMonth <= currentMonth)) {
        const name = `${MONTH_NAMES[tempMonth]} ${tempYear.toString().substring(2)}`;
        lifetimeSales.push({ name, pv: 0, monthKey: `${tempYear}-${tempMonth}` });
        tempMonth++;
        if (tempMonth > 11) {
            tempMonth = 0;
            tempYear++;
        }
    }

    accOrders.forEach((order) => {
        const date = new Date(order.createdAt);
        const dateStr = date.toISOString().split("T")[0];
        const orderYear = date.getFullYear();
        const orderMonth = date.getMonth();
        const monthKey = `${orderYear}-${orderMonth}`;
        const revenue = order.recognizedRevenue;

        const dayObj = dailySales.find((d) => d.dateStr === dateStr);
        if (dayObj) dayObj.pv += revenue;

        const monthObj = monthlySales.find((m) => m.monthKey === monthKey);
        if (monthObj) monthObj.pv += revenue;

        const yearObj = yearlySales.find((y) => y.year === orderYear);
        if (yearObj) yearObj.pv += revenue;

        const lifetimeObj = lifetimeSales.find((l) => l.monthKey === monthKey);
        if (lifetimeObj) lifetimeObj.pv += revenue;
    });

    let bestMonth = { month: "Belum ada", year: "-", pv: 0 };
    lifetimeSales.forEach((m) => {
        if (m.pv > bestMonth.pv) {
            bestMonth = {
                month: m.name.split(" ")[0],
                year: m.monthKey.split("-")[0],
                pv: m.pv
            };
        }
    });

    const yearStats: Record<number, { totalRevenue: number; totalQuantity: number }> = {};
    accOrders.forEach((order) => {
        const year = new Date(order.createdAt).getFullYear();
        if (!yearStats[year]) yearStats[year] = { totalRevenue: 0, totalQuantity: 0 };
        yearStats[year].totalRevenue += order.recognizedRevenue;
        yearStats[year].totalQuantity += Array.isArray(order.details) ? order.details.length : 0;
    });

    let bestYear: { year: string; totalRevenue: number; totalQuantity: number } = {
        year: "-",
        totalRevenue: 0,
        totalQuantity: 0
    };
    Object.keys(yearStats).forEach((yKey) => {
        const y = Number(yKey);
        if (yearStats[y].totalRevenue > bestYear.totalRevenue) {
            bestYear = { year: String(y), ...yearStats[y] };
        }
    });

    const buyerStats: Record<string, { name: string; totalAmount: number; category: string }> = {};
    accOrders.forEach((order) => {
        const name = (order.customerName || "Pelanggan").trim();
        const key = name.toUpperCase();
        if (!buyerStats[key]) {
            buyerStats[key] = {
                name,
                totalAmount: 0,
                category: order.isAdminOrder ? "Customer Pesanan" : "General"
            };
        }
        buyerStats[key].totalAmount += order.recognizedRevenue;
    });

    let topBuyer = { name: "Belum ada", category: "-", initial: "-" };
    let maxBuyerAmount = 0;
    Object.values(buyerStats).forEach((entry) => {
        if (entry.totalAmount > maxBuyerAmount) {
            maxBuyerAmount = entry.totalAmount;
            topBuyer = {
                name: entry.name,
                category: entry.category,
                initial: entry.name.substring(0, 3).toUpperCase()
            };
        }
    });

    const sortedByLatest = [...(rawOrders || [])]
        .filter((o) => o && !(o.orderId || "").startsWith("SEED-"))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const newOrders = sortedByLatest.map((o) => ({
        name: (o.customerName || "Pelanggan").trim()
    }));

    let salesData: {
        daily: { name: string; pv: number }[];
        monthly: { name: string; pv: number }[];
        yearly: { name: string; pv: number }[];
        lifetime: { name: string; pv: number }[];
    } = {
        daily: dailySales,
        monthly: monthlySales,
        yearly: yearlySales,
        lifetime: lifetimeSales
    };

    if (filterYear) {
        if (filterMonth) {
            const filteredDailySales: { name: string; pv: number; dateStr: string }[] = [];
            const daysInMonth = new Date(filterYear, filterMonth, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${filterYear}-${String(filterMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const name = `${day} ${MONTH_NAMES[filterMonth - 1]}`;
                filteredDailySales.push({ name, pv: 0, dateStr });
            }

            accOrders.forEach((order) => {
                const date = new Date(order.createdAt);
                if (date.getFullYear() === filterYear && date.getMonth() + 1 === filterMonth) {
                    const day = date.getDate();
                    if (filteredDailySales[day - 1]) {
                        filteredDailySales[day - 1].pv += order.recognizedRevenue;
                    }
                }
            });

            salesData = {
                daily: filteredDailySales,
                monthly: [],
                yearly: [],
                lifetime: []
            };
        } else {
            const filteredMonthlySales: { name: string; pv: number; monthKey: string }[] = [];
            const maxMonths = filterYear === now.getFullYear() ? now.getMonth() + 1 : 12;
            for (let m = 0; m < maxMonths; m++) {
                const name = `${MONTH_NAMES[m]} ${String(filterYear).substring(2)}`;
                filteredMonthlySales.push({ name, pv: 0, monthKey: `${filterYear}-${m}` });
            }

            accOrders.forEach((order) => {
                const date = new Date(order.createdAt);
                if (date.getFullYear() === filterYear) {
                    const m = date.getMonth();
                    if (filteredMonthlySales[m]) {
                        filteredMonthlySales[m].pv += order.recognizedRevenue;
                    }
                }
            });

            salesData = {
                daily: [],
                monthly: filteredMonthlySales,
                yearly: [],
                lifetime: []
            };
        }
    }

    return {
        totalRevenue,
        salesData,
        bestMonth,
        bestYear,
        topBuyer,
        newOrders
    };
};

export const computeOmsetReportFromOrders = (
    rawOrders: any[],
    options?: { startDate?: string; endDate?: string }
) => {
    const startMs = options?.startDate ? new Date(options.startDate).getTime() : null;
    const endMs = options?.endDate ? new Date(`${options.endDate}T23:59:59.999Z`).getTime() : null;

    let totalPemasukan = 0;
    const revenueBreakdownMap: Record<string, number> = {};

    (rawOrders || []).forEach((order) => {
        if (!order || (order.orderId || "").startsWith("SEED-") || order.status === "DITOLAK") return;

        if (startMs !== null && endMs !== null) {
            const createdMs = new Date(order.createdAt).getTime();
            if (createdMs < startMs || createdMs > endMs) return;
        }

        const recognized = getRecognizedOrderRevenue(order);
        if (recognized <= 0) return;

        totalPemasukan += recognized;
        const title =
            Array.isArray(order.details) && order.details.length > 0
                ? order.details[0].productTitle || "Produk Custom"
                : "Lain-lain";

        revenueBreakdownMap[title] = (revenueBreakdownMap[title] || 0) + recognized;
    });

    const revenueBreakdown = Object.keys(revenueBreakdownMap).map((nama) => ({
        nama,
        total: revenueBreakdownMap[nama]
    }));

    return {
        totalPemasukan,
        revenueBreakdown
    };
};

