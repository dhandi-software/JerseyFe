import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { adminApi } from "~/api/admin";
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
            const [statsRes, adminRes] = await Promise.all([
                adminApi.getDashboardStats(),
                adminApi.getUserCountByRole("admin")
            ]);

            setStatsData(prev => ({
                ...prev,
                totalCustomer: Number(statsRes.data?.totalCustomer || 0),
                totalStaff: Number(statsRes.data?.totalStaff || 0),
                totalAdmin: Number(statsRes.data?.totalAdmin || adminRes.data?.count || 0),
                totalRevenue: Number(statsRes.data?.totalRevenue || 0),
                salesData: statsRes.data?.salesData || prev.salesData,
                recentCustomers: statsRes.data?.recentCustomers || [],
                recentChats: statsRes.data?.recentChats || [],
                totalUnreadChat: statsRes.data?.totalUnreadChat || 0,
                bestMonth: statsRes.data?.bestMonth || prev.bestMonth,
                bestYear: statsRes.data?.bestYear || prev.bestYear,
                topBuyer: statsRes.data?.topBuyer || prev.topBuyer,
                newOrders: statsRes.data?.newOrders || prev.newOrders
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
