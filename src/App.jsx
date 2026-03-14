import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

export default function App() {
  // Token initial depuis localStorage
  const [token, setToken] = useState(localStorage.getItem("evah_token"));
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("evah_token");
    setToken(null);
    setLoggedIn(false);
  };

  // Login → on stocke le token et on passe loggedIn à true
  const handleLogin = (newToken) => {
    localStorage.setItem("evah_token", newToken);
    setToken(newToken);
    setLoggedIn(true);
  };

  // Si pas connecté → afficher le login
  if (!loggedIn) return <Login onLogin={handleLogin} />;

  // Déterminer la page à afficher avec token
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard token={token} />;
      case "products":
        return <Products token={token} />;
      case "settings":
        return <Settings token={token} />;
      default:
        return <Dashboard token={token} />;
    }
  };

  return (
    <div className="flex-1 md:ml-64 min-h-screen bg-gray-200 text-black">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage} // navigation
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Contenu principal */}
      <div className="flex-1 relative">
        {/* Bouton mobile pour ouvrir le sidebar */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden absolute top-4 left-4 z-50 bg-[#D4AF37] text-black px-3 py-1 rounded-lg font-bold"
          >
            ☰
          </button>
        )}

        <div className="p-6 ">{renderPage()}</div>
      </div>
    </div>
  );
}