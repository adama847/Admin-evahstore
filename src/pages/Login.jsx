import React, { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.token) {
        toast.success("Connexion réussie !");
        onLogin(res.token, res.user);
      } else {
        toast.error(res.message || "Erreur de connexion");
      }
    } catch (err) {
      toast.error("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-yellow-700">
        <h2 className="text-2xl text-yellow-400 font-serif mb-6 text-center">Connexion Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-yellow-700 text-white"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-yellow-700 text-white"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}