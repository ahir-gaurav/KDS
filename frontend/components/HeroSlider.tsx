'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { publicAPI } from '@/lib/api';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface HeroSlide {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
    buttonText: string;
    buttonLink: string;
}

const skeletonSlide = () => (
    <div className="relative w-full h-[80vh] md:h-[90vh] skeleton" />
);

const ShopSticker = () => (
    <div className="rotate-sticker absolute right-8 bottom-24 md:right-16 md:bottom-32 z-20 w-24 h-24 md:w-32 md:h-32">
        <div className="relative w-full h-full">
            {/* Circular text path using SVG */}
            <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                    <path id="circlePath" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
                </defs>
                <circle cx="60" cy="60" r="54" fill="#D9A441" stroke="#111" strokeWidth="2" />
                <text fontSize="10" fontFamily="Bebas Neue, cursive" fill="#111" letterSpacing="4">
                    <textPath href="#circlePath">SHOP NOW ✦ NEW DROP ✦ SHOP NOW ✦ </textPath>
                </text>
                <text x="60" y="68" textAnchor="middle" fontSize="22" fontFamily="Bebas Neue, cursive" fill="#111">★</text>
            </svg>
        </div>
    </div>
);

const BarcodeDecor = ({ className }: { className?: string }) => (
    <div className={`absolute z-10 ${className}`}>
        <div className="bg-cream border-2 border-black p-2 rotate-6">
            <div className="flex gap-px">
                {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} className={`h-10 bg-black ${i % 3 === 0 ? 'w-1.5' : 'w-0.5'}`} />
                ))}
            </div>
            <p className="font-mono text-[7px] text-center mt-1 tracking-widest">KDS-SS24</p>
        </div>
    </div>
);

export default function HeroSlider() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);

    const defaultSlides: HeroSlide[] = [
        {
            _id: 'default-1',
            title: 'STEP INTO THE FUTURE',
            subtitle: 'New Season Drops — Bold. Brutal. Beautiful.',
            image: '',
            buttonText: 'SHOP NOW',
            buttonLink: '/products',
        },
        {
            _id: 'default-2',
            title: 'KICKS THAT HIT DIFFERENT',
            subtitle: 'Limited Edition Collection — While Stocks Last',
            image: '',
            buttonText: 'EXPLORE',
            buttonLink: '/products',
        },
    ];

    useEffect(() => {
        publicAPI.getHero()
            .then(({ data }) => {
                setSlides(data.slides?.length > 0 ? data.slides : defaultSlides);
            })
            .catch(() => setSlides(defaultSlides))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return skeletonSlide();

    return (
        <div className="relative overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true, el: '.hero-pagination' }}
                loop
                className="w-full h-[80vh] md:h-[90vh]"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide._id}>
                        <div className="relative w-full h-full bg-olive overflow-hidden">
                            {slide.image ? (
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-olive via-black to-burgundy" />
                            )}

                            {/* Big editorial text behind everything */}
                            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                                <span
                                    className="font-bebas text-[15vw] md:text-[12vw] text-cream opacity-10 whitespace-nowrap leading-none"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    KICKS DON&apos;T STINK
                                </span>
                            </div>

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

                            {/* Content */}
                            <motion.div
                                initial={{ x: -60, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="absolute bottom-20 left-8 md:left-16 max-w-xl z-10"
                            >
                                <motion.h1
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="font-bebas text-6xl md:text-8xl text-cream leading-none tracking-tight mb-4"
                                >
                                    {slide.title}
                                </motion.h1>
                                {slide.subtitle && (
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="font-inter text-lg text-cream/80 mb-6 max-w-sm"
                                    >
                                        {slide.subtitle}
                                    </motion.p>
                                )}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Link
                                        href={slide.buttonLink || '/products'}
                                        className="btn-brutalist inline-block bg-mustard text-black font-bebas text-2xl tracking-widest px-8 py-3"
                                    >
                                        {slide.buttonText || 'SHOP NOW'}
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Decorative barcode sticker */}
                            <BarcodeDecor className="bottom-8 right-[10%] hidden md:block" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Rotating CTA sticker */}
            <ShopSticker />

            {/* Pagination dots */}
            <div className="hero-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2" />

            <style jsx global>{`
        .hero-pagination .swiper-pagination-bullet {
          background: #F4F1EA;
          opacity: 0.5;
          width: 8px;
          height: 8px;
        }
        .hero-pagination .swiper-pagination-bullet-active {
          background: #D9A441;
          opacity: 1;
          width: 24px;
          border-radius: 999px;
        }
      `}</style>
        </div>
    );
}
