import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, saveProduct, deleteProduct } from "../services/api";
import ProductModal from "../components/ProductModal";

export default function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Charger les produits
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
    if (form.imageFile) formData.append("image", form.imageFile);
    else if (form.imageUrl) formData.append("image_url", form.imageUrl);

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

  if (loading) return <div className="text-white text-center">Chargement des produits...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Liste des Produits</h2>
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
      >
     Ajouter un produit
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 && <div className="text-gray-400">Aucun produit trouvé.</div>}
        {products.map(product => (
          <div key={product.id} className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between border border-yellow-700">
            <div>
              <h3 className="text-white font-semibold">{product.name}</h3>
              <p className="text-gray-400 text-sm">{product.description}</p>
              <p className="text-yellow-400 font-bold mt-2">{product.price} XOF</p>
         {product.image_url && (
  product.is_video ? (
    <video
      src={product.image_url}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="w-full h-40 object-cover rounded-md border border-yellow-700 mt-2"
    />
  ) : (
    <img
      src={product.image_url}
      alt={product.name}
      loading="lazy"
      className="w-full h-40 object-cover rounded-md border border-yellow-700 mt-2"
    />
  )
)}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 py-1 text-xs text-blue-400 border border-blue-400 rounded hover:bg-blue-400 hover:text-white transition"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 py-1 text-xs text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
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
    </div>
  );
}