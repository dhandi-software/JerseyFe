export interface MediaItem {
    id: string;
    url: string;
    name: string;
    extension: string;
    file?: File;
    isLoading?: boolean;
}

export interface MediaPagination {
    page: number;
    limit: number;
    totalRows: number;
    totalPages: number;
}

export interface MediaContextType {
    mediaItems: MediaItem[];
    setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
    addMediaItems: (files: File[]) => Promise<void>;
    deleteMediaItems: (ids: string[]) => Promise<void>;
    updateMediaItem: (itemId: string, newName: string) => Promise<void>;
    refreshMedia: (filter?: {
        search?: string;
        page?: number;
        limit?: number;
        type?: string;
    }) => Promise<void>;
    pagination: MediaPagination | null;
    isLoading: boolean;
}
