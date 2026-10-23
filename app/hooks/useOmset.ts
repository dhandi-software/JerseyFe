import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { adminApi } from "~/api/admin";
import { downloadOmsetPDF } from "~/lib/sizeUtils";
import { MONTHS, START_YEAR } from "~/features/admin/omset/constants";
import type { TimeView, OmsetStatsData, MonthOption, SalesDataItem } from "~/types";

export function useOmset() {
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [timeView, setTimeView] = useState<TimeView>('monthly');
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);

    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const monthDropdownRef = useRef<HTMLDivElement>(null);
    const chartScrollRef = useRef<HTMLDivElement>(null);

    const [statsData, setStatsData] = useState<OmsetStatsData>({
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
        bestMonth: { month: "-", year: "-", pv: 0 },
        bestYear: { year: "-", totalRevenue: 0, totalQuantity: 0 }
    });

    // Fetch dashboard stats whenever filter year or month changes
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const params: { year?: number; month?: number } = {};
            if (selectedYear) params.year = selectedYear;
            if (selectedMonth) params.month = selectedMonth;

            const statsRes = await adminApi.getDashboardStats(params);
            if (statsRes.status === "success" && statsRes.data) {
                setStatsData(prev => ({
                    ...prev,
                    totalCustomer: Number(statsRes.data.totalCustomer || 0),
                    totalStaff: Number(statsRes.data.totalStaff || 0),
                    totalAdmin: Number(statsRes.data.totalAdmin || 0),
                    totalRevenue: Number(statsRes.data.totalRevenue || 0),
                    salesData: statsRes.data.salesData || prev.salesData,
                    bestMonth: statsRes.data.bestMonth || prev.bestMonth,
                    bestYear: statsRes.data.bestYear || prev.bestYear
                }));

                // Switch view automatically based on active filters
                if (selectedYear && selectedMonth) {
                    setTimeView('daily');
                } else if (selectedYear) {
                    setTimeView('monthly');
                }
            }
        } catch (error) {
            console.error("Error fetching omset data:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        setIsMounted(true);
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Prevent selecting a future month for the current calendar year
    useEffect(() => {
        const curYear = new Date().getFullYear();
        const curMonth = new Date().getMonth() + 1;
        if (selectedYear === curYear && selectedMonth && selectedMonth > curMonth) {
            setSelectedMonth(undefined);
            setTimeView('monthly');
        }
    }, [selectedYear, selectedMonth]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
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

    // Year selection range from current year back to START_YEAR
    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const list: number[] = [];
        for (let y = currentYear; y >= START_YEAR; y--) {
            list.push(y);
        }
        return list;
    }, []);

    const currentYear = new Date().getFullYear();
    const currentMonthVal = new Date().getMonth() + 1;
    const currentDayVal = new Date().getDate();

    const isCurrentYear = !selectedYear || selectedYear === currentYear;
    const isCurrentMonth = !selectedMonth || selectedMonth === currentMonthVal;

    // Filter data according to active timeView and current date bounds
    const activeData: SalesDataItem[] = useMemo(() => {
        let data = statsData.salesData[timeView] || [];
        if (timeView === 'monthly' && isCurrentYear) {
            data = data.slice(0, currentMonthVal);
        } else if (timeView === 'daily' && isCurrentYear && isCurrentMonth) {
            data = data.filter((item: any) => {
                const dayNum = parseInt(item.name, 10);
                return !isNaN(dayNum) && dayNum <= currentDayVal;
            });
        }
        return data;
    }, [statsData.salesData, timeView, isCurrentYear, isCurrentMonth, currentMonthVal, currentDayVal]);

    const currentTotal = useMemo(() => {
        return activeData.reduce((sum, item) => sum + (Number(item.pv) || 0), 0);
    }, [activeData]);

    const filteredMonths: MonthOption[] = useMemo(() => {
        return selectedYear === currentYear
            ? MONTHS.filter(m => m.value <= currentMonthVal)
            : MONTHS;
    }, [selectedYear, currentYear, currentMonthVal]);

    // Auto-scroll horizontal chart to latest data point on update
    useEffect(() => {
        const isEmpty = currentTotal === 0 || activeData.every(item => Number(item.pv || 0) === 0);
        if (chartScrollRef.current && !isEmpty) {
            chartScrollRef.current.scrollLeft = chartScrollRef.current.scrollWidth;
        }
    }, [timeView, statsData, currentTotal, activeData]);

    // Export current active omset data as PDF
    const exportOmsetPDF = useCallback(() => {
        let periodText = "Lifetime (Seluruh Waktu)";
        if (selectedYear && selectedMonth) {
            periodText = `Harian - ${MONTHS[selectedMonth - 1]?.label || selectedMonth} ${selectedYear}`;
        } else if (selectedYear) {
            periodText = `Bulanan - Tahun ${selectedYear}`;
        } else {
            if (timeView === 'daily') {
                periodText = "Harian (Bulan Ini)";
            } else if (timeView === 'monthly') {
                periodText = `Bulanan - Tahun ${new Date().getFullYear()}`;
            } else if (timeView === 'yearly') {
                periodText = "Tahunan";
            }
        }

        downloadOmsetPDF(activeData, periodText, currentTotal);
    }, [selectedYear, selectedMonth, timeView, activeData, currentTotal]);

    return {
        loading,
        isMounted,
        timeView,
        setTimeView,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        showYearDropdown,
        setShowYearDropdown,
        showMonthDropdown,
        setShowMonthDropdown,
        isReportModalOpen,
        setIsReportModalOpen,
        yearDropdownRef,
        monthDropdownRef,
        chartScrollRef,
        statsData,
        years,
        activeData,
        currentTotal,
        filteredMonths,
        exportOmsetPDF,
        fetchDashboardData
    };
}

export type UseOmsetReturn = ReturnType<typeof useOmset>;
