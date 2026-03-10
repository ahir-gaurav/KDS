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
    Info,
    Tag,
    Percent,
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

    // Offer & Pricing State
    const [mrp, setMrp] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [isOfferActive, setIsOfferActive] = useState(false);
    const [offerLabel, setOfferLabel] = useState('');

    // Offer edit modal
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerProduct, setOfferProduct] = useState<any>(null);
    const [offerMrp, setOfferMrp] = useState('');
    const [offerDiscount, setOfferDiscount] = useState('');
    const [offerActive, setOfferActive] = useState(false);
    const [offerLabelEdit, setOfferLabelEdit] = useState('');
    const [savingOffer, setSavingOffer] = useState(false);

    // Computed selling price (live preview)
    const computedSellingPrice = mrp && discountPercent
        ? Math.round(parseFloat(mrp) - (parseFloat(mrp) * parseInt(discountPercent || '0') / 100))
        : mrp ? parseFloat(mrp) : 0;

    const computedOfferSellingPrice = offerMrp && offerDiscount
        ? Math.round(parseFloat(offerMrp) - (parseFloat(offerMrp) * parseInt(offerDiscount || '0') / 100))
        : offerMrp ? parseFloat(offerMrp) : 0;

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

        // Offer fields
        if (mrp) formData.append('mrp', mrp);
        if (discountPercent) formData.append('discountPercent', discountPercent);
        formData.append('isOfferActive', String(isOfferActive));
        if (offerLabel) formData.append('offerLabel', offerLabel);

        try {
            await adminAPI.createProduct(formData);
            toast.success('Product Created Successfully');
            setShowAddModal(false);
            fetchProducts();
            // Reset
            setName(''); setCategory(''); setPrice(''); setSalePrice(''); setDescription(''); setFiles([]); setTags([]);
            setMrp(''); setDiscountPercent(''); setIsOfferActive(false); setOfferLabel('');
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

    const openOfferModal = (product: any) => {
        setOfferProduct(product);
        setOfferMrp(product.mrp?.toString() || product.price?.toString() || '');
        setOfferDiscount(product.discountPercent?.toString() || '0');
        setOfferActive(product.isOfferActive || false);
        setOfferLabelEdit(product.offerLabel || '');
        setShowOfferModal(true);
    };

    const handleSaveOffer = async () => {
        if (!offerProduct) return;
        if (!offerMrp || parseFloat(offerMrp) <= 0) return toast.error('MRP is required');
        const disc = parseInt(offerDiscount || '0');
        if (disc < 0 || disc > 90) return toast.error('Discount must be 0–90%');

        setSavingOffer(true);
        try {
            await adminAPI.updateProductOffer(offerProduct._id, {
                mrp: parseFloat(offerMrp),
                discountPercent: disc,
                isOfferActive: offerActive,
                offerLabel: offerLabelEdit || undefined,
            });
            toast.success('Offer updated!');
            setShowOfferModal(false);
            fetchProducts();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update offer');
        } finally {
            setSavingOffer(false);
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
                                    {product.isOfferActive && product.discountPercent > 0 && (
                                        <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 tracking-tighter self-start">
                                            -{product.discountPercent}%
                                        </span>
                                    )}
                                    {product.isOfferActive && product.offerLabel && (
                                        <span className="bg-mustard text-black text-[8px] uppercase font-bold px-2 py-0.5 tracking-tighter self-start">
                                            {product.offerLabel}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border-t-2 border-black">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-black/40">{product.category}</p>
                                        <h3 className="font-black text-sm uppercase leading-none truncate w-[140px]">{product.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        {product.isOfferActive && product.discountPercent > 0 && product.sellingPrice ? (
                                            <>
                                                <p className="font-black text-lg text-mustard leading-none">₹{(product.sellingPrice || 0).toLocaleString()}</p>
                                                <p className="text-[10px] line-through text-black/30">₹{(product.mrp || product.price || 0).toLocaleString()}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-black text-lg text-mustard leading-none">₹{(product.salePrice || product.price || 0).toLocaleString()}</p>
                                                {(product.salePrice && product.price) ? <p className="text-[10px] line-through text-black/30">₹{(product.price || 0).toLocaleString()}</p> : null}
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-black/10">
                                    <button className="flex-1 btn-admin bg-white text-black py-1 text-xs font-bold uppercase hover:bg-black hover:text-white">Edit</button>
                                    <button
                                        onClick={() => openOfferModal(product)}
                                        className="p-2 border-2 border-black hover:bg-mustard hover:text-black transition-colors"
                                        title="Manage Offer"
                                    >
                                        <Percent size={16} />
                                    </button>
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

            {/* Add Product Modal */}
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

                                {/* Offer & Pricing Section */}
                                <div className="border-2 border-mustard p-4 bg-mustard/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Tag size={16} className="text-mustard" />
                                        <h3 className="font-black text-sm uppercase tracking-widest">Offer & Pricing</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">MRP (₹)</label>
                                            <input type="number" min="0" value={mrp} onChange={e => setMrp(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" placeholder="e.g. 799" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Discount %</label>
                                            <input type="number" min="0" max="90" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" placeholder="e.g. 50" />
                                        </div>
                                    </div>
                                    {mrp && (
                                        <div className="mt-3 p-3 bg-black text-cream flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Selling Price</span>
                                            <span className="font-black text-xl">₹{computedSellingPrice.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="mt-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Offer Label (Optional)</label>
                                        <input value={offerLabel} onChange={e => setOfferLabel(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" placeholder="e.g. Flash Sale, Limited Time" />
                                    </div>
                                    <div className="mt-3 flex items-center gap-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/50">Offer Active</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsOfferActive(!isOfferActive)}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${isOfferActive ? 'bg-green-500' : 'bg-black/20'}`}
                                        >
                                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isOfferActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                        </button>
                                        <span className="text-xs font-bold">{isOfferActive ? 'ON' : 'OFF'}</span>
                                    </div>
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

            {/* Offer Edit Modal */}
            {showOfferModal && offerProduct && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-lg bg-cream border-4 border-mustard p-8 relative"
                    >
                        <button onClick={() => setShowOfferModal(false)} className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white border-2 border-black"><X size={20} /></button>
                        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                            <Percent size={24} className="text-mustard" />
                            <h2 className="text-3xl font-black italic uppercase">Manage Offer</h2>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-6">{offerProduct.name}</p>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">MRP (₹)</label>
                                    <input type="number" min="0" value={offerMrp} onChange={e => setOfferMrp(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" placeholder="e.g. 799" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Discount %</label>
                                    <input type="number" min="0" max="90" value={offerDiscount} onChange={e => setOfferDiscount(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" placeholder="e.g. 50" />
                                </div>
                            </div>

                            {offerMrp && (
                                <div className="p-4 bg-black text-cream flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-cream/50">Selling Price</span>
                                        {offerDiscount && parseInt(offerDiscount) > 0 && (
                                            <p className="text-[10px] line-through text-cream/30 mt-1">MRP: ₹{parseFloat(offerMrp).toLocaleString()}</p>
                                        )}
                                    </div>
                                    <span className="font-black text-2xl text-mustard">₹{computedOfferSellingPrice.toLocaleString()}</span>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2 block">Offer Label (Optional)</label>
                                <input value={offerLabelEdit} onChange={e => setOfferLabelEdit(e.target.value)} className="w-full bg-transparent border-2 border-black p-3 outline-none font-bold" placeholder="e.g. Flash Sale, Limited Time" />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/50">Offer Active</label>
                                <button
                                    type="button"
                                    onClick={() => setOfferActive(!offerActive)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${offerActive ? 'bg-green-500' : 'bg-black/20'}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${offerActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                                <span className="text-xs font-bold">{offerActive ? 'ON' : 'OFF'}</span>
                            </div>

                            <button
                                onClick={handleSaveOffer}
                                disabled={savingOffer}
                                className="w-full btn-admin bg-black text-cream py-4 font-black uppercase tracking-[0.2em] mt-4"
                            >
                                {savingOffer ? 'SAVING...' : 'SAVE OFFER →'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
