import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  adminName = "Admin",
}) {

  const navItems = [
    { label: "Tableau de bord", icon: "◈", path: "/" },
    { label: "Produits", icon: "◇", path: "/products" },
    { label: "Paramètres", icon: "⚙", path: "/settings" },
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#000000] text-gray-300 border-r border-[#D4AF37] flex flex-col z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#D4AF37]">
          <h2 className="text-[#D4AF37] font-serif text-xl">EvahStore</h2>
          <span className="text-sm text-gray-500 uppercase">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="text-xs text-gray-500 uppercase mb-2">Menu</div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg mb-1 transition
                ${
                  isActive
                    ? "text-[#D4AF37] bg-[#D4AF37]/20 border border-[#D4AF37]"
                    : "hover:bg-[#D4AF37]/10 hover:text-white"
                }`
              }
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Profile + Logout */}
        <div className="p-5 border-t border-[#D4AF37]">
          <div className="flex items-center gap-3 bg-[#D4AF37]/20 p-3 rounded-lg">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#D4AF37] text-black">
              {adminName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{adminName}</strong>
              <small className="block text-gray-500 text-xs">EvahStore</small>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="mt-2 w-full border border-gray-600 text-gray-400 rounded-md py-3 text-sm hover:border-red-500 hover:text-red-500"
          >
            ↩ Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}