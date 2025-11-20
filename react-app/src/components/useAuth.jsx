import { useState, useEffect } from "react";
import { fetchWithRefresh } from "./fetchWithRefresh";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      setLoading(true);
      try {
        const res = await fetchWithRefresh("http://localhost:3000/usuarios/me");
        if (!res.ok) {
          logout();
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error verificando sesión:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return { ok: false, error: "Credenciales incorrectas" };

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      // Llamada usando fetchWithRefresh para setear user
      const me = await fetchWithRefresh("http://localhost:3000/usuarios/me");
      if (me.ok) {
        const usuario = await me.json();
        setUser(usuario);
      }

      return { ok: true };
    } catch (err) {
      console.error("Error en login:", err);
      return { ok: false, error: "Error del servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, loading, login, logout };
}