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
  // Sécurité supplémentaire : si pas de token, on ne fait rien
  if (!token) return; 

  async function fetchStats() {
    try {
      const data = await getStats(token);
      setStats({
        total: data?.total || 0,
        bracelet: data?.bracelet || 0,
        bestseller: data?.bestseller || 0,
        perruque: data?.perruque || 0,
      });
    } catch (error) {
      toast.error("Session expirée ou invalide");
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
    className="bg-white border-b-4 border-[#D4AF37] shadow-lg p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105"
  >
    <div className="text-4xl bg-gray-50 p-3 rounded-full">{card.icon}</div>
    <div className="text-3xl font-black text-black">{card.value}</div>
    <div className="text-gray-500 font-medium text-[10px] tracking-widest uppercase">{card.label}</div>
  </div>
))}
      </div>
    </div>
  );
}