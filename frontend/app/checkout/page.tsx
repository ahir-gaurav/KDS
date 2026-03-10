'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, Check } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { useCart } from '@/context/CartContext';
import { orderAPI, userAPI, publicAPI } from '@/lib/api';
import toast from 'react-hot-toast';

declare global { interface Window { Razorpay: any; } }

const STEPS = ['Address', 'Review', 'Payment'];

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const couponCode = searchParams.get('coupon') || '';
    const { user, isLoaded } = useUser();
    const { items, subtotal, clearCart } = useCart();
    const [step, setStep] = useState(0);
    const [settings, setSettings] = useState<any>({ gst: 18, deliveryCharge: 80, freeDeliveryThreshold: 2000 });
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [newAddress, setNewAddress] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
    const [addingNew, setAddingNew] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
    const [placing, setPlacing] = useState(false);

    useEffect(() => {
        if (isLoaded && !user) { router.push('/'); return; }
        if (isLoaded && user) {
            userAPI.getProfile().then(({ data }) => {
                setAddresses(data.user?.addresses || []);
                const def = data.user?.addresses?.find((a: any) => a.isDefault) || data.user?.addresses?.[0];
                if (def) setSelectedAddress(def);
            });
        }
        publicAPI.getSettings().then(({ data }) => { if (data.settings) setSettings(data.settings); });
    }, [isLoaded, user, router]);

    if (items.length === 0) { router.push('/cart'); return null; }

    const delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCharge;
    const gstAmount = Math.round((subtotal * settings.gst) / 100);
    const total = subtotal + gstAmount + delivery;

    const handlePlaceOrder = async () => {
        const addr = addingNew ? newAddress : selectedAddress;
        if (!addr || !addr.addressLine1) return toast.error('Please select or add an address');

        setPlacing(true);
        try {
            const orderPayload = {
                products: items.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
                deliveryAddress: addr,
                paymentMethod,
                couponCode: couponCode || undefined,
            };

            const { data } = await orderAPI.create(orderPayload);

            if (paymentMethod === 'razorpay' && data.razorpayOrderId) {
                // Load Razorpay script
                if (!window.Razorpay) {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    await new Promise(resolve => { script.onload = resolve; document.head.appendChild(script); });
                }

                const rzp = new window.Razorpay({
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: total * 100,
                    currency: 'INR',
                    name: "Kicks Don't Stink",
                    description: `Order #${data.order.orderNumber}`,
                    order_id: data.razorpayOrderId,
                    handler: async (response: any) => {
                        try {
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
                                method: 'POST',
                                credentials: 'include',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    orderId: data.order._id,
                                }),
                            });
                            clearCart();
                            router.push(`/order-confirmation?id=${data.order._id}`);
                        } catch {
                            toast.error('Payment verification failed. Contact support.');
                        }
                    },
                    prefill: { name: user?.fullName || '', email: user?.primaryEmailAddress?.emailAddress || '' },
                    theme: { color: '#D9A441' },
                });
                rzp.open();
            } else {
                clearCart();
                router.push(`/order-confirmation?id=${data.order._id}`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream">
            <div className="bg-black py-10 px-6 border-b-4 border-mustard">
                <div className="max-w-[1200px] mx-auto">
                    <h1 className="font-bebas text-5xl md:text-7xl text-cream">CHECKOUT<span className="text-mustard">.</span></h1>
                    {/* Steps */}
                    <div className="flex items-center gap-4 mt-4">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s}>
                                <button
                                    onClick={() => i < step && setStep(i)}
                                    className={`font-bebas text-xl tracking-widest flex items-center gap-2 ${i <= step ? 'text-mustard' : 'text-cream/30'}`}
                                >
                                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm ${i < step ? 'bg-mustard border-mustard text-black' : i === step ? 'border-mustard text-mustard' : 'border-cream/30 text-cream/30'}`}>
                                        {i < step ? <Check size={14} /> : i + 1}
                                    </span>
                                    {s}
                                </button>
                                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-mustard' : 'bg-cream/20'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Steps Content */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {/* Step 0: Address */}
                            {step === 0 && (
                                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h2 className="font-bebas text-3xl mb-6 flex items-center gap-2"><MapPin size={20} className="text-mustard" />DELIVERY ADDRESS</h2>

                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => { setSelectedAddress(addr); setAddingNew(false); }}
                                            className={`border-2 p-4 mb-3 cursor-pointer transition-all ${selectedAddress?._id === addr._id && !addingNew ? 'border-mustard bg-mustard/5' : 'border-black/20 hover:border-black'}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-clash font-semibold">{addr.fullName}</p>
                                                    <p className="font-inter text-sm text-black/60">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                                                    <p className="font-inter text-sm text-black/60">{addr.city}, {addr.state} - {addr.pincode}</p>
                                                    <p className="font-inter text-sm text-black/60">{addr.phone}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${selectedAddress?._id === addr._id && !addingNew ? 'border-mustard bg-mustard' : 'border-black/30'}`} />
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => { setAddingNew(!addingNew); setSelectedAddress(null); }}
                                        className="btn-brutalist font-bebas text-lg tracking-widest px-6 py-2 border-2 border-black bg-cream hover:bg-black hover:text-cream mt-2 mb-4 transition-colors"
                                    >
                                        {addingNew ? 'CANCEL' : '+ ADD NEW ADDRESS'}
                                    </button>

                                    {addingNew && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="border-2 border-mustard p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { key: 'fullName', label: 'Full Name', full: true },
                                                { key: 'phone', label: 'Phone' },
                                                { key: 'addressLine1', label: 'Address Line 1', full: true },
                                                { key: 'addressLine2', label: 'Address Line 2 (Optional)', full: true },
                                                { key: 'city', label: 'City' },
                                                { key: 'state', label: 'State' },
                                                { key: 'pincode', label: 'Pincode' },
                                            ].map(field => (
                                                <div key={field.key} className={field.full ? 'md:col-span-2' : ''}>
                                                    <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">{field.label}</label>
                                                    <input
                                                        value={(newAddress as any)[field.key]}
                                                        onChange={e => setNewAddress(p => ({ ...p, [field.key]: e.target.value }))}
                                                        className="w-full border-2 border-black px-3 py-2 font-inter bg-cream focus:outline-none focus:border-mustard"
                                                    />
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={() => {
                                            if (!addingNew && !selectedAddress) return toast.error('Select an address');
                                            if (addingNew && !newAddress.addressLine1) return toast.error('Fill in address');
                                            setStep(1);
                                        }}
                                        className="btn-brutalist w-full bg-black text-cream font-bebas text-xl tracking-widest py-4 mt-6"
                                    >
                                        CONTINUE →
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 1: Review */}
                            {step === 1 && (
                                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h2 className="font-bebas text-3xl mb-6">REVIEW ORDER</h2>
                                    {items.map(item => (
                                        <div key={`${item.productId}-${item.size}`} className="flex justify-between py-3 border-b border-black/10">
                                            <div>
                                                <p className="font-clash font-semibold">{item.name}</p>
                                                {item.size && <p className="font-inter text-sm text-black/50">Size: {item.size}</p>}
                                                <p className="font-inter text-sm text-black/50">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bebas text-xl text-mustard">₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => setStep(0)} className="btn-brutalist flex-1 border-2 border-black font-bebas text-xl py-3">← BACK</button>
                                        <button onClick={() => setStep(2)} className="btn-brutalist flex-1 bg-black text-cream font-bebas text-xl py-3">PAYMENT →</button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h2 className="font-bebas text-3xl mb-6 flex items-center gap-2"><CreditCard size={20} className="text-mustard" />PAYMENT METHOD</h2>
                                    <div className="space-y-3 mb-8">
                                        {([
                                            { value: 'razorpay', label: 'PAY ONLINE (Razorpay)', sub: 'Card, UPI, Net Banking, Wallets' },
                                            { value: 'cod', label: 'CASH ON DELIVERY', sub: 'Pay when your order arrives' },
                                        ] as const).map(opt => (
                                            <div
                                                key={opt.value}
                                                onClick={() => setPaymentMethod(opt.value)}
                                                className={`border-2 p-4 cursor-pointer transition-all ${paymentMethod === opt.value ? 'border-mustard bg-mustard/5' : 'border-black/20 hover:border-black'}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bebas text-xl tracking-wider">{opt.label}</p>
                                                        <p className="font-inter text-sm text-black/50">{opt.sub}</p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === opt.value ? 'border-mustard bg-mustard' : 'border-black/30'}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="btn-brutalist flex-1 border-2 border-black font-bebas text-xl py-3">← BACK</button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={placing}
                                            className="btn-brutalist flex-1 bg-mustard text-black font-bebas text-xl py-3"
                                        >
                                            {placing ? 'PLACING...' : 'PLACE ORDER →'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="border-2 border-black p-5 sticky top-20">
                            <h3 className="font-bebas text-xl tracking-widest mb-4 border-b-2 border-black pb-3">ORDER TOTAL</h3>
                            <div className="space-y-2 text-sm font-inter mb-4">
                                <div className="flex justify-between"><span>Subtotal</span><span>₹{(subtotal || 0).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>GST ({settings.gst || 0}%)</span><span>₹{(gstAmount || 0).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Delivery</span><span className={delivery === 0 ? 'text-olive font-medium' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                            </div>
                            <div className="flex justify-between font-bebas text-2xl border-t-2 border-black pt-3">
                                <span>TOTAL</span>
                                <span className="text-mustard">₹{(total || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center font-bebas text-4xl">LOADING...</div>}>
            <CheckoutContent />
        </React.Suspense>
    );
}
