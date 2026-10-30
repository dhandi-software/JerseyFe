import type React from "react";
import type { LucideIcon } from "lucide-react";
import type {
    ArticleDetail,
    NewsListItem,
    VideoListItem,
    AdvertisementResponse,
} from "~/api/types";

export interface UseArticleReturn {
    article: ArticleDetail | null;
    relatedNews: NewsListItem[];
    videos: VideoListItem[];
    ads: AdvertisementResponse[];
    loading: boolean;
    errors: {
        article?: string;
        relatedNews?: string;
        videos?: string;
    };
}

export interface UseHomeReturn {
    latestNews: NewsListItem[];
    trendingVideos: VideoListItem[];
    nickelNews: NewsListItem[];
    miningNews: NewsListItem[];
    marketNews: NewsListItem[];
    technologyNews: NewsListItem[];
    trendingNews: NewsListItem[];
    headlineNews: NewsListItem[];
    exclusiveInterviewNews: NewsListItem[];
    loading: boolean;
    errors: {
        latestNews?: string;
        trendingVideos?: string;
        nickelNews?: string;
        miningNews?: string;
        marketNews?: string;
        technologyNews?: string;
        trendingNews?: string;
        headlineNews?: string;
        exclusiveInterviewNews?: string;
    };
}

export interface HomeCategoryStripItem {
    id: string;
    label: string;
    count: number;
    icon: LucideIcon;
}

export interface HomeFilterOption {
    id: string;
    label: string;
    count: number;
}

export interface HomeCatalogCardItem {
    id: string;
    sku: string;
    title: string;
    brand: string;
    category: string;
    materialGroup: string;
    price: number;
    formattedPrice: string;
    dpEstimate: number;
    formattedDpEstimate: string;
    stock: number;
    stockLabel: string;
    isAvailable: boolean;
    isLowStock: boolean;
    isFeatured: boolean;
    badgeLabel: string;
    description: string;
    image: string;
}

export interface HomeCompanyHighlightCard {
    eyebrowLeft: string;
    eyebrowRight: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
}

export interface HomeCompanyProfileInfo {
    headline: string;
    tagline: string;
    summaryQuote: string;
    servicesDescription: string;
    qualityCommitment: string;
    workshopAddress: string;
    heroImage: string;
    leftCard: HomeCompanyHighlightCard;
    rightCard: HomeCompanyHighlightCard;
    serviceTags: string[];
}

export interface UseHomeCatalogReturn {
    companyProfile: HomeCompanyProfileInfo;
    categoriesStrip: HomeCategoryStripItem[];
    categoryFilterOptions: HomeFilterOption[];
    materialFilterOptions: HomeFilterOption[];
    allCatalogItems: HomeCatalogCardItem[];
    filteredCatalogItems: HomeCatalogCardItem[];
    loading: boolean;
    error: string | null;
    activeCategoryStrip: string;
    selectedCategories: string[];
    selectedMaterials: string[];
    onlyAvailable: boolean;
    onlyFeatured: boolean;
    bulkOrderReady: boolean;
    searchQuery: string;
    minPriceInput: string;
    maxPriceInput: string;
    mobileFilterOpen: boolean;
    addedCartIds: Record<string, boolean>;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    setMinPriceInput: React.Dispatch<React.SetStateAction<string>>;
    setMaxPriceInput: React.Dispatch<React.SetStateAction<string>>;
    setOnlyAvailable: React.Dispatch<React.SetStateAction<boolean>>;
    setOnlyFeatured: React.Dispatch<React.SetStateAction<boolean>>;
    setBulkOrderReady: React.Dispatch<React.SetStateAction<boolean>>;
    setMobileFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSelectCategoryStrip: (categoryId: string) => void;
    handleToggleCategoryCheckbox: (categoryName: string) => void;
    handleToggleMaterialCheckbox: (materialName: string) => void;
    handleResetFilters: () => void;
    handleAddToCart: (item: HomeCatalogCardItem) => void;
    handleToggleWishlist: (item: HomeCatalogCardItem) => void;
    isProductInWishlist: (id: string) => boolean;
    fetchProducts: () => Promise<void>;
}

export interface HomeHeroSectionProps {
    companyProfile: HomeCompanyProfileInfo;
    totalProducts: number;
    variant?: "desktop" | "mobile";
    onScrollToCatalog?: () => void;
}

export interface HomeCategoryStripSectionProps {
    categories: HomeCategoryStripItem[];
    activeCategoryId: string;
    onSelectCategory: (categoryId: string) => void;
    variant?: "desktop" | "mobile";
}

export interface UseCategoryStripScrollReturn {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    hasOverflow: boolean;
    canScrollLeft: boolean;
    canScrollRight: boolean;
    handleScrollLeft: () => void;
    handleScrollRight: () => void;
}

export interface HomeFilterSidebarProps {
    totalMatched: number;
    onlyAvailable: boolean;
    onToggleOnlyAvailable: () => void;
    onlyFeatured: boolean;
    onToggleOnlyFeatured: () => void;
    bulkOrderReady: boolean;
    onToggleBulkOrderReady: () => void;
    categoryOptions: HomeFilterOption[];
    selectedCategories: string[];
    onToggleCategory: (categoryName: string) => void;
    materialOptions: HomeFilterOption[];
    selectedMaterials: string[];
    onToggleMaterial: (materialName: string) => void;
    minPriceInput: string;
    maxPriceInput: string;
    onMinPriceChange: (val: string) => void;
    onMaxPriceChange: (val: string) => void;
    onResetFilters: () => void;
    variant?: "desktop" | "mobile";
}

export interface HomeCatalogProductCardProps {
    item: HomeCatalogCardItem;
    isAddedToCart: boolean;
    isWishlisted: boolean;
    onAddToCart: (item: HomeCatalogCardItem) => void;
    onToggleWishlist: (item: HomeCatalogCardItem) => void;
    variant?: "desktop" | "mobile";
}

export interface HomeCompanyStorySectionProps {
    companyProfile: HomeCompanyProfileInfo;
    variant?: "desktop" | "mobile";
}
