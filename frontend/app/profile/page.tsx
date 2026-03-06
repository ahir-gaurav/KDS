'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, MapPin, Package, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { userAPI, orderAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
    Processing: 'bg-mustard text-black',
    Shipped: 'bg-olive text-cream',
    Delivered: 'bg-green-600 text-white',
    Cancelled: 'bg-burgundy text-cream',
};

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [tab, setTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
    const [orders, setOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [profileData, setProfileData] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addingAddr, setAddingAddr] = useState(false);
    const [newAddr, setNewAddr] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });

    useEffect(() => {
        if (!user) { router.push('/auth/login'); return; }
        const fetchData = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([userAPI.getProfile(), orderAPI.getMyOrders()]);
                const u = profileRes.data.user;
                setProfileData({ name: u.name || '', phone: u.phone || '' });
                setAddresses(u.addresses || []);
                setOrders(ordersRes.data.orders || []);
            } catch { }
            setLoading(false);
        };
        fetchData();
    }, [user, router]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await userAPI.updateProfile(profileData);
            toast.success('Profile updated!');
        } catch { toast.error('Update failed'); }
        finally { setSaving(false); }
    };

    const handleAddAddress = async () => {
        try {
            const { data } = await userAPI.addAddress(newAddr);
            setAddresses(data.addresses);
            setAddingAddr(false);
            setNewAddr({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
            toast.success('Address added!');
        } catch { toast.error('Failed to add address'); }
    };

    const handleDeleteAddress = async (addrId: string) => {
        try {
            const { data } = await userAPI.deleteAddress(addrId);
            setAddresses(data.addresses);
            toast.success('Address removed');
        } catch { toast.error('Failed to delete'); }
    };

    const tabs = [
        { id: 'profile', label: 'PROFILE', icon: User },
        { id: 'orders', label: 'ORDERS', icon: Package },
        { id: 'addresses', label: 'ADDRESSES', icon: MapPin },
    ] as const;

    if (loading) return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="font-bebas text-4xl animate-pulse">LOADING...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-black py-10 px-6 border-b-4 border-mustard">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="font-bebas text-5xl md:text-7xl text-cream">MY ACCOUNT<span className="text-mustard">.</span></h1>
                        <p className="font-inter text-cream/50 text-sm mt-1">{user?.email}</p>
                    </div>
                    <button onClick={async () => { await logout(); router.push('/'); }} className="btn-brutalist font-bebas text-lg tracking-widest px-6 py-2 border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-cream transition-colors">
                        LOGOUT
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-10">
                {/* Tab Navigation */}
                <div className="flex border-b-2 border-black mb-8 overflow-x-auto">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 font-bebas text-xl tracking-widest px-6 py-3 whitespace-nowrap transition-all border-b-4 -mb-0.5 ${tab === id ? 'border-mustard text-mustard' : 'border-transparent text-black/40 hover:text-black'}`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Profile Tab */}
                {tab === 'profile' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md space-y-5">
                        {[
                            { key: 'name', label: 'Full Name', type: 'text' },
                            { key: 'phone', label: 'Phone Number', type: 'tel' },
                        ].map(field => (
                            <div key={field.key}>
                                <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">{field.label}</label>
                                <input
                                    type={field.type}
                                    value={(profileData as any)[field.key]}
                                    onChange={e => setProfileData(p => ({ ...p, [field.key]: e.target.value }))}
                                    className="w-full border-2 border-black px-4 py-3 font-inter bg-cream focus:outline-none focus:border-mustard"
                                />
                            </div>
                        ))}
                        <div>
                            <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">Email</label>
                            <input value={user?.email} disabled className="w-full border-2 border-black/20 px-4 py-3 font-inter bg-cream/50 text-black/40" />
                        </div>
                        <button onClick={handleSaveProfile} disabled={saving} className="btn-brutalist bg-black text-cream font-bebas text-xl tracking-widest px-8 py-3">
                            {saving ? 'SAVING...' : 'SAVE CHANGES →'}
                        </button>
                    </motion.div>
                )}

                {/* Orders Tab */}
                {tab === 'orders' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {orders.length === 0 ? (
                            <div className="text-center py-20 border-2 border-black/10">
                                <p className="font-bebas text-4xl text-black/20 mb-4">NO ORDERS YET</p>
                                <a href="/products" className="btn-brutalist inline-block bg-black text-cream font-bebas text-xl px-8 py-3">SHOP NOW →</a>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order._id} className="border-2 border-black p-5">
                                        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                                            <div>
                                                <p className="font-bebas text-2xl">#{order.orderNumber}</p>
                                                <p className="font-inter text-xs text-black/40">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bebas text-sm px-3 py-1 ${STATUS_COLORS[order.status] || 'bg-gray-200'}`}>{order.status}</span>
                                                <span className="font-bebas text-xl text-mustard">₹{(order.totalPrice || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 border-t border-black/10 pt-3">
                                            {order.products?.slice(0, 3).map((p: any, i: number) => (
                                                <p key={i} className="font-inter text-sm text-black/60">{p.name}{p.size ? ` (${p.size})` : ''} × {p.quantity}</p>
                                            ))}
                                            {order.products?.length > 3 && (
                                                <p className="font-inter text-xs text-black/40">+{order.products.length - 3} more</p>
                                            )}
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className={`text-xs font-inter px-2 py-0.5 ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {order.paymentMethod?.toUpperCase()} · {order.paymentStatus?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Addresses Tab */}
                {tab === 'addresses' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {addresses.map(addr => (
                                <div key={addr._id} className="border-2 border-black p-5 relative">
                                    {addr.isDefault && <span className="absolute top-3 right-3 bg-mustard text-black font-bebas text-xs px-2 py-0.5">DEFAULT</span>}
                                    <p className="font-clash font-semibold">{addr.fullName}</p>
                                    <p className="font-inter text-sm text-black/60">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                                    <p className="font-inter text-sm text-black/60">{addr.city}, {addr.state} - {addr.pincode}</p>
                                    <p className="font-inter text-sm text-black/60">{addr.phone}</p>
                                    <button onClick={() => handleDeleteAddress(addr._id)} className="mt-3 text-burgundy hover:opacity-70 flex items-center gap-1 font-inter text-sm">
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setAddingAddr(!addingAddr)}
                            className="btn-brutalist font-bebas text-lg tracking-widest px-6 py-2 border-2 border-black flex items-center gap-2 mb-4"
                        >
                            <Plus size={16} />
                            {addingAddr ? 'CANCEL' : 'ADD ADDRESS'}
                        </button>

                        {addingAddr && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-2 border-mustard p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'fullName', label: 'Full Name', full: true },
                                    { key: 'phone', label: 'Phone' },
                                    { key: 'addressLine1', label: 'Address Line 1', full: true },
                                    { key: 'addressLine2', label: 'Line 2 (Optional)', full: true },
                                    { key: 'city', label: 'City' },
                                    { key: 'state', label: 'State' },
                                    { key: 'pincode', label: 'Pincode' },
                                ].map(f => (
                                    <div key={f.key} className={f.full ? 'md:col-span-2' : ''}>
                                        <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">{f.label}</label>
                                        <input
                                            value={(newAddr as any)[f.key]}
                                            onChange={e => setNewAddr(p => ({ ...p, [f.key]: e.target.value }))}
                                            className="w-full border-2 border-black px-3 py-2 font-inter bg-cream focus:outline-none focus:border-mustard"
                                        />
                                    </div>
                                ))}
                                <div className="md:col-span-2">
                                    <button onClick={handleAddAddress} className="btn-brutalist bg-black text-cream font-bebas text-lg tracking-widest px-8 py-3">
                                        SAVE ADDRESS
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
