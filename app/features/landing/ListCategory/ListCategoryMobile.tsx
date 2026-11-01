import { Search, Layers } from "lucide-react";
import { CardProduct } from "~/components/template/CardProduct";
import { cn } from "~/lib/utils";
import { CategoryProductGridSkeleton } from "./CategoryProductSkeleton";
import { CategoryEmptyState } from "./CategoryEmptyState";
import { CategoryPagination } from "./CategoryPagination";
import { useListCategory, MOBILE_ITEMS_PER_PAGE } from "~/hooks";

export function ListCategoryMobile() {
    const {
        materials,
        filteredProducts,
        paginatedProducts,
        currentPage,
        totalPages,
        startItemIndex,
        endItemIndex,
        handlePageChange,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories,
        handleViewDetail,
        refetch,
    } = useListCategory(MOBILE_ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-4 font-sans flex flex-col gap-5 pb-12">
            <div className="flex items-start justify-between gap-3 px-1 pt-1">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                        List Category
                    </h1>
                    <p className="text-xs font-medium text-slate-600 mt-1">
                        Katalog Bahan & Koleksi Jersey Admin FCSV
                    </p>
                </div>
                <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 shrink-0">
                    <Layers className="w-3.5 h-3.5 text-[#B83B14]" />
                    <span className="text-[11px] font-bold text-slate-700">
                        {loading ? "..." : `${materials.length} Bahan`}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-slate-900 transition-colors pointer-events-none" />
                    <input
                        type="text"
                        aria-label="Cari bahan atau produk jersey"
                        placeholder="Cari nama atau spesifikasi bahan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full min-h-[46px] pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 transition-all text-slate-900 placeholder:text-slate-500"
                    />
                </div>

                <div
                    role="tablist"
                    aria-label="Filter kategori bahan"
                    className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            role="tab"
                            aria-selected={selectedCategory === cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                                selectedCategory === cat
                                    ? "bg-slate-900 text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100",
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <CategoryProductGridSkeleton
                    count={4}
                    className="grid-cols-2 gap-3 mt-1"
                />
            ) : error ? (
                <CategoryEmptyState
                    type="error"
                    errorMessage={error}
                    onRetry={refetch}
                />
            ) : materials.length === 0 ? (
                <CategoryEmptyState type="no-data" />
            ) : filteredProducts.length === 0 ? (
                <CategoryEmptyState
                    type="not-found"
                    searchQuery={searchQuery}
                    onReset={() => {
                        setSearchQuery("");
                        setSelectedCategory("Semua");
                    }}
                />
            ) : (
                <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        {paginatedProducts.map((product) => (
                            <CardProduct
                                key={product.id}
                                product={product}
                                onPreview={handleViewDetail}
                                className="rounded-2xl sm:rounded-3xl"
                            />
                        ))}
                    </div>

                    <CategoryPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProducts.length}
                        startItemIndex={startItemIndex}
                        endItemIndex={endItemIndex}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
