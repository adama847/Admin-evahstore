import React, { useState } from "react";
import { changePassword } from "../services/api";
import toast from "react-hot-toast";

export default function Settings({ token }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      const res = await changePassword(token, password);
      if (res.success) {
        toast.success("Mot de passe changé !");
        setPassword("");
      } else toast.error(res.message || "Erreur");
    } catch (err) {
      toast.error("Erreur serveur");
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400">Paramètres</h1>
      <div className="max-w-md space-y-4 bg-gray-800 p-6 border border-yellow-700 rounded-xl">
        <label className="text-xs text-gray-400 uppercase">Nouveau mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 border border-yellow-700 text-white"
        />
        <button
          onClick={handlePasswordChange}
          className="w-full py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Changer le mot de passe"}
        </button>
      </div>
    </div>
  );
}