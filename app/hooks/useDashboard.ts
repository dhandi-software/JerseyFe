import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { adminApi } from "~/api/admin";
import { orderService } from "~/services/orderService";
import { computeDashboardStatsFromOrders } from "~/lib/omsetRevenueUtils";
import { MONTHS, START_YEAR } from "~/features/admin/omset/constants";
import type { TimeView, DashboardStatsData, MonthOption } from "~/types";

export function useDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showWelcomeToast, setShowWelcomeToast] = useState(false);
    const [timeView, setTimeViewState] = useState<TimeView>('daily');
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

    const [showDropdown, setShowDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const monthDropdownRef = useRef<HTMLDivElement>(null);
    const chartScrollRef = useRef<HTMLDivElement>(null);

    const [rawOrdersCache, setRawOrdersCache] = useState<any[] | null>(null);

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

    const currentYear = new Date().getFullYear();
    const currentMonthVal = new Date().getMonth() + 1;
    const currentDayVal = new Date().getDate();

    const years = useMemo(() => {
        const list: number[] = [];
        for (let y = currentYear; y >= START_YEAR; y--) {
            list.push(y);
        }
        return list;
    }, [currentYear]);

    const filteredMonths: MonthOption[] = useMemo(() => {
        const activeYear = selectedYear || currentYear;
        return activeYear === currentYear
            ? MONTHS.filter(m => m.value <= currentMonthVal)
            : MONTHS;
    }, [selectedYear, currentYear, currentMonthVal]);

    const setTimeView = useCallback((view: TimeView) => {
        setTimeViewState(view);
        setShowDropdown(false);
        setShowYearDropdown(false);
        setShowMonthDropdown(false);

        if (view === 'monthly') {
            setSelectedYear(prev => prev || new Date().getFullYear());
        } else if (view === 'yearly') {
            setSelectedMonth(undefined);
            setSelectedYear(undefined);
        } else {
            setSelectedYear(undefined);
            setSelectedMonth(undefined);
        }
    }, []);

    // Keep month selection valid if user switches year back to currentYear
    useEffect(() => {
        if (selectedYear === currentYear && selectedMonth && selectedMonth > currentMonthVal) {
            setSelectedMonth(undefined);
        }
    }, [selectedYear, selectedMonth, currentYear, currentMonthVal]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setShowDropdown(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(target)) {
                setShowYearDropdown(false);
            }
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(target)) {
                setShowMonthDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            if (rawOrders !== null) {
                setRawOrdersCache(rawOrders);
            }
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
        if (rawOrdersCache !== null) {
            if (timeView === 'monthly') {
                const targetYear = selectedYear || currentYear;
                if (selectedMonth) {
                    const computed = computeDashboardStatsFromOrders(rawOrdersCache, {
                        year: targetYear,
                        month: selectedMonth
                    });
                    if (targetYear === currentYear && selectedMonth === currentMonthVal) {
                        return computed.salesData.daily.filter(d => {
                            const dayNum = parseInt(d.name.split(' ')[0], 10);
                            return isNaN(dayNum) || dayNum <= currentDayVal;
                        });
                    }
                    return computed.salesData.daily;
                }
                const computed = computeDashboardStatsFromOrders(rawOrdersCache, {
                    year: targetYear
                });
                return computed.salesData.monthly;
            }

            if (timeView === 'yearly' && selectedYear) {
                const computed = computeDashboardStatsFromOrders(rawOrdersCache, {
                    year: selectedYear
                });
                return computed.salesData.monthly;
            }
        }

        return statsData.salesData[timeView] || [];
    }, [
        rawOrdersCache,
        statsData.salesData,
        timeView,
        selectedYear,
        selectedMonth,
        currentYear,
        currentMonthVal,
        currentDayVal
    ]);

    const currentTotal = useMemo(() => {
        return activeData.reduce((sum, item) => sum + (Number(item.pv) || 0), 0);
    }, [activeData]);

    // Auto-scroll chart to the right when populated
    useEffect(() => {
        const isEmpty = currentTotal === 0 || activeData.every(item => Number(item.pv || 0) === 0);
        if (chartScrollRef.current && !isEmpty) {
            chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
        }
    }, [timeView, selectedYear, selectedMonth, statsData, currentTotal, activeData]);

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
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        showDropdown,
        setShowDropdown,
        showYearDropdown,
        setShowYearDropdown,
        showMonthDropdown,
        setShowMonthDropdown,
        dropdownRef,
        yearDropdownRef,
        monthDropdownRef,
        years,
        filteredMonths,
        statsData,
        activeData,
        currentTotal,
        trend,
        chartScrollRef,
        fetchDashboardData
    };
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>;
