'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminRegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Inline error state
    const [errors, setErrors] = useState<Record<string, string>>({});

    const router = useRouter();

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = 'Full name is required';
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!adminCode.trim()) {
            newErrors.adminCode = 'Admin Secret Key is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await adminAPI.register({ name, email, password, adminCode });
            toast.success('Registration successful. Please login.');
            router.push('/login');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed';
            if (msg.toLowerCase().includes('email')) {
                setErrors(prev => ({ ...prev, email: msg }));
            } else if (msg.toLowerCase().includes('secret') || msg.toLowerCase().includes('admin')) {
                setErrors(prev => ({ ...prev, adminCode: msg }));
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-cream border-4 border-mustard p-10 relative">
                <div className="absolute top-0 right-0 bg-mustard text-black px-4 py-1 font-bold text-xs uppercase tracking-widest translate-y-[-100%]">
                    New Admin
                </div>

                <h1 className="font-bold text-4xl mb-8 tracking-tighter text-black uppercase leading-none italic border-b-4 border-black pb-4">
                    ADMIN REGISTER
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                            className={`w-full bg-transparent border-2 ${errors.name ? 'border-red-500' : 'border-black'} p-3 outline-none focus:bg-mustard/10 transition-colors font-medium`}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                            className={`w-full bg-transparent border-2 ${errors.email ? 'border-red-500' : 'border-black'} p-3 outline-none focus:bg-mustard/10 transition-colors font-medium`}
                            placeholder="admin@kds.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                                className={`w-full bg-transparent border-2 ${errors.password ? 'border-red-500' : 'border-black'} p-3 pr-12 outline-none focus:bg-mustard/10 transition-colors font-medium`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                                className={`w-full bg-transparent border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-black'} p-3 pr-12 outline-none focus:bg-mustard/10 transition-colors font-medium`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-bold">{errors.confirmPassword}</p>}
                    </div>

                    {/* Admin Secret Key */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-2 block">Admin Secret Key</label>
                        <input
                            type="password"
                            value={adminCode}
                            onChange={(e) => { setAdminCode(e.target.value); setErrors(prev => ({ ...prev, adminCode: '' })); }}
                            className={`w-full bg-transparent border-2 ${errors.adminCode ? 'border-red-500' : 'border-black'} p-3 outline-none focus:bg-mustard/10 transition-colors font-medium`}
                            placeholder="Enter admin secret key"
                        />
                        {errors.adminCode && <p className="text-red-500 text-xs mt-1 font-bold">{errors.adminCode}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-cream p-4 font-bold uppercase tracking-[0.3em] hover:bg-mustard hover:text-black transition-all border-2 border-black active:translate-y-1"
                    >
                        {loading ? 'Creating Account...' : 'CREATE ADMIN ACCOUNT →'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-black/50">
                        Already have an account?{' '}
                        <Link href="/login" className="text-black font-bold uppercase tracking-widest hover:text-mustard transition-colors underline underline-offset-4">
                            Login
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between opacity-30">
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-black" />
                        <div className="w-4 h-3 bg-black" />
                        <div className="w-1 h-3 bg-black" />
                    </div>
                    <span className="text-[8px] font-mono tracking-widest">KDS_ADMIN_REG_V1.0</span>
                </div>
            </div>
        </div>
    );
}
