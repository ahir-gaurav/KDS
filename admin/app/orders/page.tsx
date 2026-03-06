'use client';
import React, { useEffect, useState } from 'react';
import {
    Search,
    Filter,
    ChevronRight,
    Eye,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_ICONS: Record<string, any> = {
    Processing: Clock,
    Shipped: Truck,
    Delivered: CheckCircle,
    Cancelled: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
    Processing: 'bg-mustard text-black',
    Shipped: 'bg-olive text-white',
    Delivered: 'bg-green-600 text-white',
    Cancelled: 'bg-burgundy text-white',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getOrders();
            setOrders(data.orders || []);
        } catch {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setUpdating(true);
        try {
            await adminAPI.updateOrderStatus(id, { status });
            toast.success(`Order marked as ${status}`);
            fetchOrders();
            setSelectedOrder(null);
        } catch {
            toast.error('Status update failed');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none text-black">DISPATCH</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2">Fulfillment Control</p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-cream">
                            <th className="p-4 font-black uppercase text-xs tracking-widest">ID #</th>
                            <th className="p-4 font-black uppercase text-xs tracking-widest">DATE</th>
                            <th className="p-4 font-black uppercase text-xs tracking-widest">CUSTOMER</th>
                            <th className="p-4 font-black uppercase text-xs tracking-widest">AMOUNT</th>
                            <th className="p-4 font-black uppercase text-xs tracking-widest">PAYMENT</th>
                            <th className="p-4 font-black uppercase text-xs tracking-widest">STATUS</th>
                            <th className="p-4 font-black uppercase text-xs tracking-widest text-right">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="border-b border-black/10">
                                    <td colSpan={7} className="p-4"><div className="skeleton h-8 w-full" /></td>
                                </tr>
                            ))
                        ) : orders.map((order) => {
                            const Icon = STATUS_ICONS[order.status] || AlertCircle;
                            return (
                                <tr key={order._id} className="border-b border-black/10 hover:bg-mustard/5 transition-colors">
                                    <td className="p-4 font-black text-sm">{order.orderNumber}</td>
                                    <td className="p-4 text-xs font-bold opacity-60">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-xs uppercase">{order.user?.name}</p>
                                        <p className="text-[10px] opacity-40">{order.user?.email}</p>
                                    </td>
                                    <td className="p-4 font-black text-sm text-mustard">₹{(order.totalPrice || 0).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`text-[9px] font-black uppercase border px-2 py-0.5 ${order.paymentStatus === 'paid' ? 'border-green-500 text-green-600' : 'border-burgundy text-burgundy'}`}>
                                            {order.paymentMethod} • {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[order.status]}`}>
                                            <Icon size={12} /> {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="btn-admin bg-black text-cream py-1 px-3 text-[10px]"
                                        >
                                            MANAGE
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <div className="w-full max-w-2xl bg-cream border-4 border-black p-10 relative">
                        <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white border-2 border-black">
                            <XCircle size={24} />
                        </button>
                        <h2 className="text-4xl font-black italic border-b-4 border-black pb-4 mb-8">MANIFEST #{selectedOrder.orderNumber}</h2>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2">Customer Info</p>
                                <p className="font-black text-lg">{selectedOrder.user?.name}</p>
                                <p className="font-bold text-xs opacity-60 mb-4">{selectedOrder.user?.email}</p>

                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2">Shipping Vector</p>
                                <p className="font-bold text-xs leading-relaxed italic">
                                    {selectedOrder.deliveryAddress?.addressLine1},<br />
                                    {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}<br />
                                    PIN: {selectedOrder.deliveryAddress?.pincode}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2">Item Breakdown</p>
                                <div className="space-y-2">
                                    {selectedOrder.products.map((p: any, i: number) => (
                                        <div key={i} className="flex justify-between text-xs font-bold border-b border-black/5 pb-1">
                                            <span>{p.name} ({p.size}) x{p.quantity}</span>
                                            <span>₹{((p.price || 0) * (p.quantity || 0)).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-black text-mustard pt-2">
                                        <span>TOTAL PAYLOAD</span>
                                        <span>₹{(selectedOrder.totalPrice || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t-2 border-black">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-4">Update Fulfillment Status</p>
                            <div className="grid grid-cols-2 gap-4">
                                {['Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        disabled={updating || selectedOrder.status === status}
                                        onClick={() => updateStatus(selectedOrder._id, status)}
                                        className={`btn-admin uppercase font-black text-xs py-3 ${selectedOrder.status === status ? 'bg-black/10 text-black/30 pointer-events-none' : 'bg-black text-cream hover:bg-mustard hover:text-black'}`}
                                    >
                                        Mark as {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
