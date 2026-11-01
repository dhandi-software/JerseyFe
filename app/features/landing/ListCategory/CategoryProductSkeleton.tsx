import { cn } from "~/lib/utils";

interface CategoryProductSkeletonProps {
    className?: string;
}

export function CategoryProductSkeleton({ className }: CategoryProductSkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "overflow-hidden flex flex-col h-full border border-neutral-200/80 shadow-xs rounded-3xl bg-white animate-pulse",
                className,
            )}
        >
            {/* Image Placeholder */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100 shrink-0">
                <div className="absolute top-3.5 right-3.5 h-6 w-24 bg-neutral-200/80 rounded-xl" />
            </div>

            {/* Header Content */}
            <div className="p-5 pb-0 flex flex-col gap-2">
                <div className="h-3 w-16 bg-neutral-200/70 rounded-md" />
                <div className="h-5 w-3/4 bg-neutral-200/90 rounded-md" />
            </div>

            {/* Description Content */}
            <div className="px-5 pt-3 pb-4 flex-1 flex flex-col gap-2">
                <div className="h-3 w-full bg-neutral-100 rounded-md" />
                <div className="h-3 w-2/3 bg-neutral-100 rounded-md" />
            </div>

            {/* Footer Action */}
            <div className="p-5 pt-0 flex gap-2.5">
                <div className="h-11 flex-1 bg-neutral-200/70 rounded-xl" />
                <div className="h-11 flex-1 bg-neutral-200/70 rounded-xl" />
            </div>
        </div>
    );
}

interface CategoryProductGridSkeletonProps {
    count?: number;
    className?: string;
}

export function CategoryProductGridSkeleton({
    count = 10,
    className,
}: CategoryProductGridSkeletonProps) {
    return (
        <div
            role="status"
            aria-label="Memuat daftar bahan jersey dari admin..."
            aria-busy="true"
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5",
                className,
            )}
        >
            <span className="sr-only">
                Sedang memuat daftar produk bahan jersey yang dibuat oleh admin...
            </span>
            {Array.from({ length: count }).map((_, index) => (
                <CategoryProductSkeleton key={index} />
            ))}
        </div>
    );
}
