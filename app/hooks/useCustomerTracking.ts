import { useState, useCallback, useRef } from "react";
import { orderService } from "~/services/orderService";
import type {
  CustomerSuggestion,
  CustomerHistoryResponse,
} from "~/types/customerTracking";

export function useCustomerTracking() {
  const [suggestions, setSuggestions] = useState<CustomerSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSuggestion | null>(null);

  const [historyData, setHistoryData] = useState<CustomerHistoryResponse | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchCustomers = useCallback((query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await orderService.suggestCustomers(trimmed);
        if (response?.success && Array.isArray(response.customers)) {
          setSuggestions(response.customers);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Gagal mengambil saran pelanggan:", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);
  }, []);

  const selectCustomer = useCallback((customer: CustomerSuggestion) => {
    setSelectedCustomer(customer);
    setSuggestions([]);
  }, []);

  const clearSelectedCustomer = useCallback(() => {
    setSelectedCustomer(null);
    setHistoryData(null);
  }, []);

  const fetchHistory = useCallback(
    async (params: { phone?: string; name?: string; customerId?: number }) => {
      setIsLoadingHistory(true);
      setHistoryError(null);
      try {
        const response = await orderService.getCustomerHistory(params);
        if (response?.success) {
          setHistoryData(response);
          return response;
        } else {
          setHistoryError("Data riwayat pesanan tidak ditemukan.");
          return null;
        }
      } catch (err: any) {
        const msg = err.response?.data?.error || err.message || "Gagal mengambil riwayat pesanan";
        setHistoryError(msg);
        return null;
      } finally {
        setIsLoadingHistory(false);
      }
    },
    []
  );

  const openHistoryModal = useCallback(() => {
    setIsHistoryModalOpen(true);
    if (selectedCustomer) {
      fetchHistory({
        phone: selectedCustomer.customerPhone || undefined,
        name: selectedCustomer.customerName || undefined,
      });
    }
  }, [selectedCustomer, fetchHistory]);

  const closeHistoryModal = useCallback(() => {
    setIsHistoryModalOpen(false);
  }, []);

  return {
    suggestions,
    isLoadingSuggestions,
    selectedCustomer,
    setSelectedCustomer,
    selectCustomer,
    clearSelectedCustomer,
    searchCustomers,
    historyData,
    isLoadingHistory,
    historyError,
    isHistoryModalOpen,
    openHistoryModal,
    closeHistoryModal,
    fetchHistory,
  };
}
