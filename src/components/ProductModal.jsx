import React, { useEffect, useState } from "react";

export default function ProductModal({ isOpen, onClose, onSave, product }) {
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        badge: "",
        description: "",
        imageUrl: "",
        imageFile: null,
    });

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                price: product.price || "",
                category: product.category || "",
                badge: product.badge || "",
                description: product.description || "",
                imageUrl: product.image_url || "",
                imageFile: null,
            });
        } else {
            setForm({ name: "", price: "", category: "", badge: "", description: "", imageUrl: "", imageFile: null });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm({ ...form, imageFile: files[0] });
        else setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => onSave(form);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">
            <div className="bg-[#000000] border border-[#D4AF37] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-[#D4AF37]">
                    <h2 className="text-[#D4AF37] font-serif text-xl">{product ? "Modifier Produit" : "Nouveau Produit"}</h2>
                    <button onClick={onClose} className="text-gray-400 text-xl hover:text-white">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400 uppercase mb-1 block">Nom *</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 border border-[#D4AF37] text-black" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase mb-1 block">Prix *</label>
                            <input type="text" name="price" value={form.price} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 border border-[#D4AF37] text-black" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-50 uppercase mb-1 block">Catégorie *</label>
                            <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 border border-[#D4AF37] text-black">
                                <option value="">— Choisir —</option>
                                <option value="bracelet">Fétiche & Bracelet</option>
                                <option value="bestseller">Best Seller</option>
                                <option value="perruque">Perruque</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase mb-1 block">Badge</label>
                            <select name="badge" value={form.badge} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 border border-[#D4AF37] text-black">
                                <option value="">Aucun</option>
                                <option value="Nouveau">Nouveau</option>
                                <option value="Promo">Promo</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-50 uppercase mb-1 block">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 border border-[#D4AF37] text-black" />
                    </div>

                    <div>
                        <label className="text-xs text-gray-50 uppercase mb-1 block">Image (URL ou fichier)</label>
                        <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-200 border border-[#D4AF37] text-black mb-2" placeholder="https://..." />
                        <input type="file" name="imageFile" onChange={handleChange} className="text-gray-900 border bg-gray-300 hover:bg-gray-400 rounded-2xl py-2 ms-2 mb-2" />
                        {(form.imageFile?.type?.startsWith("video") || form.imageUrl?.endsWith(".mp4")) ? (
                            <video
                                src={form.imageFile ? URL.createObjectURL(form.imageFile) : form.imageUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                className="w-full h-60 object-cover rounded-md border"
                            />
                        ) : (
                            <img
                                src={form.imageFile ? URL.createObjectURL(form.imageFile) : form.imageUrl}
                                alt="Preview"
                                className="w-full h-60 object-cover rounded-md border"
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-yellow-700">
                    <button className="px-4 py-2 rounded-lg bg-gray-700 border border-yellow-700 text-white" onClick={onClose}>Annuler</button>
                    <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black" onClick={handleSubmit}>✦ Enregistrer</button>
                </div>
            </div>
        </div>
    );
}