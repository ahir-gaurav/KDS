'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { productAPI } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import toast from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addItem } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        productAPI.getOne(id as string)
            .then(({ data }) => {
                setProduct(data.product);
                setRelated(data.related || []);
            })
            .catch(() => router.push('/products'))
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleAddToCart = () => {
        if (!selectedSize && product?.variants?.length > 0) {
            toast.error('Please select a size');
            return;
        }
        const hasActiveOffer = product.isOfferActive && product.discountPercent > 0 && product.sellingPrice;
        addItem({
            productId: product._id,
            name: product.name,
            image: product.images[0] || '',
            price: hasActiveOffer ? product.sellingPrice : (product.salePrice || product.price),
            size: selectedSize,
            quantity,
        });
    };

    if (loading) return (
        <div className="max-w-[1600px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="skeleton aspect-square border-2 border-black" />
            <div className="space-y-4">
                <div className="skeleton h-12 w-3/4" />
                <div className="skeleton h-8 w-1/3" />
                <div className="skeleton h-32" />
            </div>
        </div>
    );

    if (!product) return null;

    const hasActiveOffer = product.isOfferActive && product.discountPercent > 0 && product.sellingPrice;
    const displayPrice = hasActiveOffer ? product.sellingPrice : (product.salePrice || product.price);

    return (
        <div className="min-h-screen bg-cream">
            {/* Breadcrumb */}
            <div className="border-b-2 border-black px-6 py-3">
                <div className="max-w-[1600px] mx-auto">
                    <nav className="flex items-center gap-2 font-inter text-sm text-black/50">
                        <Link href="/" className="hover:text-black">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-black">Products</Link>
                        <span>/</span>
                        <span className="text-black">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <Swiper
                            modules={[Navigation, Thumbs]}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            navigation
                            className="mb-4 border-2 border-black"
                        >
                            {(product.images?.length > 0 ? product.images : ['']).map((img: string, i: number) => (
                                <SwiperSlide key={i}>
                                    <div className="relative aspect-square bg-gray-100">
                                        {img ? (
                                            <Image src={img} alt={product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-mustard/20 flex items-center justify-center">
                                                <span className="font-bebas text-6xl text-olive/30">KDS</span>
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {product.images?.length > 1 && (
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={8}
                                slidesPerView={4}
                                watchSlidesProgress
                                className="thumbnails"
                            >
                                {product.images.map((img: string, i: number) => (
                                    <SwiperSlide key={i}>
                                        <div className="relative aspect-square border-2 border-black/20 cursor-pointer overflow-hidden">
                                            <Image src={img} alt="" fill className="object-cover" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Offer Label Pill */}
                        {hasActiveOffer && product.offerLabel && (
                            <div className="mb-3">
                                <span className="inline-block bg-mustard text-black text-sm font-bebas tracking-wider px-3 py-1 border border-black/20">
                                    {product.offerLabel}
                                </span>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {product.tags.map((tag: string) => (
                                    <span key={tag} className={`text-sm font-bebas tracking-wider px-3 py-1 ${tag === 'Best Seller' ? 'tag-best-seller' : tag === 'New Drop' ? 'tag-new-drop' : 'tag-limited'
                                        }`}>{tag}</span>
                                ))}
                            </div>
                        )}

                        <p className="font-inter text-black/50 text-sm uppercase tracking-widest mb-2">{product.category}</p>
                        <h1 className="font-clash font-bold text-3xl md:text-5xl leading-tight mb-4">{product.name}</h1>

                        {/* Price Section */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-black">
                            {hasActiveOffer ? (
                                <>
                                    <span className="bg-red-600 text-white text-lg font-bebas tracking-wider px-2 py-0.5 font-bold">
                                        -{product.discountPercent}%
                                    </span>
                                    <span className="font-bebas text-4xl text-mustard">₹{(product.sellingPrice || 0).toLocaleString()}</span>
                                </>
                            ) : (
                                <span className="font-bebas text-4xl text-mustard">₹{(displayPrice || 0).toLocaleString()}</span>
                            )}
                            {hasActiveOffer && (
                                <div className="flex flex-col">
                                    <span className="font-inter text-sm text-black/40 line-through">M.R.P.: ₹{(product.mrp || product.price || 0).toLocaleString()}</span>
                                </div>
                            )}
                            {!hasActiveOffer && product.salePrice && product.price && (
                                <>
                                    <span className="font-inter text-xl text-black/40 line-through">₹{product.price.toLocaleString()}</span>
                                    <span className="bg-burgundy text-cream text-sm font-bebas tracking-wider px-2 py-0.5">
                                        SAVE ₹{(product.price - product.salePrice).toLocaleString()}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Size Selector */}
                        {product.variants?.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-inter font-semibold text-sm uppercase tracking-widest">SELECT SIZE</span>
                                    <span className="font-inter text-sm text-black/50">{selectedSize && `Size ${selectedSize} selected`}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant: any) => (
                                        <button
                                            key={variant.size}
                                            onClick={() => setSelectedSize(variant.size)}
                                            disabled={variant.stock === 0}
                                            className={`w-14 h-14 font-clash font-semibold text-lg border-2 transition-all ${variant.stock === 0
                                                ? 'border-black/20 text-black/20 cursor-not-allowed'
                                                : selectedSize === variant.size
                                                    ? 'border-black bg-black text-cream'
                                                    : 'border-black hover:bg-black hover:text-cream'
                                                }`}
                                        >
                                            {variant.size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-inter font-semibold text-sm uppercase tracking-widest">QUANTITY</span>
                            <div className="flex items-center border-2 border-black">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-black/5 transition-colors font-bold text-xl"
                                >
                                    −
                                </button>
                                <span className="w-12 h-12 flex items-center justify-center font-bebas text-xl border-x-2 border-black">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-black/5 transition-colors font-bold text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="btn-brutalist w-full bg-black text-cream font-bebas text-2xl tracking-widest py-4 flex items-center justify-center gap-3 mb-4"
                        >
                            <ShoppingCart size={20} />
                            ADD TO CART
                        </button>

                        <Link
                            href="/cart"
                            className="btn-brutalist block text-center w-full bg-mustard text-black font-bebas text-2xl tracking-widest py-4 mb-8"
                        >
                            BUY NOW
                        </Link>

                        {/* Description */}
                        <div className="border-t-2 border-black pt-6">
                            <h3 className="font-clash font-semibold text-lg mb-3">ABOUT THIS KICK</h3>
                            <p className="font-inter text-black/70 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-20">
                        <h2 className="font-bebas text-5xl mb-8">YOU MIGHT ALSO LIKE</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
