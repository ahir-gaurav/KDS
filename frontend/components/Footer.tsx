import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black text-cream border-t-4 border-mustard">
            <div className="max-w-[1600px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h2 className="font-bebas text-4xl tracking-widest text-mustard mb-4">KICKS DON&apos;T STINK</h2>
                        <p className="font-inter text-cream/60 text-sm max-w-xs leading-relaxed">
                            Bold sneakers for bold people. Where brutalist design meets street culture. Every step is a statement.
                        </p>
                        {/* Barcode */}
                        <div className="mt-6 inline-block border border-cream/20 p-2">
                            <div className="flex gap-px">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <div key={i} className={`h-8 bg-cream ${i % 3 === 0 ? 'w-1.5' : 'w-0.5'}`} />
                                ))}
                            </div>
                            <p className="font-mono text-[8px] text-cream/40 text-center mt-1 tracking-widest">KDS-2024</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bebas text-xl tracking-widest text-mustard mb-4">SHOP</h3>
                        <ul className="space-y-2">
                            {['All Products', 'New Drops', 'Best Sellers', 'Limited Edition'].map(link => (
                                <li key={link}>
                                    <Link href="/products" className="font-inter text-sm text-cream/60 hover:text-mustard transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-bebas text-xl tracking-widest text-mustard mb-4">INFO</h3>
                        <ul className="space-y-2">
                            {['About Us', 'Size Guide', 'Returns Policy', 'Privacy Policy', 'Contact'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="font-inter text-sm text-cream/60 hover:text-mustard transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-cream/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-inter text-xs text-cream/40">
                        © {new Date().getFullYear()} Kicks Don&apos;t Stink. All rights reserved.
                    </p>
                    <p className="font-inter text-xs text-cream/40">
                        Made with ❤️ in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
