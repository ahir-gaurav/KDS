'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
        router.push('/');
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-cream border-b-4 border-black">
                <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Left: Hamburger + Nav */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="p-1 hover:opacity-70 transition-opacity"
                            aria-label="Menu"
                        >
                            <Menu size={28} strokeWidth={2.5} />
                        </button>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/" className="font-bebas text-xl tracking-widest hover:text-mustard transition-colors">HOME</Link>
                            <Link href="/products" className="font-bebas text-xl tracking-widest hover:text-mustard transition-colors">SHOP</Link>
                        </nav>
                    </div>

                    {/* Center: Brand */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                        <span className="font-clash font-bold text-xl md:text-2xl tracking-tight leading-none">
                            KICKS DON&apos;T STINK
                        </span>
                    </Link>

                    {/* Right: Profile + Cart */}
                    <div className="flex items-center gap-4">
                        <Link href={user ? "/profile" : "/auth/login"} aria-label="Profile">
                            <User size={24} strokeWidth={2} className="hover:text-mustard transition-colors" />
                        </Link>
                        <Link href="/cart" className="relative" aria-label="Cart">
                            <ShoppingCart size={24} strokeWidth={2} className="hover:text-mustard transition-colors" />
                            {totalItems > 0 && (
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-mustard text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hamburger Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 bg-black z-50"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                            className="fixed top-0 left-0 h-full w-80 bg-cream border-r-4 border-black z-50 p-8"
                        >
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="absolute top-6 right-6 p-1"
                            >
                                <X size={28} />
                            </button>

                            <div className="mt-12">
                                <div className="font-clash font-bold text-2xl mb-8">KICKS DON&apos;T STINK</div>
                                <nav className="flex flex-col gap-1">
                                    {[
                                        { href: '/', label: 'HOME' },
                                        { href: '/products', label: 'PRODUCTS' },
                                        { href: '/about', label: 'ABOUT US' },
                                        ...(!user ? [
                                            { href: '/auth/login', label: 'LOGIN' },
                                            { href: '/auth/signup', label: 'SIGNUP' },
                                        ] : [
                                            { href: '/profile', label: 'MY PROFILE' },
                                        ]),
                                    ].map((item, i) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.05 * i }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setMenuOpen(false)}
                                                className="block font-bebas text-4xl tracking-widest py-2 border-b-2 border-black/10 hover:text-mustard transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                    {user && (
                                        <motion.button
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            onClick={handleLogout}
                                            className="text-left font-bebas text-4xl tracking-widest py-2 border-b-2 border-black/10 text-burgundy hover:opacity-70 transition-opacity"
                                        >
                                            LOGOUT
                                        </motion.button>
                                    )}
                                </nav>
                            </div>

                            {/* Decorative barcode */}
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="border border-black/30 p-2 text-center">
                                    <div className="flex gap-px justify-center mb-1">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <div key={i} className={`h-6 bg-black ${i % 3 === 0 ? 'w-1.5' : 'w-0.5'}`} />
                                        ))}
                                    </div>
                                    <span className="font-mono text-[8px] tracking-widest">KDS-2024-STINK</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
