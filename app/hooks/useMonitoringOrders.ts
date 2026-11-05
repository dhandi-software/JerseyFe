/**
 * useMonitoringOrders Hook
 * Manages order fetching, filtering, searching, sorting, pagination, and metadata.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 Hooks Decomposition)
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { orderService } from "~/services/orderService";
import { adminApi } from "~/api/admin";
import { formatOrderData } from "~/features/admin/monitoring-pesanan/utils";
import type {
  MonitoringOrder,
  DesignerItem,
  BahanItem,
  MonitoringFilterTab,
  MonitoringSortOption,
} from "~/types";

export function useMonitoringOrders() {
  const [orders, setOrders] = useState<MonitoringOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [designers, setDesigners] = useState<DesignerItem[]>([]);
  const [bahanList, setBahanList] = useState<BahanItem[]>([]);

  // Filter, search, and sort states
  const [filterTab, setFilterTab] = useState<MonitoringFilterTab>("MENUNGGU");
  const [locationFilter, setLocationFilter] = useState<number | "all" | "unassigned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<MonitoringSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const itemsPerPage = 10;
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Expandable member rows and sub-searches
  const [expandedOrderRowId, setExpandedOrderRowId] = useState<number | null>(null);
  const [subSearchQueries, setSubSearchQueries] = useState<Record<number, string>>({});
  const [debouncedSubSearchQueries, setDebouncedSubSearchQueries] = useState<Record<number, string>>({});

  // Reset pagination when search, sort, or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, filterTab, locationFilter]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce sub-search inputs (200ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSubSearchQueries(subSearchQueries);
    }, 200);
    return () => clearTimeout(handler);
  }, [subSearchQueries]);

  // Fetch orders from API with optional search query
  const fetchOrders = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(
        query && query.trim() ? { search: query.trim() } : undefined,
      );
      setOrders(formatOrderData(data));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce main search (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      fetchOrders(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchOrders]);

  // Fetch initial metadata: designers and fabrics
  const fetchDesignersList = useCallback(async () => {
    try {
      const designersRes = await adminApi.getDesigners();
      if (Array.isArray(designersRes?.data)) {
        setDesigners(designersRes.data);
      } else if (Array.isArray(designersRes)) {
        setDesigners(designersRes);
      }
    } catch (error) {
      console.error("Error fetching designers:", error);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const [designersResult, bahanResult] = await Promise.allSettled([
        adminApi.getDesigners(),
        adminApi.getBahanBaju(),
      ]);

      if (designersResult.status === "fulfilled") {
        const dData = designersResult.value?.data ?? designersResult.value;
        if (Array.isArray(dData)) setDesigners(dData);
      }
      if (
        bahanResult.status === "fulfilled" &&
        bahanResult.value?.status === "success"
      ) {
        setBahanList(bahanResult.value.data);
      }
    };

    fetchInitialData();
  }, []);

  // Auto-expand row when search matches member name or number
  useEffect(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    if (q) {
      const matched = orders.find((o) =>
        (o.details || []).some(
          (d: any) =>
            d.playerName?.toLowerCase().includes(q) ||
            d.playerNumber?.toString().toLowerCase().includes(q),
        ),
      );
      if (matched) {
        setExpandedOrderRowId(matched.rawId);
      }
    }
  }, [debouncedSearchQuery, orders]);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (filterTab !== "ALL") {
          const status = (o.status || "").toUpperCase();
          if (
            filterTab === "MENUNGGU" &&
            status !== "MENUNGGU" &&
            status !== "MENUNGGU VERIFIKASI"
          ) {
            return false;
          } else if (filterTab !== "MENUNGGU" && status !== filterTab) {
            return false;
          }
        }

        // Filter by storage location when on SELESAI tab
        if (filterTab === "SELESAI" && locationFilter !== "all") {
          if (locationFilter === "unassigned") {
            if (o.storageLocationId) return false;
          } else if (typeof locationFilter === "number") {
            if (o.storageLocationId !== locationFilter) return false;
          }
        }

        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const matchId = o.id && o.id.toLowerCase().includes(query);
        const matchCustomer = o.customer && o.customer.toLowerCase().includes(query);
        const matchProduct = o.product && o.product.toLowerCase().includes(query);
        const matchMember = (o.details || []).some(
          (d: any) =>
            (d.playerName && d.playerName.toLowerCase().includes(query)) ||
            (d.playerNumber && d.playerNumber.toString().toLowerCase().includes(query)) ||
            (d.playerSize && d.playerSize.toLowerCase().includes(query)),
        );
        return matchId || matchCustomer || matchProduct || matchMember;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "name-asc") {
          return (a.customer || "").localeCompare(b.customer || "");
        }
        if (sortBy === "name-desc") {
          return (b.customer || "").localeCompare(a.customer || "");
        }
        if (sortBy === "price-highest") {
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        }
        if (sortBy === "price-lowest") {
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        }
        if (sortBy === "qty-highest") {
          return (b.qty || 0) - (a.qty || 0);
        }
        if (sortBy === "qty-lowest") {
          return (a.qty || 0) - (b.qty || 0);
        }
        return 0;
      });
  }, [orders, filterTab, locationFilter, searchQuery, sortBy]);

  // Pagination calculations
  const totalItems = filteredAndSortedOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    return filteredAndSortedOrders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  const getPageNumbers = useCallback(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages,
        );
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  // Quick stats counts
  const stats = useMemo(
    () => ({
      total: orders.length,
      menunggu: orders.filter(
        (o) => o.status === "MENUNGGU" || o.status === "MENUNGGU VERIFIKASI",
      ).length,
      desain: orders.filter((o) => o.status === "DESAIN").length,
      produksi: orders.filter((o) =>
        ["LAYOUT", "PRINT", "FINISHING"].includes(o.status),
      ).length,
      selesai: orders.filter((o) => o.status === "SELESAI").length,
    }),
    [orders],
  );

  const setSubSearch = useCallback((orderId: number, query: string) => {
    setSubSearchQueries((prev) => ({ ...prev, [orderId]: query }));
  }, []);

  return {
    orders,
    setOrders,
    loading,
    setLoading,
    designers,
    setDesigners,
    bahanList,
    setBahanList,
    filterTab,
    setFilterTab,
    locationFilter,
    setLocationFilter,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    sortBy,
    setSortBy,
    showSortDropdown,
    setShowSortDropdown,
    sortDropdownRef,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    paginatedOrders,
    getPageNumbers,
    stats,
    expandedOrderRowId,
    setExpandedOrderRowId,
    subSearchQueries,
    debouncedSubSearchQueries,
    setSubSearch,
    fetchOrders,
    fetchDesignersList,
  };
}
