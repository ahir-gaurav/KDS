'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { orderAPI } from '@/lib/api';

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        if (!orderId) return;
        orderAPI.getOne(orderId).then(({ data }) => setOrder(data.order)).catch(() => { });
    }, [orderId]);

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-12">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-8xl mb-6"
            >
                🎉
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center max-w-lg"
            >
                <div className="flex items-center gap-3 justify-center mb-4">
                    <div className="w-16 h-0.5 bg-mustard" />
                    <span className="font-inter text-sm uppercase tracking-widest text-mustard">Order Placed</span>
                    <div className="w-16 h-0.5 bg-mustard" />
                </div>
                <h1 className="font-bebas text-6xl md:text-8xl leading-none mb-4">
                    THANK YOU<span className="text-mustard">!</span>
                </h1>
                {order && (
                    <div className="border-2 border-black p-6 mb-6 text-left">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bebas text-2xl">ORDER #{order.orderNumber}</span>
                            <span className={`font-bebas px-3 py-1 text-sm ${order.status === 'Processing' ? 'bg-mustard text-black' : 'bg-olive text-cream'}`}>
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {order.products?.map((p: any, i: number) => (
                                <div key={i} className="flex justify-between font-inter text-sm">
                                    <span>{p.name}{p.size ? ` (${p.size})` : ''} × {p.quantity}</span>
                                    <span>₹{((p.price || 0) * (p.quantity || 0)).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-black/10 mt-4 pt-4 flex justify-between font-bebas text-xl">
                            <span>TOTAL</span>
                            <span className="text-mustard">₹{(order.totalPrice || 0).toLocaleString()}</span>
                        </div>
                        <p className="font-inter text-xs text-black/40 mt-3">
                            {order.paymentMethod === 'cod' ? 'Payment: Cash on Delivery' : `Payment: Online · Paid`}
                        </p>
                    </div>
                )}
                <p className="font-inter text-black/50 text-sm mb-8">
                    A confirmation email has been sent to you. Your kicks are on their way! 👟
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/profile" className="btn-brutalist inline-block bg-olive text-cream font-bebas text-xl tracking-widest px-8 py-3">
                        VIEW MY ORDERS
                    </Link>
                    <Link href="/products" className="btn-brutalist inline-block bg-black text-cream font-bebas text-xl tracking-widest px-8 py-3">
                        KEEP SHOPPING →
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
