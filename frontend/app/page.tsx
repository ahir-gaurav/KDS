'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import HeroSlider from '@/components/HeroSlider';
import TickerBar from '@/components/TickerBar';
import ProductCard from '@/components/ProductCard';
import { productAPI, type Product } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Animated counter
function Counter({ from = 0, to, suffix = '' }: { from?: number; to: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView || !ref.current) return;
        const controls = animate(from, to, {
            duration: 2,
            ease: 'easeOut',
            onUpdate(v) {
                if (ref.current) ref.current.textContent = '+' + Math.round(v).toLocaleString() + suffix;
            },
        });
        return controls.stop;
    }, [inView, from, to, suffix]);

    return <span ref={ref}>+0{suffix}</span>;
}

const stats = [
    { value: 14000, label: 'Collections', suffix: '' },
    { value: 2000, label: 'Happy Customers', suffix: '' },
    { value: 98, label: 'Satisfaction Rate', suffix: '%' },
    { value: 150, label: 'Unique Designs', suffix: '' },
];

export default function HomePage() {
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const collectionRef = useRef(null);
    const collectionInView = useInView(collectionRef, { once: true });

    useEffect(() => {
        productAPI.getBestSellers()
            .then(({ data }) => setBestSellers(data.products || []))
            .catch(() => toast.error('Failed to load products'))
            .finally(() => setLoadingProducts(false));
    }, []);

    return (
        <>
            {/* Hero */}
            <HeroSlider />

            {/* Ticker */}
            <TickerBar />

            {/* Stats Section */}
            <section className="bg-black text-cream py-16 overflow-hidden relative">
                {/* Big editorial text in background */}
                <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
                    <span className="font-bebas text-[20vw] text-cream/5 whitespace-nowrap leading-none">NUMBERS</span>
                </div>
                <div className="max-w-[1600px] mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <p className="font-bebas text-5xl md:text-6xl text-mustard leading-none">
                                    <Counter to={stat.value} suffix={stat.suffix} />
                                </p>
                                <p className="font-inter text-sm text-cream/60 mt-2 uppercase tracking-widest">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Collection */}
            <section ref={collectionRef} className="py-20 max-w-[1600px] mx-auto px-6">
                <div className="relative mb-12">
                    {/* Big decorative text */}
                    <span className="font-bebas text-[15vw] text-black/5 leading-none absolute top-0 left-0 select-none pointer-events-none">
                        COLLECTION
                    </span>
                    <motion.div
                        initial={{ x: -40, opacity: 0 }}
                        animate={collectionInView ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 pt-4"
                    >
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-1 bg-mustard" />
                                    <span className="font-inter text-sm tracking-widest uppercase text-mustard">Featured</span>
                                </div>
                                <h2 className="font-bebas text-5xl md:text-7xl leading-none">OUR COLLECTION</h2>
                            </div>
                            <Link href="/products" className="btn-brutalist hidden md:inline-block bg-olive text-cream font-bebas text-xl tracking-widest px-6 py-3">
                                VIEW ALL →
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {loadingProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton aspect-[3/4] border-2 border-black" />
                        ))}
                    </div>
                ) : bestSellers.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bestSellers.map((product, i) => (
                            <ProductCard key={product._id} product={product} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-black/10">
                        <p className="font-bebas text-3xl text-black/30">DROPS COMING SOON</p>
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Link href="/products" className="btn-brutalist inline-block bg-olive text-cream font-bebas text-xl tracking-widest px-8 py-3">
                        VIEW ALL KICKS →
                    </Link>
                </div>
            </section>

            {/* Brutalist CTA Banner */}
            <section className="bg-mustard border-y-4 border-black py-16 overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none select-none flex items-center overflow-hidden">
                    <span className="font-bebas text-[20vw] text-black/10 whitespace-nowrap">NEW DROP ✦ NEW DROP ✦ NEW DROP</span>
                </div>
                <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div>
                        <p className="font-inter text-sm uppercase tracking-widest text-black/60 mb-2">Limited Time</p>
                        <h2 className="font-bebas text-5xl md:text-7xl leading-none text-black">
                            FREE DELIVERY<br />ABOVE ₹2000
                        </h2>
                    </div>
                    <Link href="/products" className="btn-brutalist bg-black text-cream font-bebas text-2xl tracking-widest px-10 py-4 whitespace-nowrap">
                        SHOP THE DROP →
                    </Link>
                </div>
            </section>
        </>
    );
}
