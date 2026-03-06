'use client';
import React, { useEffect, useState } from 'react';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Upload,
    Link as LinkIcon,
    Type
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminHero() {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // New Slide Form
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [buttonLink, setButtonLink] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getHero();
            setSlides(data.slides || []);
        } catch {
            toast.error('Failed to load hero slides');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return toast.error('Please select an image');

        setAdding(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('buttonText', buttonText);
        formData.append('buttonLink', buttonLink);
        formData.append('image', file);

        try {
            await adminAPI.addHero(formData);
            toast.success('Slide Added Successfully');
            fetchHero();
            // Reset
            setTitle(''); setSubtitle(''); setButtonText(''); setButtonLink(''); setFile(null);
        } catch {
            toast.error('Slide addition failed');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminAPI.deleteHero(id);
            toast.success('Slide Deleted');
            setSlides(slides.filter(s => s._id !== id));
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none text-black">VISUALS</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2">Manage Hero Slides</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Active Slides */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-widest border-l-8 border-mustard pl-4">Live Assets</h2>
                    {loading ? (
                        <div className="skeleton h-64 w-full" />
                    ) : slides.length === 0 ? (
                        <p className="text-black/30 font-bold uppercase italic">No active slides in rotation.</p>
                    ) : (
                        <div className="space-y-4">
                            {slides.map((slide) => (
                                <div key={slide._id} className="bg-black text-cream flex gap-6 p-4 border-2 border-black group">
                                    <div className="relative w-32 h-20 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all border border-cream/20">
                                        <Image src={slide.image} alt="" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-lg truncate text-mustard uppercase">{slide.title}</h3>
                                        <p className="text-[10px] opacity-60 truncate mb-2">{slide.subtitle}</p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold">
                                            <span className="bg-cream/10 px-2 py-0.5">{slide.buttonText}</span>
                                            <ChevronRight size={12} className="text-mustard" />
                                            <span className="opacity-40 truncate">{slide.buttonLink}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(slide._id)}
                                        className="self-center p-3 text-burgundy hover:bg-burgundy hover:text-cream transition-all border-2 border-transparent hover:border-cream"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add New Slide */}
                <div className="bg-mustard p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-3xl font-black italic mb-8 uppercase leading-none">Inject New Slide</h2>
                    <form onSubmit={handleAddSlide} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block flex items-center gap-2"><Type size={12} /> Primary Title</label>
                            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-cream/20 border-2 border-black p-3 outline-none font-black text-black placeholder:text-black/30" placeholder="e.g. SUMMER DROP '24" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block flex items-center gap-2"><Type size={12} /> Supporting Subtitle</label>
                            <input required value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-cream/20 border-2 border-black p-3 outline-none font-black text-black placeholder:text-black/30" placeholder="Bold statements go here..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block flex items-center gap-2"><ImageIcon size={12} /> Button Label</label>
                                <input required value={buttonText} onChange={e => setButtonText(e.target.value)} className="w-full bg-cream/20 border-2 border-black p-3 outline-none font-black text-black placeholder:text-black/30" placeholder="SHOP DROP" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block flex items-center gap-2"><LinkIcon size={12} /> Redirect Link</label>
                                <input required value={buttonLink} onChange={e => setButtonLink(e.target.value)} className="w-full bg-cream/20 border-2 border-black p-3 outline-none font-black text-black placeholder:text-black/30" placeholder="/products" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-black mb-1 block flex items-center gap-2"><Upload size={12} /> Visual Media</label>
                            <div className="border-2 border-black border-dashed p-6 text-center cursor-pointer hover:bg-black/10 transition-colors relative">
                                <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <Upload size={24} className="mx-auto mb-2" />
                                <p className="font-black text-[10px] uppercase">{file ? file.name : 'Choose Master Visual'}</p>
                            </div>
                        </div>
                        <button disabled={adding} type="submit" className="w-full bg-black text-cream py-4 font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-cream hover:text-black transition-all active:translate-y-1">
                            {adding ? 'ESTABLISHING ASSET...' : 'DEPLOY TO FRONTEND →'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
