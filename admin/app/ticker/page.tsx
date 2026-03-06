'use client';
import React, { useEffect, useState } from 'react';
import {
    Plus,
    Trash2,
    Type,
    Send,
    MessageSquare
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminTicker() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchTicker();
    }, []);

    const fetchTicker = async () => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getTicker();
            setMessages(data.messages || []);
        } catch {
            toast.error('Failed to load ticker messages');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage) return;
        setAdding(true);
        try {
            await adminAPI.addTicker({ message: newMessage });
            toast.success('Message Added');
            setNewMessage('');
            fetchTicker();
        } catch {
            toast.error('Addition failed');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminAPI.deleteTicker(id);
            toast.success('Message Deleted');
            setMessages(messages.filter(m => m._id !== id));
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none text-black">TICKER</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2">Marquee Communication</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-black text-cream p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(47,59,47,1)]">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Send size={20} className="text-mustard" /> Broadcast New Line
                    </h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Live Message</label>
                            <textarea
                                required
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value.toUpperCase())}
                                className="w-full bg-cream/10 border-2 border-mustard p-4 outline-none font-black text-mustard placeholder:text-mustard/20 h-32 uppercase"
                                placeholder="E.G. FREE DELIVERY ON ORDERS OVER ₹2000 ✦"
                            />
                        </div>
                        <button disabled={adding} type="submit" className="w-full bg-mustard text-black py-4 font-black uppercase tracking-[0.2em] hover:bg-cream transition-all">
                            {adding ? 'ENQUEUING...' : 'PUSH TO MARQUEE →'}
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-widest border-l-8 border-black pl-4">Queue</h2>
                    {loading ? (
                        <div className="skeleton h-40 w-full" />
                    ) : messages.length === 0 ? (
                        <p className="text-black/30 font-bold italic uppercase">Marquee empty. No broadcasts active.</p>
                    ) : (
                        <div className="space-y-2">
                            {messages.map((m) => (
                                <div key={m._id} className="bg-cream border-2 border-black p-4 flex justify-between items-center group hover:bg-black hover:text-cream transition-all">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare size={16} className="text-mustard" />
                                        <span className="font-bold text-sm tracking-widest uppercase">{m.message}</span>
                                    </div>
                                    <button onClick={() => handleDelete(m._id)} className="p-2 opacity-0 group-hover:opacity-100 text-burgundy hover:scale-125 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
