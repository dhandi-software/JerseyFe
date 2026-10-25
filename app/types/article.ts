import type { MediaItem } from "./media";

export interface NewsRequest {
    title: string;
    sub_heading: string;
    set_headline: boolean;
    media_id: string;
    image_caption: string;
    body: string;
    status: "draft" | "published";
    categories: number[];
    topics: string[];
    scheduled_at: string | null;
}

export interface UseCreateArticleOptions {
    articleId?: string;
}

export interface ArticleErrors {
    image: boolean;
    imageCaption: boolean;
    title: boolean;
    subHeading: boolean;
    category: boolean;
}

export interface ArticlePreviewData {
    title: string;
    caption: string;
    topics: string[];
    articleContent: string;
    image: string | null;
}

export interface UseCreateArticleReturn {
    states: {
        title: string;
        subHeading: string;
        imageCaption: string;
        content: string;
        errors: ArticleErrors;
        selectedCategories: number[];
        topics: string[];
        topicInput: string;
        selectedImage: MediaItem | null;
        isHeadline: boolean;
        showMediaPopup: boolean;
        showAdvertisementPopup: boolean;
        showPreview: boolean;
        isLoading: boolean;
        toastProps: {
            title: string;
            variant: "success" | "destructive" | "default";
        } | null;
        publishMethod: "now" | "scheduled";
        scheduledDate: string;
        scheduledTime: string;
        isEditMode: boolean;
        isFetchingArticle: boolean;
        showDeletePopup: boolean;
        isDeleting: boolean;
    };
    refs: {
        editorRef: React.RefObject<HTMLDivElement | null>;
    };
    setters: {
        setTitle: React.Dispatch<React.SetStateAction<string>>;
        setSubHeading: React.Dispatch<React.SetStateAction<string>>;
        setImageCaption: React.Dispatch<React.SetStateAction<string>>;
        setContent: React.Dispatch<React.SetStateAction<string>>;
        setTopicInput: React.Dispatch<React.SetStateAction<string>>;
        setIsHeadline: React.Dispatch<React.SetStateAction<boolean>>;
        setShowMediaPopup: React.Dispatch<React.SetStateAction<boolean>>;
        setShowAdvertisementPopup: React.Dispatch<React.SetStateAction<boolean>>;
        setPublishMethod: React.Dispatch<React.SetStateAction<"now" | "scheduled">>;
        setScheduledDate: React.Dispatch<React.SetStateAction<string>>;
        setScheduledTime: React.Dispatch<React.SetStateAction<string>>;
        setShowDeletePopup: React.Dispatch<React.SetStateAction<boolean>>;
    };
    handlers: {
        handleImageSelect: (mediaItem: MediaItem) => void;
        handleRemoveImage: () => void;
        handleAddTopic: (e?: React.KeyboardEvent<HTMLInputElement>) => void;
        handleRemoveTopic: (topicToRemove: string) => void;
        handleCategoryChange: (
            categories: { id: string; label: string; checked: boolean }[],
        ) => void;
        handlePublish: () => Promise<void>;
        handleSaveDraft: () => Promise<void>;
        handlePreview: () => void;
        handleBackFromPreview: () => void;
        getPreviewData: () => ArticlePreviewData;
        handleCancel: () => void;
        clearFieldError: (field: keyof ArticleErrors) => void;
        handleDeleteArticle: () => Promise<void>;
    };
}
