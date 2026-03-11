'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { productAPI, type Product } from '@/lib/api';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low → High', value: 'price_asc' },
    { label: 'Price: High → Low', value: 'price_desc' },
    { label: 'Best Selling', value: 'best_selling' },
];

function ProductsContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [sort, setSort] = useState('newest');
    const [category, setCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await productAPI.getAll({
                page,
                sort,
                category,
                limit: 12,
                search: searchQuery || undefined,
            });
            setProducts(data.products || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch {
            toast.error('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [page, sort, category, searchQuery]);

    useEffect(() => {
        productAPI.getCategories().then(({ data }) => setCategories(data.categories || [])).catch(() => {});
    }, []);

    useEffect(() => {
        fetchProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchProducts]);

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setPage(1);
        setShowFilters(false);
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Page Header */}
            <div className="bg-black text-cream py-16 px-6 overflow-hidden relative border-b-4 border-mustard">
                <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
                    <span className="font-bebas text-[20vw] text-cream/5 whitespace-nowrap leading-none">PRODUCTS</span>
                </div>
                <div className="max-w-[1600px] mx-auto relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-0.5 bg-mustard" />
                        <span className="font-inter text-xs tracking-widest uppercase text-mustard">Shop All</span>
                    </div>
                    <h1 className="font-bebas text-6xl md:text-8xl leading-none">
                        {searchQuery ? (
                            <>RESULTS FOR <span className="text-mustard">"{searchQuery}"</span></>
                        ) : (
                            <>ALL KICKS<span className="text-mustard">.</span></>
                        )}
                    </h1>
                    <p className="font-inter text-cream/50 mt-2">{total} products</p>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 py-10">
                {/* Filter Bar */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn-brutalist bg-olive text-cream font-bebas tracking-widest px-4 py-2 flex items-center gap-2"
                        >
                            <SlidersHorizontal size={16} />
                            FILTERS
                        </button>
                        <select
                            value={sort}
                            onChange={e => { setSort(e.target.value); setPage(1); }}
                            className="border-2 border-black font-bebas text-lg tracking-wide px-4 py-2 bg-cream focus:outline-none focus:border-mustard"
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Active filter tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {searchQuery && (
                            <div className="flex items-center gap-2 bg-black text-cream border-2 border-black px-4 py-2">
                                <span className="font-bebas tracking-widest text-sm">SEARCH: {searchQuery.toUpperCase()}</span>
                                <a href="/products"><X size={14} /></a>
                            </div>
                        )}
                        {category !== 'all' && (
                            <div className="flex items-center gap-2 bg-mustard border-2 border-black px-4 py-2">
                                <span className="font-bebas tracking-widest">{category.toUpperCase()}</span>
                                <button onClick={() => handleCategoryChange('all')}><X size={14} /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Filter Pills */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="flex flex-wrap gap-2 py-4 border-y-2 border-black">
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className={`font-bebas tracking-widest px-5 py-2 text-lg border-2 border-black transition-all ${category === 'all' ? 'bg-black text-cream' : 'bg-cream hover:bg-black/5'}`}
                                >
                                    ALL
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`font-bebas tracking-widest px-5 py-2 text-lg border-2 border-black transition-all ${category === cat ? 'bg-black text-cream' : 'bg-cream hover:bg-black/5'}`}
                                    >
                                        {cat.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="skeleton aspect-[3/4] border-2 border-black" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product, i) => (
                            <ProductCard key={product._id} product={product} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border-2 border-black/10">
                        <p className="font-bebas text-5xl text-black/20">NO KICKS FOUND</p>
                        <p className="font-inter text-black/40 mt-2 text-sm">
                            {searchQuery ? `No results for "${searchQuery}"` : 'No products match the selected filters.'}
                        </p>
                        <button onClick={() => handleCategoryChange('all')} className="mt-4 btn-brutalist bg-olive text-cream px-6 py-2 font-bebas text-xl">
                            CLEAR FILTERS
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        {[...Array(pages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 font-bebas text-lg border-2 border-black transition-all ${page === i + 1 ? 'bg-black text-cream' : 'bg-cream hover:bg-black/10'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-10 w-full max-w-[1600px]">
                    {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-[3/4] border-2 border-black" />)}
                </div>
            </div>
        }>
            <ProductsContent />
        </React.Suspense>
    );
}
