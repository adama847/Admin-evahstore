import React from "react";

export default function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card bg-white p-4 rounded-xl flex flex-col items-center border border-[#D4AF37]">
      <div className="stat-icon text-3xl mb-2">{icon}</div>
      <div className="stat-value text-2xl font-bold mb-1">{value}</div>
      <div className="stat-label text-gray-400 text-sm">{label}</div>
    </div>
  );
}