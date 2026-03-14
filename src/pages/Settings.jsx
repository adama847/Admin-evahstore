import React, { useState } from "react";
import { changePassword } from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Settings({ token }) {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowconfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  

  // 🔐 calcul force du mot de passe
  const getStrength = () => {
    if (password.length < 6) return { label: "Faible", color: "bg-red-500" };
    if (password.length < 10) return { label: "Moyen", color: "bg-yellow-500" };
    return { label: "Fort", color: "bg-green-500" };
  };

  const strength = getStrength();

   const handlePasswordChange = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    // 1️⃣ Vérifier si les champs sont remplis
    if (!password || !confirmPassword) {
      setErrorMessage("Veuillez remplir le mot de passe");
      return;
    }

    // 2️⃣ Vérifier si les mots de passe sont identiques
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    // 3️⃣ Vérifier la longueur
    if (password.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword(token, password);

      setSuccessMessage(res.message || "Mot de passe modifié avec succès ✅");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.log(error);
      setErrorMessage(
        error?.errors ? Object.values(error.errors)[0][0] : "Erreur serveur"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-black sm:text-center">
        Paramètres
      </h1>

      <div className="w-full py-8 space-y-4 bg-[#000000] p-6  rounded-xl">

        {/* nouveau mot de passe */}
        <label className="text-xs  text-[#D4AF37] font-semibold uppercase">
          Nouveau mot de passe
        </label>

        <div className="relative mt-2">

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 rounded-lg bg-gray-100 border border-black text-black"
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-black"
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>


        </div>


        {/* force password */}

        {password && (
          <div className="space-y-1">

            <div className="w-full h-2 bg-gray-700 rounded">
              <div className={`h-2 rounded ${strength.color}`} style={{ width: `${Math.min(password.length * 10, 100)}%` }}></div>
            </div>

            <p className="text-xs text-black uppercase">
              Force du mot de passe : {strength.label}
            </p>

          </div>
        )}

        {/* confirmation */}

        <label className="text-xs   text-[#D4AF37] font-semibold uppercase">
          Confirmer le mot de passe
        </label>
<div className="relative mt-2 ">
        <input
          type={showconfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-100 border border-black text-black"
        />
         <button
            onClick={() => setShowconfirmPassword(!showconfirmPassword)}
            className="absolute right-3 top-3 text-black"
          >
            {showconfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>
</div>

        {/* bouton */}

        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#D4AF37] text-white font-bold hover:bg-yellow-500 transition"
        >
          {loading ? "Modification..." : "Changer le mot de passe"}
        </button>
 {errorMessage && (
        <p className="text-red-500 text-center text-sm mt-2">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-center text-sm mt-2">{successMessage}</p>
      )}
      </div>
    </div>
  );
}