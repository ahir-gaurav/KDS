'use client';
import React, { useEffect, useState } from 'react';
import {
    Settings,
    ShieldCheck,
    Truck,
    Percent,
    Save,
    CreditCard,
    Key
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({
        gst: 18,
        deliveryCharge: 80,
        freeDeliveryThreshold: 2000,
        adminEmail: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        adminAPI.getSettings()
            .then(({ data }) => {
                if (data.settings) setSettings(data.settings);
            })
            .catch(() => toast.error('Failed to load settings'))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await adminAPI.updateSettings(settings);
            toast.success('System Parameters Updated');
        } catch {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8"><div className="skeleton w-full h-[400px]" /></div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none text-black">POLICIES</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2">Manage System Variables</p>
                </div>
            </div>

            <div className="max-w-4xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-black text-mustard px-6 py-2 font-black text-xs uppercase tracking-widest -rotate-45 translate-x-8 translate-y-4">System_Root</div>

                <form onSubmit={handleSave} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Financials */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black italic uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                                <Percent size={20} className="text-mustard" /> Financials
                            </h3>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">GST Percentage (%)</label>
                                <input
                                    type="number"
                                    value={settings.gst}
                                    onChange={e => setSettings({ ...settings, gst: parseFloat(e.target.value) })}
                                    className="w-full bg-cream border-2 border-black p-3 outline-none font-black text-lg"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Delivery Charge (₹)</label>
                                <input
                                    type="number"
                                    value={settings.deliveryCharge}
                                    onChange={e => setSettings({ ...settings, deliveryCharge: parseFloat(e.target.value) })}
                                    className="w-full bg-cream border-2 border-black p-3 outline-none font-black text-lg"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Free Delivery Threshold (₹)</label>
                                <input
                                    type="number"
                                    value={settings.freeDeliveryThreshold}
                                    onChange={e => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) })}
                                    className="w-full bg-cream border-2 border-black p-3 outline-none font-black text-lg"
                                />
                            </div>
                        </div>

                        {/* Email & Alerts */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black italic uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-mustard" /> Alerts
                            </h3>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1 block">Notification Email</label>
                                <input
                                    type="email"
                                    value={settings.adminEmail}
                                    onChange={e => setSettings({ ...settings, adminEmail: e.target.value })}
                                    className="w-full bg-cream border-2 border-black p-3 outline-none font-black text-lg placeholder:text-black/10"
                                    placeholder="alerts@kds.com"
                                />
                                <p className="text-[9px] font-bold text-black/40 mt-1 uppercase italic">* Monthly reports & order alerts will be sent here.</p>
                            </div>

                            <div className="p-4 bg-mustard/10 border-2 border-black/10">
                                <h4 className="text-xs font-black uppercase flex items-center gap-2 mb-2">
                                    <Key size={14} className="text-mustard" /> Payment Integration
                                </h4>
                                <p className="text-[10px] font-bold opacity-60 leading-relaxed uppercase">
                                    Razorpay link established via environment variables. Verify Keys in server configuration.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={saving}
                        type="submit"
                        className="w-full btn-admin bg-black text-cream py-5 font-black uppercase tracking-[0.4em] text-xl shadow-[8px_8px_0px_0px_rgba(217,164,65,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        {saving ? 'UPDATING POLICIES...' : 'COMMiT CHANGES →'}
                    </button>
                </form>

                <div className="mt-12 text-center opacity-20">
                    <p className="text-[8px] font-mono tracking-widest uppercase">System Parameter Matrix Locked • KDS Internal Use Only</p>
                </div>
            </div>
        </div>
    );
}
