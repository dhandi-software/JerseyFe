import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    LayoutGrid,
    Shirt,
    Trophy,
    Layers,
    Palette,
    Users,
    ShieldCheck,
} from "lucide-react";
import { newsApi } from "~/api/news";
import { videoApi } from "~/api/video";
import { useProducts } from "~/hooks/useProducts";
import { useWishlist } from "~/hooks/useWishlist";
import { useCart } from "~/context/CartContext";
import type { NewsListItem, VideoListItem } from "~/api/types";
import type {
    HomeCatalogCardItem,
    HomeCategoryStripItem,
    HomeCompanyProfileInfo,
    HomeFilterOption,
    UseCategoryStripScrollReturn,
    UseHomeCatalogReturn,
    UseHomeReturn,
} from "~/types";

export const FCSV_COMPANY_PROFILE: HomeCompanyProfileInfo = {
    headline:
        "Konveksi Custom Jersey & Katalog Bahan Olahraga dalam Satu Platform",
    tagline: "FCSV Apparel Indonesia",
    summaryQuote:
        "FCSV Apparel adalah brand konveksi custom jersey yang bergerak di bidang produksi dan penjualan jersey olahraga berkualitas dengan konsep desain modern, nyaman digunakan, serta dapat disesuaikan dengan identitas tim maupun komunitas.",
    servicesDescription:
        "Kami melayani pembuatan berbagai jenis jersey custom mulai dari sepak bola, futsal, basket, badminton, voli, esport, running, hingga kebutuhan seragam komunitas dan instansi.",
    qualityCommitment:
        "Dengan mengutamakan kualitas bahan dryfit pilihan, detail cetak sublimasi beresolusi tinggi, serta ketepatan waktu produksi, setiap pesanan dapat dipantau langsung mulai dari tahap verifikasi, mockup desain, pola layout, cetak kain, hingga jahit finishing.",
    workshopAddress:
        "Jalan Raya Cikande Kopo, Kp. Padaharan, Ds. Rancasumur RT 001/RW 001, Kec. Kopo, Kab. Serang, Banten 42178",
    heroImage: "/images/FCSV_Brand.png",
    leftCard: {
        eyebrowLeft: "Profil Perusahaan:",
        eyebrowRight: "100% Custom & Sublimasi",
        title: "FCSV Apparel Indonesia",
        description:
            "Konveksi spesialis jersey olahraga custom dengan bahan dryfit breathable, warna sublimasi tajam, dan jahitan presisi untuk tim, sekolah, maupun korporasi.",
        primaryCtaLabel: "Pesan Custom Jersey",
        primaryCtaHref: "/customer/custom-jersey",
        secondaryCtaLabel: "Profil Lengkap",
        secondaryCtaHref: "/about",
    },
    rightCard: {
        eyebrowLeft: "Transparansi Produksi:",
        eyebrowRight: "Real-Time Tracking",
        title: "Pantau Desain, Layout & Produksi",
        description:
            "Setiap pesanan dilengkapi persetujuan mockup desain, pengecekan pola layout, serta pembaruan status baju dan celana per anggota tim secara transparan.",
        primaryCtaLabel: "Jelajahi Katalog",
        primaryCtaHref: "#katalog-produk",
        secondaryCtaLabel: "Lacak Pesanan",
        secondaryCtaHref: "/tracking",
    },
    serviceTags: [
        "Sepak Bola & Futsal",
        "Basket & Voli",
        "Badminton & Running",
        "Esport & Komunitas",
        "Sublimasi Full Print",
    ],
};

function deriveMaterialGroup(title: string, description: string): string {
    const combined = `${title} ${description}`.toLowerCase();
    if (combined.includes("milano")) return "Dryfit Milano";
    if (combined.includes("brazil")) return "Dryfit Brazil";
    if (combined.includes("mesh") || combined.includes("bintik"))
        return "Dryfit Mesh";
    if (combined.includes("serena")) return "Jersey Serena";
    if (combined.includes("paragon")) return "Jersey Paragon";
    if (combined.includes("waffle")) return "Dryfit Waffle";
    if (combined.includes("twist")) return "Dryfit Twist";
    if (combined.includes("dri-fit") || combined.includes("dryfit"))
        return "Dryfit Standar";
    return "Material Pilihan FCSV";
}

function getCategoryIcon(categoryName: string) {
    const lower = categoryName.toLowerCase();
    if (lower.includes("futsal") || lower.includes("dri-fit")) return Shirt;
    if (lower.includes("bola") || lower.includes("pro")) return Trophy;
    if (lower.includes("basket") || lower.includes("running")) return Users;
    if (lower.includes("sublimasi") || lower.includes("setelan")) return Palette;
    if (lower.includes("bahan") || lower.includes("kain")) return Layers;
    return ShieldCheck;
}

export function useHomeCatalog(): UseHomeCatalogReturn {
    const { products, loading, error, fetchProducts } = useProducts();
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();

    const [activeCategoryStrip, setActiveCategoryStrip] = useState<string>("ALL");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
    const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
    const [bulkOrderReady, setBulkOrderReady] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [minPriceInput, setMinPriceInput] = useState<string>("");
    const [maxPriceInput, setMaxPriceInput] = useState<string>("");
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
    const [addedCartIds, setAddedCartIds] = useState<Record<string, boolean>>({});

    const allCatalogItems = useMemo<HomeCatalogCardItem[]>(() => {
        return products.map((p) => {
            const rawPrice = Number(p.price) || 0;
            const dpEstimate = Math.round(rawPrice * 0.5);
            const stock = Number(p.stock) || 0;
            const isAvailable = p.is_active !== false && stock > 0;
            const isLowStock = isAvailable && stock <= 20;
            const description =
                p.short_description ||
                p.description ||
                "Bahan pakaian olahraga berdaya serap tinggi, lembut di kulit, dan mendukung cetak sublimasi warna tajam.";

            let badgeLabel = "Ready Stock";
            if (!isAvailable) {
                badgeLabel = "Stok Habis";
            } else if (isLowStock) {
                badgeLabel = "Stok Menipis";
            }

            return {
                id: String(p.id),
                sku: p.sku || `BAHAN-${p.id}`,
                title: p.title,
                brand: p.brand || "FCSV Authentic",
                category: p.category || "Koleksi Jersey Custom",
                materialGroup: deriveMaterialGroup(p.title, description),
                price: rawPrice,
                formattedPrice: `Rp ${rawPrice.toLocaleString("id-ID")}`,
                dpEstimate,
                formattedDpEstimate: `Rp ${dpEstimate.toLocaleString("id-ID")}`,
                stock,
                stockLabel:
                    stock > 0 ? `${stock} kg tersedia` : "Menunggu restock",
                isAvailable,
                isLowStock,
                isFeatured: Boolean(p.is_featured),
                badgeLabel,
                description,
                image: p.image || "/images/jersey_hero.webp",
            };
        });
    }, [products]);

    const categoryFilterOptions = useMemo<HomeFilterOption[]>(() => {
        const counts = new Map<string, number>();
        allCatalogItems.forEach((item) => {
            counts.set(item.category, (counts.get(item.category) || 0) + 1);
        });
        return Array.from(counts.entries()).map(([label, count]) => ({
            id: label,
            label,
            count,
        }));
    }, [allCatalogItems]);

    const materialFilterOptions = useMemo<HomeFilterOption[]>(() => {
        const counts = new Map<string, number>();
        allCatalogItems.forEach((item) => {
            counts.set(
                item.materialGroup,
                (counts.get(item.materialGroup) || 0) + 1,
            );
        });
        return Array.from(counts.entries()).map(([label, count]) => ({
            id: label,
            label,
            count,
        }));
    }, [allCatalogItems]);

    const categoriesStrip = useMemo<HomeCategoryStripItem[]>(() => {
        const base: HomeCategoryStripItem[] = [
            {
                id: "ALL",
                label: "Semua Katalog",
                count: allCatalogItems.length,
                icon: LayoutGrid,
            },
        ];

        categoryFilterOptions.forEach((opt) => {
            base.push({
                id: opt.id,
                label: opt.label,
                count: opt.count,
                icon: getCategoryIcon(opt.label),
            });
        });

        return base;
    }, [allCatalogItems.length, categoryFilterOptions]);

    const filteredCatalogItems = useMemo<HomeCatalogCardItem[]>(() => {
        const minPrice = minPriceInput.trim()
            ? Number(minPriceInput.replace(/\D/g, ""))
            : null;
        const maxPrice = maxPriceInput.trim()
            ? Number(maxPriceInput.replace(/\D/g, ""))
            : null;
        const cleanQuery = searchQuery.trim().toLowerCase();

        return allCatalogItems.filter((item) => {
            if (
                activeCategoryStrip !== "ALL" &&
                item.category !== activeCategoryStrip
            ) {
                return false;
            }
            if (
                selectedCategories.length > 0 &&
                !selectedCategories.includes(item.category)
            ) {
                return false;
            }
            if (
                selectedMaterials.length > 0 &&
                !selectedMaterials.includes(item.materialGroup)
            ) {
                return false;
            }
            if (onlyAvailable && !item.isAvailable) {
                return false;
            }
            if (onlyFeatured && !item.isFeatured) {
                return false;
            }
            if (bulkOrderReady && item.stock < 10) {
                return false;
            }
            if (minPrice !== null && !Number.isNaN(minPrice) && item.price < minPrice) {
                return false;
            }
            if (maxPrice !== null && !Number.isNaN(maxPrice) && maxPrice > 0 && item.price > maxPrice) {
                return false;
            }
            if (cleanQuery) {
                const hay =
                    `${item.title} ${item.category} ${item.materialGroup} ${item.description} ${item.sku}`.toLowerCase();
                if (!hay.includes(cleanQuery)) return false;
            }
            return true;
        });
    }, [
        allCatalogItems,
        activeCategoryStrip,
        selectedCategories,
        selectedMaterials,
        onlyAvailable,
        onlyFeatured,
        bulkOrderReady,
        minPriceInput,
        maxPriceInput,
        searchQuery,
    ]);

    const handleSelectCategoryStrip = (categoryId: string) => {
        setActiveCategoryStrip(categoryId);
        if (categoryId === "ALL") {
            setSelectedCategories([]);
        } else {
            setSelectedCategories([categoryId]);
        }
    };

    const handleToggleCategoryCheckbox = (categoryName: string) => {
        setSelectedCategories((prev) => {
            const exists = prev.includes(categoryName);
            const next = exists
                ? prev.filter((c) => c !== categoryName)
                : [...prev, categoryName];
            if (next.length === 1) {
                setActiveCategoryStrip(next[0]);
            } else {
                setActiveCategoryStrip("ALL");
            }
            return next;
        });
    };

    const handleToggleMaterialCheckbox = (materialName: string) => {
        setSelectedMaterials((prev) =>
            prev.includes(materialName)
                ? prev.filter((m) => m !== materialName)
                : [...prev, materialName],
        );
    };

    const handleResetFilters = () => {
        setActiveCategoryStrip("ALL");
        setSelectedCategories([]);
        setSelectedMaterials([]);
        setOnlyAvailable(false);
        setOnlyFeatured(false);
        setBulkOrderReady(false);
        setSearchQuery("");
        setMinPriceInput("");
        setMaxPriceInput("");
    };

    const handleAddToCart = (item: HomeCatalogCardItem) => {
        addToCart({
            id: item.id,
            title: item.title,
            price: item.formattedPrice,
            image: item.image,
        });
        setAddedCartIds((prev) => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedCartIds((prev) => ({ ...prev, [item.id]: false }));
        }, 1600);
    };

    const handleToggleWishlist = (item: HomeCatalogCardItem) => {
        addToWishlist({
            id: item.id,
            name: item.title,
            price: item.price,
            image: item.image,
            stockStatus: item.isAvailable ? "IN STOCK" : "OUT OF STOCK",
            category: item.category,
        });
    };

    const isProductInWishlist = (id: string) => isInWishlist(id);

    return {
        companyProfile: FCSV_COMPANY_PROFILE,
        categoriesStrip,
        categoryFilterOptions,
        materialFilterOptions,
        allCatalogItems,
        filteredCatalogItems,
        loading,
        error,
        activeCategoryStrip,
        selectedCategories,
        selectedMaterials,
        onlyAvailable,
        onlyFeatured,
        bulkOrderReady,
        searchQuery,
        minPriceInput,
        maxPriceInput,
        mobileFilterOpen,
        addedCartIds,
        setSearchQuery,
        setMinPriceInput,
        setMaxPriceInput,
        setOnlyAvailable,
        setOnlyFeatured,
        setBulkOrderReady,
        setMobileFilterOpen,
        handleSelectCategoryStrip,
        handleToggleCategoryCheckbox,
        handleToggleMaterialCheckbox,
        handleResetFilters,
        handleAddToCart,
        handleToggleWishlist,
        isProductInWishlist,
        fetchProducts,
    };
}

export function useCategoryStripScroll(
    itemCount: number,
): UseCategoryStripScrollReturn {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkOverflow = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const overflow = el.scrollWidth - el.clientWidth > 2;
        setHasOverflow(overflow);
        setCanScrollLeft(overflow && el.scrollLeft > 2);
        setCanScrollRight(
            overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
        );
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        checkOverflow();
        el.addEventListener("scroll", checkOverflow, { passive: true });
        window.addEventListener("resize", checkOverflow);

        let observer: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(() => checkOverflow());
            observer.observe(el);
        }

        return () => {
            el.removeEventListener("scroll", checkOverflow);
            window.removeEventListener("resize", checkOverflow);
            observer?.disconnect();
        };
    }, [checkOverflow, itemCount]);

    const handleScrollLeft = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: -260, behavior: "smooth" });
    };

    const handleScrollRight = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
    };

    return {
        scrollRef,
        hasOverflow,
        canScrollLeft,
        canScrollRight,
        handleScrollLeft,
        handleScrollRight,
    };
}

export function useHome(): UseHomeReturn {
    const [latestNews, setLatestNews] = useState<NewsListItem[]>([]);
    const [trendingVideos, setTrendingVideos] = useState<VideoListItem[]>([]);
    const [nickelNews, setNickelNews] = useState<NewsListItem[]>([]);
    const [miningNews, setMiningNews] = useState<NewsListItem[]>([]);
    const [marketNews, setMarketNews] = useState<NewsListItem[]>([]);
    const [technologyNews, setTechnologyNews] = useState<NewsListItem[]>([]);
    const [trendingNews, setTrendingNews] = useState<NewsListItem[]>([]);
    const [headlineNews, setHeadlineNews] = useState<NewsListItem[]>([]);
    const [exclusiveInterviewNews, setExclusiveInterviewNews] = useState<
        NewsListItem[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<UseHomeReturn["errors"]>({});

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);

            const results = await Promise.allSettled([
                newsApi.getHeadlineNews(),
                newsApi.getPublishedNews({ order: "desc", limit: 6 }),
                videoApi.getVideos({ limit: 6, order: "desc" }),
                newsApi.getPublishedNews({
                    order: "desc",
                    limit: 6,
                    category: "nickel",
                }),
                newsApi.getPublishedNews({
                    order: "desc",
                    limit: 6,
                    category: "mining",
                }),
                newsApi.getPublishedNews({
                    order: "desc",
                    limit: 6,
                    category: "market-investment",
                }),
                newsApi.getPublishedNews({
                    order: "desc",
                    limit: 6,
                    category: "technology",
                }),
                newsApi.getPublishedNews({
                    order: "desc",
                    limit: 6,
                    isTrending: true,
                }),
                newsApi.getPublishedNews({
                    order: "desc",
                    limit: 3,
                    category: "exclusive-interview",
                }),
            ]);

            const newErrors: UseHomeReturn["errors"] = {};

            if (results[0].status === "fulfilled") {
                setHeadlineNews(results[0].value.data || []);
            } else {
                console.error("Error fetching headline news:", results[0].reason);
                newErrors.headlineNews = "Failed to load headline news";
            }

            if (results[1].status === "fulfilled") {
                setLatestNews(results[1].value.data);
            } else {
                console.error("Error fetching latest news:", results[1].reason);
                newErrors.latestNews = "Failed to load latest news";
            }

            if (results[2].status === "fulfilled") {
                setTrendingVideos(results[2].value.data);
            } else {
                console.error("Error fetching videos:", results[2].reason);
                newErrors.trendingVideos = "Failed to load videos";
            }

            if (results[3].status === "fulfilled") {
                setNickelNews(results[3].value.data);
            } else {
                console.error("Error fetching nickel news:", results[3].reason);
                newErrors.nickelNews = "Failed to load nickel news";
            }

            if (results[4].status === "fulfilled") {
                setMiningNews(results[4].value.data);
            } else {
                console.error("Error fetching mining news:", results[4].reason);
                newErrors.miningNews = "Failed to load mining news";
            }

            if (results[5].status === "fulfilled") {
                setMarketNews(results[5].value.data);
            } else {
                console.error("Error fetching market news:", results[5].reason);
                newErrors.marketNews = "Failed to load market news";
            }

            if (results[6].status === "fulfilled") {
                setTechnologyNews(results[6].value.data);
            } else {
                console.error(
                    "Error fetching technology news:",
                    results[6].reason,
                );
                newErrors.technologyNews = "Failed to load technology news";
            }

            if (results[7].status === "fulfilled") {
                setTrendingNews(results[7].value.data);
            } else {
                console.error("Error fetching trending news:", results[7].reason);
                newErrors.trendingNews = "Failed to load trending news";
            }

            if (results[8].status === "fulfilled") {
                setExclusiveInterviewNews(results[8].value.data);
            } else {
                console.error(
                    "Error fetching exclusive interview news:",
                    results[8].reason,
                );
                newErrors.exclusiveInterviewNews =
                    "Failed to load exclusive interview news";
            }

            setErrors(newErrors);
            setLoading(false);
        };

        fetchAllData();
    }, []);

    return {
        latestNews,
        trendingVideos,
        nickelNews,
        miningNews,
        marketNews,
        technologyNews,
        trendingNews,
        headlineNews,
        exclusiveInterviewNews,
        loading,
        errors,
    };
}
