export const API =
  window.location.hostname.includes("127.0.0.1") ||
  window.location.hostname.includes("localhost")
    ? "http://localhost:8000/api"
    : "https://evahstore-backend-production.up.railway.app/api";

export function authHeaders(token) {
  return {
    Authorization: "Bearer " + token,
    Accept: "application/json",
  };
}

// --- AUTH ---
export async function login(username, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json(); // doit renvoyer { token, user }
}

export async function logout(token) {
  return fetch(`${API}/auth/logout`, { method: "POST", headers: authHeaders(token) });
}

export async function changePassword(token, password) {
  const res = await fetch(`${API}/auth/change-password`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      new_password: password,
      new_password_confirmation: password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}

// --- STATS ---
export async function getStats(token) {
  const res = await fetch(`${API}/stats`, { headers: authHeaders(token) });
  return res.json();
}

// --- PRODUCTS ---
export async function getProducts(token) {
  const res = await fetch(`${API}/products`, { headers: authHeaders(token) });
  return res.json();
}

export async function saveProduct(token, formData, id) {
  let method = "POST";
  let url = `${API}/products`;
  if (id) {
    formData.append("_method", "PUT");
    url = `${API}/products/${id}`;
  }
  const res = await fetch(url, { method, headers: authHeaders(token), body: formData });
  return res.json();
}

export async function deleteProduct(token, id) {
  const res = await fetch(`${API}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return res.json();
}