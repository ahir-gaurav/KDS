'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Product {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: string[];
    tags?: string[];
    category: string;
}

interface ProductCardProps {
    product: Product;
    index?: number;
}

const tagStyles: Record<string, string> = {
    'Best Seller': 'tag-best-seller',
    'New Drop': 'tag-new-drop',
    'Limited Edition': 'tag-limited',
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            productId: product._id,
            name: product.name,
            image: product?.images?.[0] || '',
            price: product.salePrice || product.price,
            size: '',
            quantity: 1,
        });
    };

    const displayPrice = product.salePrice || product.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="card-hover group relative bg-cream border-2 border-black"
        >
            <Link href={`/products/${product._id}`} className="block">
                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                            <span
                                key={tag}
                                className={`text-xs font-bebas tracking-wider px-2 py-0.5 ${tagStyles[tag] || 'bg-black text-white'}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product?.images?.[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-mustard/20 flex items-center justify-center">
                            <span className="font-bebas text-4xl text-olive/40">KDS</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4 border-t-2 border-black">
                    <p className="text-xs font-inter text-black/50 mb-1 uppercase tracking-widest">{product.category}</p>
                    <h3 className="font-clash font-semibold text-base leading-tight mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bebas text-2xl text-mustard tracking-wide">
                                ₹{(displayPrice || 0).toLocaleString()}
                            </span>
                            {product.salePrice && product.price && (
                                <span className="font-inter text-sm text-black/40 line-through">
                                    ₹{product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Add to Cart */}
            <div className="px-4 pb-4">
                <button
                    onClick={handleAddToCart}
                    className="btn-brutalist w-full bg-black text-cream font-bebas tracking-widest py-2.5 text-lg flex items-center justify-center gap-2"
                >
                    <ShoppingCart size={16} />
                    ADD TO CART
                </button>
            </div>
        </motion.div>
    );
}
