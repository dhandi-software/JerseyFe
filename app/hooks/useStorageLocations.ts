import { useState, useEffect, useCallback, useMemo } from "react";
import { storageLocationService } from "~/services/storageLocationService";
import type {
  StorageLocation,
  CreateStorageLocationInput,
  UpdateStorageLocationInput,
  StorageLocationStats,
} from "~/types/storageLocation";

export function useStorageLocations(autoFetch: boolean = true) {
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [locationFilter, setLocationFilter] = useState<number | "all" | "unassigned">("all");

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storageLocationService.getAllLocations();
      setLocations(data);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Gagal mengambil lokasi penyimpanan";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchLocations();
    }
  }, [autoFetch, fetchLocations]);

  const createLocation = useCallback(async (input: CreateStorageLocationInput) => {
    const created = await storageLocationService.createLocation(input);
    await fetchLocations();
    return created;
  }, [fetchLocations]);

  const updateLocation = useCallback(async (id: number, input: UpdateStorageLocationInput) => {
    const updated = await storageLocationService.updateLocation(id, input);
    await fetchLocations();
    return updated;
  }, [fetchLocations]);

  const deleteLocation = useCallback(async (id: number) => {
    const res = await storageLocationService.deleteLocation(id);
    await fetchLocations();
    return res;
  }, [fetchLocations]);

  const assignOrderLocation = useCallback(async (orderId: number | string, storageLocationId: number | null) => {
    const updatedOrder = await storageLocationService.assignOrderLocation(orderId, storageLocationId);
    await fetchLocations(); // update order counts
    return updatedOrder;
  }, [fetchLocations]);

  const stats: StorageLocationStats = useMemo(() => {
    const totalLocations = locations.length;
    const activeLocations = locations.filter((l) => (l.orderCount || 0) > 0).length;
    const totalAssignedOrders = locations.reduce((acc, l) => acc + (l.orderCount || 0), 0);
    return { totalLocations, activeLocations, totalAssignedOrders };
  }, [locations]);

  return {
    locations,
    loading,
    error,
    selectedLocation,
    setSelectedLocation,
    isManagerOpen,
    setIsManagerOpen,
    locationFilter,
    setLocationFilter,
    stats,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    assignOrderLocation,
  };
}
