import React from "react";

export default function Sidebar({
  activePage,
  setActivePage,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  adminName = "Admin",
}) {
  const navItems = [
    { name: "dashboard", label: "Tableau de bord", icon: "◈" },
    { name: "products", label: "Produits", icon: "◇" },
    { name: "settings", label: "Paramètres", icon: "⚙" },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-300 border-r border-yellow-700 flex flex-col z-50 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-yellow-700">
          <h2 className="text-yellow-400 font-serif text-xl">EvahStore</h2>
          <span className="text-sm text-gray-500 uppercase">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="text-xs text-gray-500 uppercase mb-2">Menu</div>
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                setActivePage(item.name);
                setSidebarOpen(false); // ferme le sidebar sur mobile
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-1 transition
                ${activePage === item.name
                  ? "text-yellow-400 bg-yellow-400/20 border border-yellow-700"
                  : "hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Footer / Profile + Logout */}
        <div className="p-5 border-t border-yellow-700">
          <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-yellow-300 text-black">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{adminName}</strong>
              <small className="block text-gray-500 text-xs">EvahStore</small>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-2 w-full border border-gray-600 text-gray-400 rounded-md py-1 text-xs hover:border-red-500 hover:text-red-500"
          >
            ↩ Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}