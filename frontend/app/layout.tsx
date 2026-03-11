import type { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import ClerkTokenSync from '@/components/ClerkTokenSync';

export const metadata: Metadata = {
    title: "Kicks Don't Stink — Natural Shoe Deodorisers",
    description: 'Bold sneakers for bold people. Shop the latest drops from Kicks Don\'t Stink.',
    keywords: 'sneakers, kicks, shoes, streetwear, limited edition',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://api.fontshare.com" />
            </head>
            <body>
                <ClerkProvider>
                    <ClerkTokenSync />
                    <CartProvider>
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: { background: '#111', color: '#F4F1EA', border: '2px solid #D9A441' },
                            }}
                        />
                        <Header />
                        <main className="min-h-screen">{children}</main>
                        <Footer />
                    </CartProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
