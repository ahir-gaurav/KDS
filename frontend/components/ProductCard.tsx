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
    mrp?: number;
    sellingPrice?: number;
    discountPercent?: number;
    isOfferActive?: boolean;
    offerLabel?: string;
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

    const hasActiveOffer = product.isOfferActive && product.discountPercent && product.discountPercent > 0 && product.sellingPrice;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            productId: product._id,
            name: product.name,
            image: product?.images?.[0] || '',
            price: hasActiveOffer ? product.sellingPrice! : (product.salePrice || product.price),
            size: '',
            quantity: 1,
        });
    };

    const displayPrice = hasActiveOffer ? product.sellingPrice! : (product.salePrice || product.price);
    const originalPrice = hasActiveOffer ? (product.mrp || product.price) : (product.salePrice ? product.price : null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="card-hover group relative bg-cream border-2 border-black"
        >
            <Link href={`/products/${product._id}`} className="block">
                {/* Tags */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                    {/* Offer Label pill */}
                    {hasActiveOffer && product.offerLabel && (
                        <span className="text-xs font-bebas tracking-wider px-2 py-0.5 bg-mustard text-black border border-black/20">
                            {product.offerLabel}
                        </span>
                    )}
                    {product.tags && product.tags.length > 0 && (
                        product.tags.slice(0, 2).map(tag => (
                            <span
                                key={tag}
                                className={`text-xs font-bebas tracking-wider px-2 py-0.5 ${tagStyles[tag] || 'bg-black text-white'}`}
                            >
                                {tag}
                            </span>
                        ))
                    )}
                </div>

                {/* Discount badge top-right */}
                {hasActiveOffer && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="bg-red-600 text-white text-sm font-bebas tracking-wider px-2 py-1 font-bold">
                            -{product.discountPercent}%
                        </span>
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
                        <div>
                            <div className="flex items-center gap-2">
                                {hasActiveOffer && (
                                    <span className="font-bebas text-sm text-red-600 font-bold">
                                        -{product.discountPercent}%
                                    </span>
                                )}
                                <span className="font-bebas text-2xl text-mustard tracking-wide">
                                    ₹{(displayPrice || 0).toLocaleString()}
                                </span>
                            </div>
                            {originalPrice && (
                                <p className="font-inter text-xs text-black/40 line-through mt-0.5">
                                    {hasActiveOffer ? 'M.R.P.: ' : ''}₹{originalPrice.toLocaleString()}
                                </p>
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
