import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    product: any;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any, quantityToAdd?: number) => void;
    removeFromCart: (productId: number | string) => void;
    updateQuantity: (productId: number | string, delta: number) => void;
    clearCart: () => void;
    totalCount: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: any, quantityToAdd: number = 1) => {
        setCart(prev => {
            const existing = prev.find(item => String(item.product.id) === String(product.id));
            if (existing) {
                if (typeof product.stock === "number" && existing.quantity >= product.stock) return prev;
                return prev.map(item => 
                    String(item.product.id) === String(product.id) ? { ...item, quantity: item.quantity + quantityToAdd } : item
                );
            }
            return [...prev, { product, quantity: quantityToAdd }];
        });
    };

    const removeFromCart = (productId: number | string) => {
        setCart(prev => prev.filter(item => String(item.product.id) !== String(productId)));
    };

    const updateQuantity = (productId: number | string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (String(item.product.id) === String(productId)) {
                const newQty = item.quantity + delta;
                if (newQty < 1) return item;
                if (typeof item.product.stock === "number" && newQty > item.product.stock) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => {
        const rawPrice = item.product?.price;
        const numPrice = typeof rawPrice === "number" ? rawPrice : Number(String(rawPrice || "").replace(/[^0-9]/g, "")) || 0;
        return sum + (numPrice * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalCount, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
