const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Registrera användare
 * @param {Object} userData - { name, email, password }
 */
export async function register(userData) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registrering misslyckades");
    return data;
  } catch (err) {
    throw new Error(err.message || "Nätverksfel vid registrering");
  }
}

/**
 * Logga in användare
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Felaktiga inloggningsuppgifter");

    // 🔹 Spara token & user lokalt
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (err) {
    throw new Error(err.message || "Nätverksfel vid inloggning");
  }
}

/**
 * Logga ut användare
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}