import React, { useState } from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

export default function App() {

  const [token, setToken] = useState(localStorage.getItem("evah_token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // login
  const handleLogin = (newToken) => {
    localStorage.setItem("evah_token", newToken);
    setToken(newToken);
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("evah_token");
    setToken(null);
  };

  // route protégée
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <>

      {!token ? (

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

      ) : (

        <div className="flex min-h-screen bg-gray-200 text-black">

          <Sidebar
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
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

                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard token={token} />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/products"
                  element={
                    <PrivateRoute>
                      <Products token={token} />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings token={token} />
                    </PrivateRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" />} />

              </Routes>

            </div>

          </div>

        </div>

      )}
</>
  );
}