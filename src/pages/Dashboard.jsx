import React, { useEffect, useState } from "react";
import { getStats, getProducts } from "../services/api"; // Ajoutez getProducts
import toast from "react-hot-toast";
import { GiBigDiamondRing } from "react-icons/gi";

export default function Dashboard({ token }) {
  const [stats, setStats] = useState({ total: 0, bracelet: 0, bestseller: 0, perruque: 0 });
  const [allProducts, setAllProducts] = useState([]); // Stocker tous les produits
  const [filteredProducts, setFilteredProducts] = useState([]); // Produits à afficher
  const [viewTitle, setViewTitle] = useState(""); // Titre de la section liste
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        const [statsData, productsData] = await Promise.all([
          getStats(token),
          getProducts(token)
        ]);
        
        setStats({
          total: statsData?.total || 0,
          bracelet: statsData?.bracelet || 0,
          bestseller: statsData?.bestseller || 0,
          perruque: statsData?.perruque || 0,
        });
        setAllProducts(productsData || []);
      } catch (error) {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Fonction pour filtrer lors du clic
  const handleFilter = (category, label) => {
    setViewTitle(label);
    if (category === "total") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === category);
      setFilteredProducts(filtered);
    }
  };

  const statCards = [
    { id: "total", label: "Total Produits", value: stats.total, icon: <GiBigDiamondRing /> },
    { id: "bracelet", label: "Fétiches & Bracelets", value: stats.bracelet, icon: "💎" },
    { id: "bestseller", label: "Best Sellers", value: stats.bestseller, icon: "✨" },
    { id: "perruque", label: "Perruques", value: stats.perruque, icon: "🌊" },
  ];

  if (loading) return <div className="text-black text-center p-10">Chargement...</div>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-black uppercase tracking-widest">Tableau de bord</h2>
      
      {/* Grille des stats cliquables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleFilter(card.id, card.label)}
            className="bg-white border-b-4 border-[#D4AF37] shadow-lg p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 text-center"
          >
            <div className="text-4xl bg-gray-50 p-3 rounded-full">{card.icon}</div>
            <div className="text-3xl font-black text-black">{card.value}</div>
            <div className="text-gray-500 font-medium text-[10px] tracking-widest uppercase">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Liste filtrée */}
      {viewTitle && (
        <div className="mt-10 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-l-4 border-[#D4AF37] pl-4">
            <h3 className="text-xl font-bold text-black">{viewTitle} ({filteredProducts.length})</h3>
            <button onClick={() => setViewTitle("")} className="text-sm text-gray-400 hover:text-red-500">Fermer</button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4">Catégorie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-[#D4AF37] font-bold">{product.price} FCFA</td>
                    <td className="p-4 text-xs italic text-gray-400">{product.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <p className="p-10 text-center text-gray-400">Aucun produit dans cette catégorie.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
