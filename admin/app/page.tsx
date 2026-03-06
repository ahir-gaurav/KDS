'use client';
import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    TrendingUp,
    Package,
    Users,
    ShoppingCart,
    IndianRupee,
    AlertCircle
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getStats()
            .then(({ data }) => setStats(data.stats))
            .catch(() => toast.error('Failed to load dashboard stats'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8"><div className="skeleton w-full h-[500px]" /></div>;

    const StatBox = ({ title, value, icon: Icon, color }: any) => (
        <div className="bg-mustard/10 border-2 border-black p-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 translate-x-1/2 translate-y-[-50%] rotate-45`} />
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-1">{title}</p>
                    <h3 className="text-3xl font-black italic">{value}</h3>
                </div>
                <div className="p-2 bg-black text-cream">
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none">COMMAND<br />CENTER</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2 flex items-center gap-2">
                        <TrendingUp size={14} className="text-mustard" /> Real-time System Analytics
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono opacity-40 uppercase tracking-widest">Status: Operational</p>
                    <p className="font-bold text-2xl mb-[-4px]">₹{(stats?.revenue || 0).toLocaleString()}</p>
                    <span className="text-[10px] uppercase font-bold text-mustard tracking-widest">Total Revenue</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox title="Products" value={stats?.totalProducts || 0} icon={Package} color="bg-black" />
                <StatBox title="Active Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} color="bg-mustard" />
                <StatBox title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="bg-burgundy" />
                <StatBox title="Out of Stock" value={stats?.outOfStockItems || 0} icon={AlertCircle} color="bg-red-500" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-black text-cream p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(217,164,65,1)]">
                    <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-8 flex justify-between">
                        Monthly Performance
                        <span className="text-[10px] opacity-40">Financial Analytics</span>
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D9A441" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#D9A441" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="month" stroke="#999" fontSize={12} tickLine={false} />
                                <YAxis stroke="#999" fontSize={12} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #D9A441', color: '#F4F1EA' }}
                                    itemStyle={{ color: '#D9A441' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#D9A441" fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Bar Chart */}
                <div className="bg-cream border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-8 flex justify-between text-black">
                        Order Volume
                        <span className="text-[10px] opacity-40">Monthly Counts</span>
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                                <XAxis dataKey="month" stroke="#333" fontSize={12} tickLine={false} />
                                <YAxis stroke="#333" fontSize={12} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#F4F1EA', border: '2px solid #000', color: '#000' }}
                                    cursor={{ fill: 'rgba(217,164,65,0.2)' }}
                                />
                                <Bar dataKey="orders" fill="#000" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Low Stock Alerts */}
            {stats?.lowStockProducts?.length > 0 && (
                <div className="bg-burgundy text-cream p-6 border-4 border-black">
                    <h4 className="font-bold uppercase tracking-[0.3em] text-sm mb-4 flex items-center gap-2">
                        <AlertCircle size={16} /> Inventory Warning: Critical Stock Levels
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.lowStockProducts.map((p: any) => (
                            <div key={p._id} className="bg-black/20 p-3 border border-cream/10 flex justify-between items-center">
                                <span className="text-xs truncate max-w-[150px]">{p.name}</span>
                                <span className="font-bold text-mustard bg-black px-2 py-0.5 text-xs">Only {p.stock} left</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
