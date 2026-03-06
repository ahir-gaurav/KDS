'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp' | 'done'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.forgotPassword({ email });
            toast.success('OTP sent!');
            setStep('otp');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.resetPassword({ email, otp, newPassword });
            toast.success('Password reset!');
            setStep('done');
            setTimeout(() => router.push('/auth/login'), 2000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
                {step === 'email' && (
                    <motion.div key="email" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                        <h1 className="font-bebas text-5xl mb-2">FORGOT PASSWORD</h1>
                        <p className="font-inter text-black/50 text-sm mb-8">Enter your email to receive a reset OTP</p>
                        <form onSubmit={handleRequestOTP} className="space-y-5">
                            <div>
                                <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full border-2 border-black px-4 py-3 font-inter bg-cream focus:outline-none focus:border-mustard"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-brutalist w-full bg-black text-cream font-bebas text-xl tracking-widest py-4">
                                {loading ? 'SENDING...' : 'SEND OTP →'}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 'otp' && (
                    <motion.div key="otp" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                        <h1 className="font-bebas text-5xl mb-2">RESET PASSWORD</h1>
                        <p className="font-inter text-black/50 text-sm mb-8">OTP sent to <strong>{email}</strong></p>
                        <form onSubmit={handleReset} className="space-y-5">
                            <div>
                                <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">OTP Code</label>
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
                            <div>
                                <label className="font-inter text-xs uppercase tracking-widest text-black/50 mb-1 block">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full border-2 border-black px-4 py-3 font-inter bg-cream focus:outline-none focus:border-mustard"
                                    placeholder="New password"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-brutalist w-full bg-mustard text-black font-bebas text-xl tracking-widest py-4">
                                {loading ? 'RESETTING...' : 'RESET PASSWORD →'}
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 'done' && (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="font-bebas text-4xl mb-2">PASSWORD RESET!</h1>
                        <p className="font-inter text-black/50">Redirecting to login...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
