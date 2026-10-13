import { cn } from "~/lib/utils";

interface CategoryProductSkeletonProps {
    className?: string;
}

export function CategoryProductSkeleton({ className }: CategoryProductSkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "overflow-hidden flex flex-col h-full border border-neutral-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[2.5rem] bg-white animate-pulse",
                className
            )}
        >
            {/* Image Placeholder */}
            <div className="relative aspect-square overflow-hidden bg-neutral-100 shrink-0">
                <div className="absolute top-4 right-4 h-6 w-20 bg-neutral-200/80 rounded-2xl" />
            </div>

            {/* Header Content */}
            <div className="p-6 pb-0 flex flex-col gap-2">
                <div className="h-2.5 w-14 bg-neutral-200/60 rounded-md" />
                <div className="h-4 w-3/4 bg-neutral-200/80 rounded-md" />
            </div>

            {/* Price Content */}
            <div className="p-6 pt-4 flex-1 flex flex-col justify-end">
                <div className="h-6 w-1/2 bg-neutral-200/80 rounded-lg" />
            </div>

            {/* Footer Action */}
            <div className="p-6 pt-0">
                <div className="h-12 w-full bg-neutral-200/70 rounded-2xl" />
            </div>
        </div>
    );
}

interface CategoryProductGridSkeletonProps {
    count?: number;
    className?: string;
}

export function CategoryProductGridSkeleton({ count = 4, className }: CategoryProductGridSkeletonProps) {
    return (
        <div
            role="status"
            aria-label="Memuat daftar bahan jersey..."
            aria-busy="true"
            className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}
        >
            <span className="sr-only">Sedang memuat data bahan jersey...</span>
            {Array.from({ length: count }).map((_, index) => (
                <CategoryProductSkeleton key={index} />
            ))}
        </div>
    );
}
