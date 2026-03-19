import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, saveProduct, deleteProduct } from "../services/api";
import ProductModal from "../components/ProductModal";

export default function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // FONCTION CORRIGÉE : Ne force le HTTPS que si on n'est pas en local
  const secureUrl = (url) => {
    if (!url) return "";
    
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    if (isLocal) {
      // En local, on garde le HTTP (ou l'URL originale)
      return url;
    }
    
    // En production (Railway), on force le HTTPS pour éviter le "Mixed Content"
    return url.replace("http://", "https://");
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts(token);
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [token]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await deleteProduct(token, id);
      setProducts(products.filter(p => p.id !== id));
      toast.success("Produit supprimé !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de supprimer le produit");
    }
  };

  const handleSave = async (form) => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("badge", form.badge);
    formData.append("description", form.description);
    
    if (form.imageFile) {
        formData.append("image", form.imageFile);
    } else if (form.imageUrl) {
        formData.append("image_url", form.imageUrl);
    }

    try {
      const saved = await saveProduct(token, formData, editingProduct?.id);
      if (editingProduct) {
        setProducts(products.map(p => (p.id === saved.id ? saved : p)));
        toast.success("Produit modifié !");
      } else {
        setProducts([saved, ...products]);
        toast.success("Produit ajouté !");
      }
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de sauvegarder le produit");
    }
  };

  if (loading) return <div className="text-black text-center mt-10">Chargement des produits...</div>;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold text-black sm:text-center uppercase tracking-widest">Liste des Produits</h2>
      <button
        onClick={handleAdd}
        className="px-6 py-2 bg-[#D4AF37] font-bold text-black rounded-lg shadow hover:bg-yellow-500 transition duration-300"
      >
        + Ajouter un produit
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 && <div className="text-gray-500">Aucun produit trouvé.</div>}
        {currentProducts.map(product => (
          <div key={product.id} className="bg-white group relative p-0 rounded-xl flex flex-col shadow-lg overflow-hidden border border-gray-100 justify-between z-10">
            <div>
              {product.image_url && (
                product.is_video ? (
                  <video
                    src={secureUrl(product.image_url)} 
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <img
                    src={secureUrl(product.image_url)} 
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-80 object-cover"
                  />
                )
              )}
              <div className="p-4">
                <h3 className="text-black text-xl font-bold font-serif">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">{product.description}</p>
                <p className="text-[#D4AF37] font-bold mt-2 text-lg">{product.price} FCFA</p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-black/60 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Supprimer
                </button>
            </div>
          </div>
        ))}
      </div>

      <ProductModal
        isOpen={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-300 transition"
          >
            Précédent
          </button>
          <span className="font-semibold text-black">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-300 transition"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
