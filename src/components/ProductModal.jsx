import React, { useEffect, useState } from "react";

export default function ProductModal({ isOpen, onClose, onSave, onDelete, product }) {
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        badge: "",
        description: "",
        imageUrl: "",
        imageFile: null,
    });

    const secureUrl = (url) => {
        if (!url) return "";
        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        return isLocal ? url : url.replace("http://", "https://");
    };

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                price: product.price || "",
                category: product.category || "",
                badge: product.badge || "",
                description: product.description || "",
                imageUrl: secureUrl(product.image_url) || "",
                imageFile: null,
            });
        } else {
            setForm({ name: "", price: "", category: "", badge: "", description: "", imageUrl: "", imageFile: null });
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setForm({ ...form, imageFile: files[0] });
        } else {
            setForm({ ...form, [name]: name === "imageUrl" ? secureUrl(value) : value });
        }
    };

    if (!isOpen) return null;

    const previewSrc = form.imageFile ? URL.createObjectURL(form.imageFile) : form.imageUrl;
    const isVideo = form.imageFile?.type?.startsWith("video") || form.imageUrl?.toLowerCase().endsWith(".mp4");

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-black border border-[#D4AF37] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-5 border-b border-[#D4AF37]/30">
                    <h2 className="text-[#D4AF37] font-serif text-lg uppercase tracking-widest">{product ? "Détails & Edition" : "Nouveau Produit"}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition">✕</button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {previewSrc && (
                        <div className="relative h-40 w-full mb-4">
                            {isVideo ? (
                                <video src={previewSrc} autoPlay muted loop className="w-full h-full object-cover rounded-xl border border-[#D4AF37]/40" />
                            ) : (
                                <img src={previewSrc} alt="Preview" className="w-full h-full object-cover rounded-xl border border-[#D4AF37]/40" />
                            )}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nom" className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-[#D4AF37] outline-none" />
                        <input type="text" name="price" value={form.price} onChange={handleChange} placeholder="Prix" className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-[#D4AF37] outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-[#D4AF37] outline-none">
                            <option value="bracelet">Fétiche & Bracelet</option>
                            <option value="bestseller">Best Seller</option>
                            <option value="perruque">Perruque</option>
                        </select>
                        <select name="badge" value={form.badge} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-[#D4AF37] outline-none">
                            <option value="">Badge (Aucun)</option>
                            <option value="Nouveau">Nouveau</option>
                            <option value="Promo">Promo</option>
                        </select>
                    </div>

                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description..." className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:border-[#D4AF37] outline-none h-24" />

                    <div className="space-y-2">
                        <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Lien URL de l'image" className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs outline-none" />
                        <input type="file" onChange={handleChange} className="w-full text-xs text-gray-100 file:bg-[#D4AF37] file:rounded-lg file:border-0 file:px-3 file:py-1 file:font-bold file:mr-3 cursor-pointer" />
                    </div>
                </div>

                <div className="p-5 border-t border-[#D4AF37]/30 bg-gray-900/50 flex flex-wrap gap-3 items-center">
                    {product && (
                        <button onClick={() => { onDelete(product.id); onClose(); }} className="px-4 py-2 bg-red-600/10 border border-red-600 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition text-sm font-bold">
                            Supprimer
                        </button>
                    )}
                    <div className="flex gap-3 ml-auto">
                        <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Annuler</button>
                        <button onClick={() => onSave(form)} className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:scale-105 transition shadow-lg shadow-[#D4AF37]/20">
                            {product ? "Enregistrer" : "Créer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
