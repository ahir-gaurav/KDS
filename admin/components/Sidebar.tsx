'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Image as ImageIcon,
    Type,
    Settings,
    Users,
    Ticket,
    LogOut
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Products', icon: ShoppingBag, href: '/products' },
    { label: 'Orders', icon: ShoppingCart, href: '/orders' },
    { label: 'Hero Slides', icon: ImageIcon, href: '/hero' },
    { label: 'Ticker Messages', icon: Type, href: '/ticker' },
    { label: 'Coupons', icon: Ticket, href: '/coupons' },
    { label: 'Users', icon: Users, href: '/users' },
    { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAdminAuth();

    return (
        <div className="w-64 h-screen bg-black text-cream flex flex-col fixed left-0 top-0 border-r-4 border-mustard">
            <div className="p-8 border-b-2 border-cream/10">
                <h1 className="font-bold text-xl tracking-tight leading-none text-mustard">KDS ADMIN</h1>
                <p className="text-[10px] text-cream/40 mt-1 uppercase tracking-widest">Control Center</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-8 py-4 transition-all hover:bg-mustard hover:text-black ${isActive ? 'bg-mustard text-black border-r-8 border-cream' : ''}`}
                        >
                            <Icon size={20} />
                            <span className="font-semibold text-sm uppercase tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                className="p-8 flex items-center gap-4 text-burgundy border-t-2 border-cream/10 hover:bg-burgundy hover:text-cream transition-all"
            >
                <LogOut size={20} />
                <span className="font-bold uppercase tracking-widest text-sm">Logout</span>
            </button>
        </div>
    );
}
