import React, { useEffect, useState } from "react";
import { getStats } from "../services/api";
import toast from "react-hot-toast";
import { GiBigDiamondRing } from "react-icons/gi";
export default function Dashboard({ token }) {
  const [stats, setStats] = useState({
    total: 0,
    bracelet: 0,
    bestseller: 0,
    perruque: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats(token);
        // Exemple de retour attendu : { total: 10, bracelet: 3, bestseller: 4, perruque: 3 }
        setStats({
          total: data.total || 0,
          bracelet: data.bracelet || 0,
          bestseller: data.bestseller || 0,
          perruque: data.perruque || 0,
        });
      } catch (error) {
        console.error("Erreur en récupérant les statistiques :", error);
        toast.error("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  if (loading) return <div className="text-black text-center">Chargement des statistiques...</div>;

  const statCards = [
    { id: "stat-total", label: "Total Produits ", value: stats.total, icon: <GiBigDiamondRing className="font-serif" /> },
    { id: "stat-bracelet", label: "Fétiches & Bracelets", value: stats.bracelet, icon: "💎" },
    { id: "stat-bestseller", label: "Best Sellers", value: stats.bestseller, icon: "✨" },
    { id: "stat-perruque", label: "Perruques", value: stats.perruque, icon: "🌊" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-black md:text-start  sm:text-center" >Tableau de bord</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.id}
            className="stat-card bg-white border border-[#D4AF37] p-4 rounded-xl flex flex-col items-center justify-center gap-2"
          >
            <div className="stat-icon text-4xl">{card.icon}</div>
            <div id={card.id} className="stat-value text-2xl font-bold text-[#D4AF37]">
              {card.value}
            </div>
            <div className="stat-label text-black font-serif text-xs uppercase">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}