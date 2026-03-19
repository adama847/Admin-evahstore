// Définition dynamique de l'URL de l'API
export const API =
  window.location.hostname.includes("127.0.0.1") ||
  window.location.hostname.includes("localhost")
    ? "http://localhost:8000/api"
    : "https://evahstore-backend-production.up.railway.app";

// Helper pour les headers (Centralisé)
export function authHeaders(token) {
  return {
    Authorization: "Bearer " + token,
    Accept: "application/json",
    // Note : Ne PAS ajouter 'Content-Type' ici car fetch le gère 
    // automatiquement pour les FormData (multipart/form-data)
  };
}

// Helper pour gérer la réponse JSON et les erreurs HTTP
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw data; // Permet de récupérer les erreurs (401, 422, 500) dans un bloc try/catch
  }
  return data;
}

// --- AUTH ---
export async function login(username, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Accept": "application/json" 
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function logout(token) {
  const res = await fetch(`${API}/auth/logout`, { 
    method: "POST", 
    headers: authHeaders(token) 
  });
  return handleResponse(res);
}

export async function changePassword(token, password) {
  const res = await fetch(`${API}/auth/change-password`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      new_password: password,
      new_password_confirmation: password,
    }),
  });
  return handleResponse(res);
}

// --- STATS ---
export async function getStats(token) {
  const res = await fetch(`${API}/stats`, { 
    headers: authHeaders(token) 
  });
  return handleResponse(res);
}

// --- PRODUCTS ---
export async function getProducts(token) {
  const res = await fetch(`${API}/products`, { 
    headers: authHeaders(token) 
  });
  return handleResponse(res);
}

export async function saveProduct(token, formData, id = null) {
  let method = "POST"; // On utilise toujours POST car FormData ne supporte pas nativement PUT en PHP
  let url = `${API}/products`;
  
  if (id) {
    // Technique Laravel pour simuler un PUT avec un FormData
    formData.append("_method", "PUT");
    url = `${API}/products/${id}`;
  }

  const res = await fetch(url, { 
    method: "POST", // On garde POST même pour la modification (grâce au _method ajouté au formData)
    headers: authHeaders(token), 
    body: formData 
  });
  
  return handleResponse(res);
}

export async function deleteProduct(token, id) {
  const res = await fetch(`${API}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}
