import type { Metadata } from 'next';
import './globals.css';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
    title: 'Kicks Don\'t Stink Admin',
    description: 'Control Center for KKS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AdminAuthProvider>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: { background: '#111', color: '#F4F1EA', border: '2px solid #D9A441' },
                        }}
                    />
                    <SidebarWrapper>{children}</SidebarWrapper>
                </AdminAuthProvider>
            </body>
        </html>
    );
}
