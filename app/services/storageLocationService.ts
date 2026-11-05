import { client } from "~/api/client";
import type {
  StorageLocation,
  CreateStorageLocationInput,
  UpdateStorageLocationInput,
} from "~/types/storageLocation";

export const storageLocationService = {
  async getAllLocations(): Promise<StorageLocation[]> {
    const response = await client.get<{ status: string; data: StorageLocation[] }>("/storage-locations");
    return response.data?.data || [];
  },

  async getLocationById(id: number): Promise<StorageLocation> {
    const response = await client.get<{ status: string; data: StorageLocation }>(`/storage-locations/${id}`);
    return response.data?.data;
  },

  async createLocation(data: CreateStorageLocationInput): Promise<StorageLocation> {
    const response = await client.post<{ status: string; message: string; data: StorageLocation }>(
      "/storage-locations",
      data
    );
    return response.data?.data;
  },

  async updateLocation(id: number, data: UpdateStorageLocationInput): Promise<StorageLocation> {
    const response = await client.put<{ status: string; message: string; data: StorageLocation }>(
      `/storage-locations/${id}`,
      data
    );
    return response.data?.data;
  },

  async deleteLocation(id: number): Promise<{ success: boolean; message: string }> {
    const response = await client.delete<{ status: string; message: string }>(`/storage-locations/${id}`);
    return { success: true, message: response.data?.message || "Lokasi berhasil dihapus" };
  },

  async assignOrderLocation(orderId: number | string, storageLocationId: number | null): Promise<any> {
    const response = await client.patch<{ status: string; message: string; data: any }>(
      `/orders/${orderId}/storage-location`,
      { storageLocationId }
    );
    return response.data?.data;
  },
};
