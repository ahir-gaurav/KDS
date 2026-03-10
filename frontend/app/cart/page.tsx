'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { publicAPI, couponAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { useUser } from "@clerk/nextjs";

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal } = useCart();
    const { user, isLoaded } = useUser();
    const [settings, setSettings] = useState<any>({ gst: 18, deliveryCharge: 80, freeDeliveryThreshold: 2000 });
    const [couponCode, setCouponCode] = useState('');
    const [couponData, setCouponData] = useState<any>(null);
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    useEffect(() => {
        publicAPI.getSettings().then(({ data }) => {
            if (data.settings) setSettings(data.settings);
        }).catch(() => { });
    }, []);

    const handleApplyCoupon = async () => {
        if (!isLoaded || !user) return toast.error('Please login to apply coupons');
        if (!couponCode.trim()) return;
        setApplyingCoupon(true);
        try {
            const { data } = await couponAPI.validate({ code: couponCode, subtotal });
            setCouponData(data);
            toast.success(`Coupon applied! ${data.discount}% off`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid coupon');
            setCouponData(null);
        } finally {
            setApplyingCoupon(false);
        }
    };

    const couponDiscountAmount = couponData ? Math.round((subtotal * couponData.discount) / 100) : 0;
    const discountedSubtotal = subtotal - couponDiscountAmount;
    const delivery = discountedSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;
    const gstAmount = Math.round((discountedSubtotal * settings.gst) / 100);
    const total = discountedSubtotal + gstAmount + delivery;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
                <div className="text-center">
                    <span className="font-bebas text-[20vw] text-black/5 leading-none block">EMPTY</span>
                    <h1 className="font-bebas text-5xl mt-4 -translate-y-8">YOUR CART IS EMPTY</h1>
                    <p className="font-inter text-black/50 mb-8">Time to fill it with some fresh kicks!</p>
                    <Link href="/products" className="btn-brutalist inline-block bg-black text-cream font-bebas text-xl tracking-widest px-8 py-4">
                        SHOP NOW →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-black py-12 px-6 border-b-4 border-mustard">
                <div className="max-w-[1400px] mx-auto">
                    <h1 className="font-bebas text-6xl md:text-8xl text-cream">YOUR CART<span className="text-mustard">.</span></h1>
                    <p className="font-inter text-cream/50 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={`${item.productId}-${item.size}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                                    className="flex gap-4 border-2 border-black p-4 mb-4 bg-cream"
                                >
                                    <div className="relative w-24 h-24 flex-shrink-0 border border-black/10">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-mustard/20 flex items-center justify-center">
                                                <span className="font-bebas text-2xl text-olive/40">KDS</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-clash font-semibold text-base leading-tight line-clamp-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.productId, item.size)}
                                                className="text-burgundy hover:opacity-70 ml-2 flex-shrink-0"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        {item.size && <p className="font-inter text-xs text-black/50 mb-2">Size: {item.size}</p>}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border-2 border-black">
                                                <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center font-bebas text-lg">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-black/5">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <span className="font-bebas text-2xl text-mustard">₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Coupon */}
                        <div className="border-2 border-black p-4 mt-4">
                            <h3 className="font-bebas text-xl tracking-widest mb-3">APPLY COUPON</h3>
                            <div className="flex gap-2">
                                <input
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="ENTER CODE"
                                    className="flex-1 border-2 border-black px-4 py-2 font-bebas text-lg tracking-widest bg-cream focus:outline-none focus:border-mustard"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={applyingCoupon}
                                    className="btn-brutalist bg-olive text-cream font-bebas text-lg tracking-widest px-6 py-2"
                                >
                                    {applyingCoupon ? 'APPLYING...' : 'APPLY'}
                                </button>
                            </div>
                            {couponData && (
                                <p className="font-inter text-sm text-olive mt-2">✓ {couponData.discount}% discount applied! You save ₹{(couponData.discountAmount || 0).toLocaleString()}</p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="border-2 border-black p-6 sticky top-20">
                            <h2 className="font-bebas text-2xl tracking-widest border-b-2 border-black pb-4 mb-4">ORDER SUMMARY</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between font-inter text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{(subtotal || 0).toLocaleString()}</span>
                                </div>
                                {couponDiscountAmount > 0 && (
                                    <div className="flex justify-between font-inter text-sm text-olive">
                                        <span>Coupon Discount</span>
                                        <span>- ₹{(couponDiscountAmount || 0).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-inter text-sm">
                                    <span>GST ({settings.gst}%)</span>
                                    <span>₹{(gstAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-inter text-sm">
                                    <span>Delivery</span>
                                    <span className={delivery === 0 ? 'text-olive font-semibold' : ''}>
                                        {delivery === 0 ? 'FREE' : `₹${delivery}`}
                                    </span>
                                </div>
                                {delivery > 0 && (
                                    <p className="font-inter text-xs text-black/50">
                                        Add ₹{(Math.max(0, (settings.freeDeliveryThreshold || 0) - (discountedSubtotal || 0))).toLocaleString()} more for free delivery
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-between font-bebas text-2xl border-t-2 border-black pt-4 mb-6">
                                <span>TOTAL</span>
                                <span className="text-mustard">₹{(total || 0).toLocaleString()}</span>
                            </div>

                            <Link
                                href={{
                                    pathname: '/checkout',
                                    query: couponCode ? { coupon: couponCode } : {},
                                }}
                                className="btn-brutalist block text-center w-full bg-black text-cream font-bebas text-xl tracking-widest py-4"
                            >
                                PROCEED TO CHECKOUT →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
