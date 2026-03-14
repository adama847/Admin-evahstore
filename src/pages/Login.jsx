import React, { useState } from "react";
import toast from "react-hot-toast";
import { login } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // Vérifier champs vides
    if (!username || !password) {
      setErrorMessage("Veuillez saisir vos données");
      return;
    }

    setLoading(true);

    try {

      const res = await login(username, password);

      if (res.token) {

        setSuccessMessage("Connexion réussie ✅");
        toast.success("Connexion réussie !");
        onLogin(res.token, res.username);

      } else {

        setErrorMessage(res.error || "Mot de passe incorrect");

      }

    } catch (err) {

      console.error(err);
      setErrorMessage("Erreur serveur");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-black p-8 rounded-2xl w-full max-w-md border border-[#D4AF37]">

        <h2 className="text-2xl text-[#D4AF37] font-serif mb-6 text-center">
          Connexion Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* username */}

          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-white border border-[#D4AF37] text-gray-800"
          />

          {/* password */}

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-[#D4AF37] text-gray-800 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#D4AF37] text-white font-bold hover:bg-yellow-300 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>

        {/* Messages */}

        {errorMessage && (
          <p className="text-red-500 text-center text-sm mt-3">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="text-green-500 text-center text-sm mt-3">
            {successMessage}
          </p>
        )}

      </div>

    </div>

  );
}