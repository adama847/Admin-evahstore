import React, { useEffect, useState } from "react";
import { getStats } from "../services/api";
import toast from "react-hot-toast";

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

  if (loading) return <div className="text-white text-center">Chargement des statistiques...</div>;

  const statCards = [
    { id: "stat-total", label: "Total Produits", value: stats.total, icon: "📦" },
    { id: "stat-bracelet", label: "Fétiches & Bracelets", value: stats.bracelet, icon: "💎" },
    { id: "stat-bestseller", label: "Best Sellers", value: stats.bestseller, icon: "✨" },
    { id: "stat-perruque", label: "Perruques", value: stats.perruque, icon: "🌊" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Tableau de bord</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.id}
            className="stat-card bg-gray-800 border border-yellow-700 p-4 rounded-xl flex flex-col items-center justify-center gap-2"
          >
            <div className="stat-icon text-3xl">{card.icon}</div>
            <div id={card.id} className="stat-value text-xl font-bold text-yellow-400">
              {card.value}
            </div>
            <div className="stat-label text-gray-400 text-xs uppercase">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}