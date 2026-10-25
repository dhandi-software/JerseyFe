import { useWishlistContext } from "~/context/WishlistContext";
import type { WishlistContextType } from "~/types/wishlist";

export function useWishlist(): WishlistContextType {
  return useWishlistContext();
}
