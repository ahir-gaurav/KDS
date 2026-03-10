'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import { useAdminAuth } from '@/context/AdminAuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAdminAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await adminAPI.login({ email, password, secretCode });
            login(data.token);
            toast.success('Admin Login Successful');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-cream border-4 border-mustard p-10 relative">
                <div className="absolute top-0 right-0 bg-mustard text-black px-4 py-1 font-bold text-xs uppercase tracking-widest translate-y-[-100%]">
                    System Access
                </div>

                <h1 className="font-bold text-4xl mb-8 tracking-tighter text-black uppercase leading-none italic border-b-4 border-black pb-4">
                    ADMIN LOGIN
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-2 border-black p-3 outline-none focus:bg-mustard/10 transition-colors font-medium"
                            placeholder="admin@kds.com"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-2 border-black p-3 outline-none focus:bg-mustard/10 transition-colors font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Secret Code</label>
                        <input
                            type="password"
                            required
                            value={secretCode}
                            onChange={(e) => setSecretCode(e.target.value)}
                            className="w-full bg-transparent border-2 border-black p-3 outline-none focus:bg-mustard/10 transition-colors font-medium"
                            placeholder="6-digit-secret"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-cream p-4 font-bold uppercase tracking-[0.3em] hover:bg-mustard hover:text-black transition-all border-2 border-black active:translate-y-1"
                    >
                        {loading ? 'Authenticating...' : 'ESTABLISH LINK →'}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-black/50">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-black font-bold uppercase tracking-widest hover:text-mustard transition-colors underline underline-offset-4">
                            Register
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between opacity-30">
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-black" />
                        <div className="w-4 h-3 bg-black" />
                        <div className="w-1 h-3 bg-black" />
                    </div>
                    <span className="text-[8px] font-mono tracking-widest">KDS_ROOT_ACCESS_V1.0</span>
                </div>
            </div>
        </div>
    );
}

