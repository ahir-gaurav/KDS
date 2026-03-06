'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAdmin } = useAdminAuth();

    const isLoginPage = pathname === '/login';

    if (isLoginPage) return <>{children}</>;

    return (
        <div className="flex">
            <Sidebar />
            <main className="ml-64 flex-1 min-h-screen p-8 bg-cream text-black">
                {children}
            </main>
        </div>
    );
}
