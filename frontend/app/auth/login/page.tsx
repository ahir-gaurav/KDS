'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Left Editorial Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden items-end p-12">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="font-bebas text-[20vw] text-cream/5 rotate-[-15deg] leading-none whitespace-nowrap">KICKS</span>
                </div>
                <div className="relative z-10">
                    <p className="font-inter text-cream/40 text-sm uppercase tracking-widest mb-2">Welcome Back</p>
                    <h1 className="font-bebas text-7xl text-cream leading-none">STEP<br /><span className="text-mustard">BACK IN</span></h1>
                </div>
            </div>

            {/* Right Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <h2 className="font-bebas text-5xl mb-1">LOGIN</h2>
                        <p className="font-inter text-black/50 text-sm">New here? <Link href="/auth/signup" className="text-mustard font-semibold hover:underline">Create account</Link></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                className="w-full border-2 border-black px-4 py-3 font-inter bg-cream focus:outline-none focus:border-mustard"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    className="w-full border-2 border-black px-4 py-3 pr-12 font-inter bg-cream focus:outline-none focus:border-mustard"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="text-right mt-1">
                                <Link href="/auth/forgot-password" className="font-inter text-xs text-black/50 hover:text-mustard">Forgot password?</Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-brutalist w-full bg-black text-cream font-bebas text-xl tracking-widest py-4"
                        >
                            {loading ? 'LOGGING IN...' : 'LOGIN →'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
