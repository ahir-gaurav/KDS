'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    size: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === item.productId && i.size === item.size);
            if (existing) {
                toast.success('Cart updated!');
                return prev.map(i =>
                    i.productId === item.productId && i.size === item.size
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            toast.success('Added to cart!');
            return [...prev, item];
        });
    };

    const removeItem = (productId: string, size: string) => {
        setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
        toast.success('Removed from cart');
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity < 1) return removeItem(productId, size);
        setItems(prev =>
            prev.map(i => (i.productId === productId && i.size === size ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cart');
    };

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
