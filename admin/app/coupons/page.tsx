'use client';
import React, { useEffect, useState } from 'react';
import {
    Plus,
    Trash2,
    Ticket,
    Calendar,
    Percent,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // New Coupon Form
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [type, setType] = useState('global');
    const [minOrder, setMinOrder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getCoupons();
            setCoupons(data.coupons || []);
        } catch {
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        try {
            await adminAPI.createCoupon({ code, discount, type, minOrder, expiryDate: expiry });
            toast.success('Coupon Deployed');
            setCode(''); setDiscount(''); setType('global'); setMinOrder(''); setExpiry('');
            fetchCoupons();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Creation failed');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminAPI.deleteCoupon(id);
            toast.success('Coupon Terminated');
            setCoupons(coupons.filter(c => c._id !== id));
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none text-black">VOUCHERS</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2">Manage Promotional Tokens</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="lg:col-span-1 bg-black text-cream p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(217,164,65,1)] h-fit">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-cream/20 pb-4 italic">Deploy Voucher</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Voucher Code</label>
                            <input required value={code} onChange={e => setCode(e.target.value.toUpperCase())} className="w-full bg-cream/5 border-2 border-mustard p-3 outline-none font-black text-mustard uppercase" placeholder="KICK20" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Discount (%)</label>
                                <input required type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full bg-cream/5 border-2 border-mustard p-3 outline-none font-black text-mustard" placeholder="20" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Scope</label>
                                <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-cream/5 border-2 border-mustard p-3 outline-none font-black text-mustard">
                                    <option value="global" className="bg-black">GLOBAL</option>
                                    <option value="firstOrder" className="bg-black">FIRST ORDER</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Min Order (₹)</label>
                                <input required type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className="w-full bg-cream/5 border-2 border-mustard p-3 outline-none font-black text-mustard" placeholder="1000" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Expiry Date</label>
                                <input required type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full bg-cream/5 border-2 border-mustard p-3 outline-none font-black text-mustard" />
                            </div>
                        </div>
                        <button disabled={adding} type="submit" className="w-full bg-mustard text-black py-4 font-black uppercase tracking-[0.2em] hover:bg-cream transition-all">
                            {adding ? 'ESTABLISHING...' : 'DEPLOY VOUCHER →'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-widest border-l-8 border-black pl-4 italic underline decoration-mustard underline-offset-8">Active Tokens</h2>
                    {loading ? (
                        <div className="skeleton h-64 w-full" />
                    ) : coupons.length === 0 ? (
                        <p className="text-black/30 font-black italic uppercase text-lg">No active vouchers in ecosystem.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coupons.map((c) => {
                                const isExpired = new Date(c.expiryDate) < new Date();
                                return (
                                    <div key={c._id} className={`border-2 border-black p-6 bg-white relative overflow-hidden group hover:rotate-2 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isExpired ? 'opacity-50' : ''}`}>
                                        <div className="absolute top-0 right-0 bg-black text-mustard font-black px-4 py-1 text-xs -rotate-45 translate-x-4 translate-y-2">ACTV</div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-black text-3xl italic tracking-tighter leading-none">{c.code}</h4>
                                                <span className="text-[10px] font-bold uppercase text-black/40">{c.type}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-4xl text-mustard leading-none">{c.discount}%</p>
                                                <p className="text-[8px] font-bold opacity-30">OFF LIST PRICE</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1 text-xs font-bold uppercase mb-6 opacity-60">
                                            <p className="flex items-center gap-2"><CheckCircle size={12} /> Min Order: ₹{c.minOrder}</p>
                                            <p className={`flex items-center gap-2 ${isExpired ? 'text-burgundy' : ''}`}><Calendar size={12} /> {isExpired ? 'Expired' : 'Expires'}: {new Date(c.expiryDate).toLocaleDateString()}</p>
                                            <p className="flex items-center gap-2"><Ticket size={12} /> Usage: {c.usageCount} / {c.usageLimit || '∞'}</p>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(c._id)}
                                            className="w-full btn-admin bg-burgundy/10 text-burgundy border-burgundy hover:bg-burgundy hover:text-white flex items-center justify-center gap-2"
                                        >
                                            <Trash2 size={16} /> TERMINATE TOKEN
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
