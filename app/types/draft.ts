export interface DraftArticle {
    id: string;
    title: string;
    caption: string;
    category: string;
    topics: string[];
    articleContent: string;
    image: string | null;
    createdAt: string;
    views: number;
}

export interface UseDraftOptions {
    itemsPerPage?: number;
}

export interface UseDraftReturn {
    drafts: DraftArticle[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    toastProps: { title: string; variant: "success" | "destructive" | "default" } | null;
    showToast: (title: string, variant?: "success" | "destructive" | "default") => void;
    hideToast: () => void;
    setCurrentPage: (page: number) => void;
    handleEdit: (draft: DraftArticle) => void;
    getTimeAgo: (dateString: string) => string;
    createEmptyDraft: (index: number) => DraftArticle;
    getDisplayData: () => DraftArticle[];
    handlePageChange: (page: number) => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    getPageNumbers: () => number[];
}
