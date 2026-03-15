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
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

const totalPages = Math.ceil(products.length / productsPerPage);
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

  if (loading) return <div className="text-black text-center">Chargement des produits...</div>;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold text-black sm:text-center">Liste des Produits</h2>
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-[#D4AF37] font-bold text-black rounded hover:bg-yellow-500 transition"
      >
        Ajouter un produit
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 && <div className="text-gray-400">Aucun produit trouvé.</div>}
        {currentProducts.map(product => (
          <div key={product.id} className="bg-white group relative p-0 rounded-lg flex flex-col shadow justify-between z-10  ">
            <div>
              {product.image_url && (
                product.is_video ? (
                  <video
                    src={product.image_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-100 h-80 object-cover rounded-md "
                  />
                ) : (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                    className="w-100 h-80 object-cover rounded-md  "
                  />
                )
              )}
              <h3 className="text-black mt-2  ms-5 text-xl font-bold font-serif">{product.name}</h3>
              <p className="text-black ms-5 text-sm">{product.description}</p>
              <p className="text-[#D4AF37] ms-5 mb-13 font-semibold mt-2">{product.price} FCFA</p>

            </div>
            <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">

    <button
      onClick={() => handleEdit(product)}
      className="flex-1 py-2 text-xs bg-blue-500 text-white rounded"
    >
      Modifier
    </button>

    <button
      onClick={() => handleDelete(product.id)}
      className="flex-1 py-2 text-xs bg-red-500 text-white rounded"
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

      <div className="flex justify-center items-center gap-4 mt-6">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Précédent
  </button>

  <span className="font-semibold">
    Page {currentPage} / {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
  >
    Suivant
  </button>

</div>
    </div>
  );
}