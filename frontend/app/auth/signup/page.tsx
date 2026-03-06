'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const { setUser, setToken } = useAuth();
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.signup(form);
            toast.success('OTP sent to your email!');
            setStep('otp');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.verifyOTP({ email: form.email, otp });
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Account verified! Welcome 👟');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex">
            <div className="hidden lg:flex lg:w-1/2 bg-olive relative overflow-hidden items-end p-12">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="font-bebas text-[20vw] text-cream/5 rotate-[15deg] leading-none whitespace-nowrap">NEW</span>
                </div>
                <div className="relative z-10">
                    <p className="font-inter text-cream/40 text-sm uppercase tracking-widest mb-2">Join the crew</p>
                    <h1 className="font-bebas text-7xl text-cream leading-none">FRESH<br /><span className="text-mustard">START</span></h1>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {step === 'form' ? (
                        <motion.div key="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-md">
                            <div className="mb-8">
                                <h2 className="font-bebas text-5xl mb-1">CREATE ACCOUNT</h2>
                                <p className="font-inter text-black/50 text-sm">Already have an account? <Link href="/auth/login" className="text-mustard font-semibold hover:underline">Login</Link></p>
                            </div>
                            <form onSubmit={handleSignup} className="space-y-5">
                                {[
                                    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your Name' },
                                    { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                                    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">{field.label}</label>
                                        <input
                                            type={field.type}
                                            required
                                            value={(form as any)[field.key]}
                                            onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                                            className="w-full border-2 border-black px-4 py-3 font-inter bg-cream focus:outline-none focus:border-mustard"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}
                                <button type="submit" disabled={loading} className="btn-brutalist w-full bg-black text-cream font-bebas text-xl tracking-widest py-4">
                                    {loading ? 'SENDING OTP...' : 'CREATE ACCOUNT →'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="otp" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-md">
                            <div className="mb-8">
                                <h2 className="font-bebas text-5xl mb-1">VERIFY EMAIL</h2>
                                <p className="font-inter text-black/50 text-sm">We sent a 6-digit OTP to <strong>{form.email}</strong></p>
                            </div>
                            <form onSubmit={handleVerify} className="space-y-5">
                                <div>
                                    <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">Enter OTP</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full border-2 border-mustard px-4 py-4 font-bebas text-4xl tracking-[0.5em] text-center bg-cream focus:outline-none"
                                        placeholder="000000"
                                    />
                                </div>
                                <button type="submit" disabled={loading} className="btn-brutalist w-full bg-mustard text-black font-bebas text-xl tracking-widest py-4">
                                    {loading ? 'VERIFYING...' : 'VERIFY & JOIN →'}
                                </button>
                                <button type="button" onClick={() => setStep('form')} className="w-full font-inter text-sm text-black/40 hover:text-black text-center">
                                    ← Change email
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
