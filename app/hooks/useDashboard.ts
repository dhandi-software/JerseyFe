import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { adminApi } from "~/api/admin";
import { orderService } from "~/services/orderService";
import { computeDashboardStatsFromOrders } from "~/lib/omsetRevenueUtils";
import type { TimeView, DashboardStatsData } from "~/types";

export function useDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showWelcomeToast, setShowWelcomeToast] = useState(false);
    const [timeView, setTimeView] = useState<TimeView>('daily');
    const [showDropdown, setShowDropdown] = useState(false);
    const chartScrollRef = useRef<HTMLDivElement>(null);

    const [statsData, setStatsData] = useState<DashboardStatsData>({
        totalCustomer: 0,
        totalStaff: 0,
        totalAdmin: 0,
        totalRevenue: 0,
        salesData: {
            daily: [],
            monthly: [],
            yearly: [],
            lifetime: []
        },
        recentCustomers: [],
        recentChats: [],
        totalUnreadChat: 0,
        bestMonth: { month: "-", year: "-", pv: 0 },
        bestYear: { year: "-", totalRevenue: 0, totalQuantity: 0 },
        topBuyer: { name: "-", category: "-", initial: "-" },
        newOrders: []
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Check login toast notification once per session
    useEffect(() => {
        const justLoggedIn = sessionStorage.getItem("justLoggedIn");
        if (justLoggedIn === "true") {
            setShowWelcomeToast(true);
            sessionStorage.removeItem("justLoggedIn");
        }
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, adminRes, ordersRes] = await Promise.allSettled([
                adminApi.getDashboardStats(),
                adminApi.getUserCountByRole("admin"),
                orderService.getOrders()
            ]);

            const statsPayload = statsRes.status === "fulfilled" ? statsRes.value?.data : null;
            const adminCount = adminRes.status === "fulfilled" ? adminRes.value?.data?.count : 0;
            const rawOrders = ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value) ? ordersRes.value : null;
            const computed = rawOrders !== null ? computeDashboardStatsFromOrders(rawOrders) : null;

            const mergedRecentCustomers = computed
                ? computed.recentCustomers.map((rc) => {
                      const backendMatch = Array.isArray(statsPayload?.recentCustomers)
                          ? statsPayload.recentCustomers.find(
                                (bc: any) =>
                                    (!rc.isAdminOrder && Number(bc.id) === Number(rc.id)) ||
                                    (bc.nama || "").trim().toUpperCase() === rc.nama.trim().toUpperCase()
                            )
                          : null;
                      return backendMatch
                          ? {
                                ...rc,
                                lastMessageAt: backendMatch.lastMessageAt || rc.lastMessageAt,
                                lastMessageContent: backendMatch.lastMessageContent || rc.lastMessageContent
                            }
                          : rc;
                  })
                : (statsPayload?.recentCustomers || []);

            setStatsData(prev => ({
                ...prev,
                totalCustomer: computed ? computed.totalCustomer : Number(statsPayload?.totalCustomer || 0),
                totalStaff: Number(statsPayload?.totalStaff || 0),
                totalAdmin: Number(statsPayload?.totalAdmin || adminCount || 0),
                totalRevenue: computed ? computed.totalRevenue : Number(statsPayload?.totalRevenue || 0),
                salesData: computed ? computed.salesData : (statsPayload?.salesData || prev.salesData),
                recentCustomers: mergedRecentCustomers,
                recentChats: statsPayload?.recentChats || [],
                totalUnreadChat: statsPayload?.totalUnreadChat || 0,
                bestMonth: computed ? computed.bestMonth : (statsPayload?.bestMonth || prev.bestMonth),
                bestYear: computed ? computed.bestYear : (statsPayload?.bestYear || prev.bestYear),
                topBuyer: computed ? computed.topBuyer : (statsPayload?.topBuyer || prev.topBuyer),
                newOrders: computed ? computed.newOrders : (statsPayload?.newOrders || prev.newOrders)
            }));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const activeData = useMemo(() => {
        return statsData.salesData[timeView] || [];
    }, [statsData.salesData, timeView]);

    const currentTotal = useMemo(() => {
        return activeData.reduce((sum, item) => sum + (Number(item.pv) || 0), 0);
    }, [activeData]);

    // Auto-scroll chart to the right when populated
    useEffect(() => {
        const isEmpty = currentTotal === 0 || activeData.every(item => Number(item.pv || 0) === 0);
        if (chartScrollRef.current && !isEmpty) {
            chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
        }
    }, [timeView, statsData, currentTotal, activeData]);

    const trend = useMemo(() => {
        let isDecrease = false;
        let percentChange = 0;
        let absoluteChange = 0;

        if (activeData.length >= 2) {
            const latest = Number(activeData[activeData.length - 1]?.pv || 0);
            const previous = Number(activeData[activeData.length - 2]?.pv || 0);
            absoluteChange = latest - previous;
            if (previous > 0) {
                percentChange = (absoluteChange / previous) * 100;
            } else if (latest > 0) {
                percentChange = 100;
            }
            isDecrease = absoluteChange < 0;
        }

        return { isDecrease, percentChange, absoluteChange };
    }, [activeData]);

    return {
        isMounted,
        loading,
        showWelcomeToast,
        setShowWelcomeToast,
        timeView,
        setTimeView,
        showDropdown,
        setShowDropdown,
        statsData,
        activeData,
        currentTotal,
        trend,
        chartScrollRef,
        fetchDashboardData
    };
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>;
