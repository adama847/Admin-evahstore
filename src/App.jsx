import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

export default function App() {
  // 1. Initialisation avec nettoyage automatique des "faux" tokens
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem("evah_token");
    // On ne garde que si c'est un vrai token (pas "null", pas "undefined", pas vide)
    if (!saved || saved === "undefined" || saved === "null" || saved.trim() === "") {
      localStorage.removeItem("evah_token");
      return null;
    }
    return saved;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

 const handleLogin = (newToken, adminName) => {
  if (newToken) {
    localStorage.setItem("evah_token", newToken);
    // Optionnel : tu peux aussi stocker le nom pour l'afficher dans la Sidebar
    if (adminName) localStorage.setItem("evah_admin_name", adminName);
    
    setToken(newToken);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("evah_token");
    setToken(null);
  };

  // 2. BLOCAGE STRICT : Si pas de token, on ne montre que le Login
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 3. ACCÈS AUTORISÉ : Dashboard & Sidebar
  return (
    <div className="flex min-h-screen bg-gray-200 text-black">
      <Sidebar
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        adminName="Admin"
      />

      <div className="flex-1 md:ml-64 relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 z-50 bg-[#D4AF37] text-black px-3 py-1 rounded-lg font-bold"
          >
            ☰
          </button>
        )}

        <div className="p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard token={token} />} />
            <Route path="/products" element={<Products token={token} />} />
            <Route path="/settings" element={<Settings token={token} />} />
            
            {/* Redirections intelligentes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
