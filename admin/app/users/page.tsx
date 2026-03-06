'use client';
import React, { useEffect, useState } from 'react';
import {
    Users,
    Search,
    Shield,
    Mail,
    MapPin,
    Calendar,
    ChevronRight,
    Info
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        adminAPI.getUsers()
            .then(({ data }) => setUsers(data.users || []))
            .catch(() => toast.error('Failed to load user list'))
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none text-black">CITIZENS</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2">Manage Member Ecosystem</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by name/email..."
                        className="bg-white border-2 border-black p-3 pl-10 outline-none font-bold text-sm min-w-[300px]"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="skeleton h-[200px] border-2 border-black" />)
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 bg-white border-2 border-black text-center italic font-bold text-black/20 text-4xl">NO MATCHES FOUND</div>
                ) : filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(217,164,65,1)] transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-black flex items-center justify-center text-mustard border-2 border-mustard font-black text-3xl">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-black text-xl uppercase italic leading-none truncate w-[160px]">{user.name}</h3>
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest flex items-center gap-1 mt-1">
                                    <Shield size={10} className="text-mustard" /> Member since {new Date(user.createdAt).getFullYear()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-black/10 pt-4">
                            <div className="flex items-center gap-3 text-xs font-bold uppercase opacity-60">
                                <Mail size={14} className="text-mustard" /> {user.email}
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold uppercase opacity-60">
                                <MapPin size={14} className="text-mustard" /> {user.addresses?.length || 0} Registered Locations
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold uppercase opacity-60">
                                <Calendar size={14} className="text-mustard" /> Last Entry: Active
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex-1 btn-admin bg-black text-cream py-2 text-xs font-black uppercase flex items-center justify-center gap-2">
                                <Info size={14} /> Full Dossier
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
