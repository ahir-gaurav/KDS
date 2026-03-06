'use client';
import React, { useEffect, useState } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronRight,
    X,
    Upload,
    LayoutGrid,
    List,
    Info
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [adding, setAdding] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await adminAPI.getProducts();
            setProducts(data.products || []);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return toast.error('Upload at least one image');

        setAdding(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        if (salePrice) formData.append('salePrice', salePrice);
        formData.append('description', description);
        tags.forEach(tag => formData.append('tags', tag));
        files.forEach(file => formData.append('images', file));

        try {
            await adminAPI.createProduct(formData);
            toast.success('Product Created Successfully');
            setShowAddModal(false);
            fetchProducts();
            // Reset
            setName(''); setCategory(''); setPrice(''); setSalePrice(''); setDescription(''); setFiles([]); setTags([]);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Creation failed');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product permanently?')) return;
        try {
            await adminAPI.deleteProduct(id);
            toast.success('Product Deleted');
            setProducts(products.filter(p => p._id !== id));
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-black pb-6">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter leading-none">INVENTORY</h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-black/40 mt-2">Manage Store Catalog</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-admin bg-black text-cream flex items-center gap-2"
                >
                    <Plus size={20} /> ADD PRODUCT
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-[300px] border-2 border-black" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-cream border-2 border-black group relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(217,164,65,1)] transition-all">
                            <div className="aspect-square relative overflow-hidden bg-white">
                                <Image
                                    src={product.images[0] || '/placeholder.png'}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {product.tags?.map((t: string) => (
                                        <span key={t} className="bg-black text-cream text-[8px] uppercase font-bold px-2 py-0.5 tracking-tighter self-start">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t-2 border-black">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-black/40">{product.category}</p>
                                        <h3 className="font-black text-sm uppercase leading-none truncate w-[140px]">{product.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-lg text-mustard leading-none">₹{(product.salePrice || product.price || 0).toLocaleString()}</p>
                                        {(product.salePrice && product.price) ? <p className="text-[10px] line-through text-black/30">₹{(product.price || 0).toLocaleString()}</p> : null}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-black/10">
                                    <button className="flex-1 btn-admin bg-white text-black py-1 text-xs font-bold uppercase hover:bg-black hover:text-white">Edit</button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="p-2 border-2 border-black hover:bg-burgundy hover:text-cream transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-4xl bg-cream border-4 border-black p-10 max-h-[90vh] overflow-y-auto relative"
                    >
                        <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white border-2 border-black"><X size={24} /></button>
                        <h2 className="text-4xl font-black italic border-b-4 border-black pb-4 mb-8">INITIATE NEW ITEM</h2>

                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Product Name</label>
                                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Base Price</label>
                                        <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Sale Price (Opt)</label>
                                        <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Category</label>
                                    <input required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" placeholder="e.g. Jordan, Nike, etc" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Description</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold h-32" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Upload Imagery</label>
                                    <div className="border-2 border-black border-dashed p-8 text-center cursor-pointer hover:bg-mustard/10 transition-colors relative">
                                        <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files || []))} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Upload size={32} className="mx-auto mb-4" />
                                        <p className="font-bold text-xs uppercase tracking-widest">{files.length > 0 ? `${files.length} Files Locked` : 'Drag & Drop Visual Assets'}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Product Tags</label>
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {tags.map(t => (
                                            <span key={t} className="bg-black text-cream px-3 py-1 text-[10px] font-bold uppercase flex items-center gap-2">
                                                {t} <X size={10} className="cursor-pointer" onClick={() => setTags(tags.filter(xt => xt !== t))} />
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            value={newTag}
                                            onChange={e => setNewTag(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), setTags([...tags, newTag]), setNewTag(''))}
                                            className="flex-1 bg-transparent border-2 border-black p-2 outline-none font-bold"
                                            placeholder="Add tag..."
                                        />
                                        <button type="button" onClick={() => { setTags([...tags, newTag]); setNewTag(''); }} className="p-2 bg-black text-cream border-2 border-black"><Plus size={16} /></button>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" disabled={adding} className="w-full btn-admin bg-black text-cream py-4 font-black uppercase tracking-[0.2em]">
                                        {adding ? 'UPLOADING TO SYSTEM...' : 'DEPLOY PRODUCT →'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
