import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, saveProduct, deleteProduct } from "../services/api";
import ProductModal from "../components/ProductModal";
import { Loader2 } from "lucide-react";

// MODIFICATION : Remplace par l'URL de ton backend Laravel
const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:8000" 
  : "https://evahstore-backend-production.up.railway.app"; 

export default function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const secureUrl = (path) => {
    if (!path) return "";
    
    if (path.startsWith("http")) {
      return window.location.hostname === "localhost"
        ? path
        : path.replace("http://", "https://");
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const storagePath = cleanPath.startsWith('/storage')
      ? cleanPath
      : `/storage${cleanPath}`;
    
    return `${API_BASE_URL}${storagePath}`;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts(token);
        setProducts(data || []);
      } catch (err) {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [token]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // ✅ FIX : state sécurisé + UX fluide
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      await deleteProduct(token, id);

      setProducts(prev => prev.filter(p => p.id !== id));

      toast.success("Produit supprimé");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // ✅ FIX : state sécurisé
  const handleSave = async (form) => {
    const formData = new FormData();

    Object.keys(form).forEach(key => {
      if (key === 'imageFile' && form[key]) {
        const file = form[key] instanceof FileList ? form[key][0] : form[key];
        if (file) formData.append("image", file);
      } else if (key === 'imageUrl' && form[key]) {
        formData.append("image_url", form[key]);
      } else if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    try {
      const saved = await saveProduct(token, formData, editingProduct?.id);

      setProducts(prev => 
        editingProduct
          ? prev.map(p => (p.id === saved.id ? saved : p))
          : [saved, ...prev]
      );

      toast.success(editingProduct ? "Modifié !" : "Ajouté !");
      setModalOpen(false);
    } catch (err) {
      toast.error("Erreur de sauvegarde");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
    </div>
  );

  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-2 mt-10 sm:mt-16 max-w-7xl space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest border-l-4 border-[#D4AF37] pl-4">
          Catalogue Admin
        </h2>
        <button 
          onClick={() => { 
            setEditingProduct(null); 
            setModalOpen(true); 
          }} 
          className="bg-[#D4AF37] px-4 py-2 rounded-full font-bold text-black hover:bg-yellow-500 transition shadow-lg"
        >
          + Nouveau Produit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => handleEdit(product)} 
            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 group"
          >
            <div className="relative h-72 overflow-hidden bg-gray-50">

              {product.is_video ? (
                <video 
                  src={secureUrl(product.image_url)} 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata" // ✅ petit gain perf
                />
              ) : (
                <img 
                  src={secureUrl(product.image_url)} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = "https://placeholder.com"; }}
                />
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-xl uppercase">
                  Gérer le produit
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-serif text-xl font-bold text-gray-900">
                {product.name}
              </h3>
              <p className="text-[#D4AF37] font-bold text-lg mt-1">
                {product.price} FCFA
              </p>
              <p className="text-gray-400 text-xs mt-2 uppercase">
                {product.category}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ProductModal 
        isOpen={modalOpen} 
        product={editingProduct} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSave} 
        onDelete={handleDelete} 
      />
    </div>
  );
}